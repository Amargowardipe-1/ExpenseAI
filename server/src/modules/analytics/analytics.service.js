const TRANSACTION_TYPES = require("../../shared/constants/transactionTypes");
const {
  getTrendDataDb,
  getCategorySummaryDb,
} = require("./analytics.repository");

const getAnalyticsDataService = async ({ userId, mode, year, month, weekStart }) => {
  let startDate;
  let endDate;
  let groupBy;

  if (mode === "yearly") {
    startDate = new Date(year, 0, 1);
    endDate = new Date(year, 11, 31, 23, 59, 59, 999);
    groupBy = "month";
  } else if (mode === "monthly") {
    startDate = new Date(year, month, 1);
    endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
    groupBy = "day";
  } else {
    // weekly
    // weekStart format is expected YYYY-MM-DD
    let wYear = year;
    let wMonth = month;
    let wDay = 1;

    if (weekStart) {
      const parts = weekStart.split("-").map(Number);
      if (parts.length === 3) {
        wYear = parts[0];
        wMonth = parts[1] - 1;
        wDay = parts[2];
      }
    }
    startDate = new Date(wYear, wMonth, wDay);
    endDate = new Date(wYear, wMonth, wDay + 6, 23, 59, 59, 999);
    groupBy = "dayOfWeek";
  }

  // Fetch trend aggregates & category aggregates in parallel
  const [trendResults, categorySummary] = await Promise.all([
    getTrendDataDb(userId, startDate, endDate, groupBy),
    getCategorySummaryDb(userId, startDate, endDate),
  ]);

  // Construct chart trend template based on mode
  let trendData = [];
  if (mode === "yearly") {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    trendData = monthNames.map((m) => ({ label: m, income: 0, expense: 0 }));

    trendResults.forEach((item) => {
      const mIdx = item._id.segment - 1; // 1-12 -> 0-11
      if (mIdx >= 0 && mIdx < 12) {
        const amount = item.total || 0;
        if (item._id.type === TRANSACTION_TYPES.INCOME) {
          trendData[mIdx].income += amount;
        } else {
          trendData[mIdx].expense += amount;
        }
      }
    });
  } else if (mode === "monthly") {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    trendData = Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      return {
        label: day === 1 || day % 5 === 0 ? String(day) : "",
        income: 0,
        expense: 0,
      };
    });

    trendResults.forEach((item) => {
      const dIdx = item._id.segment - 1; // 1-31 -> 0-30
      if (dIdx >= 0 && dIdx < daysInMonth) {
        const amount = item.total || 0;
        if (item._id.type === TRANSACTION_TYPES.INCOME) {
          trendData[dIdx].income += amount;
        } else {
          trendData[dIdx].expense += amount;
        }
      }
    });
  } else {
    // weekly
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    trendData = weekDays.map((d) => ({ label: d, income: 0, expense: 0 }));

    trendResults.forEach((item) => {
      const segment = item._id.segment; // 1 (Sun) to 7 (Sat)
      const dayIdx = segment === 1 ? 6 : segment - 2; // Sunday is 6, Mon-Sat are 0-5
      if (dayIdx >= 0 && dayIdx < 7) {
        const amount = item.total || 0;
        if (item._id.type === TRANSACTION_TYPES.INCOME) {
          trendData[dayIdx].income += amount;
        } else {
          trendData[dayIdx].expense += amount;
        }
      }
    });
  }

  // Calculate total expense sum from categorySummary
  const totalExpenses = categorySummary.reduce((sum, item) => sum + item.total, 0);

  return {
    trendData,
    categorySummary,
    totalExpenses,
  };
};

module.exports = {
  getAnalyticsDataService,
};
