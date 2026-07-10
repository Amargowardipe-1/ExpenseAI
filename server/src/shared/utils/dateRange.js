const getDateRange = (from, to) => {
  const startDate = new Date(from);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(to);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
  };
};

const getMonthRange = (month, year) => {
  const startDate = new Date(year, month - 1, 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(year, month, 0);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
  };
};

const getYearRange = (year) => {
  const startDate = new Date(year, 0, 1);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(year, 11, 31);
  endDate.setHours(23, 59, 59, 999);

  return {
    startDate,
    endDate,
  };
};

const getCurrentMonthRange = () => {
  const today = new Date();

  return getMonthRange(
    today.getMonth() + 1,
    today.getFullYear()
  );
};

const getCurrentYearRange = () => {
  const today = new Date();

  return getYearRange(today.getFullYear());
};

module.exports = {
  getDateRange,
  getMonthRange,
  getYearRange,
  getCurrentMonthRange,
  getCurrentYearRange,
};