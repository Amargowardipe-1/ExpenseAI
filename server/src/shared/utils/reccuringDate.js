const RECURRING_FREQUENCIES = require("../constants/recurringFrequencies");

const calculateNextRunDate = (
  currentDate,
  frequency
) => {
  const nextDate = new Date(currentDate);

  switch (frequency) {
    case RECURRING_FREQUENCIES.DAILY:
      nextDate.setDate(nextDate.getDate() + 1);
      break;

    case RECURRING_FREQUENCIES.WEEKLY:
      nextDate.setDate(nextDate.getDate() + 7);
      break;

    case RECURRING_FREQUENCIES.MONTHLY:
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;

    case RECURRING_FREQUENCIES.YEARLY:
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
  }

  return nextDate;
};

module.exports = {
  calculateNextRunDate,
};