const cron = require("node-cron");

const {
    getDueRecurringTransactions,
    updateRecurring,
} = require("../modules/recurring/recurring.repository");

const {
    createExpense,
} = require("../modules/expense/expense.repository");

const {
    calculateNextRunDate,
} = require("../shared/utils/recurringDate");

const startRecurringJob = () => {
    cron.schedule("* * * * *", async () => {
        try {
            console.log("Running recurring scheduler...");

            const currentDate = new Date();

            const recurringTransactions =
                await getDueRecurringTransactions(currentDate);

            for (const recurring of recurringTransactions) {

                const existingExpense =
                    await findRecurringExpense(
                        recurring._id,
                        recurring.nextRunDate
                    );

                if (existingExpense) {
                    continue;
                }

                await createExpense({
                    user: recurring.user,
                    category: recurring.category._id,
                    title: recurring.title,
                    amount: recurring.amount,
                    transactionType: recurring.transactionType,
                    paymentMethod: recurring.paymentMethod,
                    note: recurring.note,
                    date: recurring.nextRunDate,
                });

                const nextRunDate = calculateNextRunDate(
                    recurring.nextRunDate,
                    recurring.frequency
                );

                await updateRecurring(recurring._id, {
                    lastRunDate: recurring.nextRunDate,
                    nextRunDate,
                });
            }

            console.log(
                `${recurringTransactions.length} recurring transactions processed.`
            );
        } catch (error) {
            console.error("Recurring Scheduler Error:", error);
        }
    });
};

module.exports = {
    startRecurringJob,
};