const cron = require("node-cron");

const {
    getDueRecurringTransactions,
    updateRecurring,
} = require("../modules/reccuring/reccuring.repository");

const {
    createExpense,
    findRecurringExpense,
} = require("../modules/expense/expense.repository");

const {
    calculateNextRunDate,
} = require("../shared/utils/reccuringDate");

const {
    createRecurringNotificationService,
} = require("../modules/notification/notification.service");

const NOTIFICATION_TYPES = require(
    "../shared/constants/notificationTypes"
);


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

                const expense = await createExpense({
                    user: recurring.user,
                    category: recurring.category._id,
                    title: recurring.title,
                    amount: recurring.amount,
                    transactionType: recurring.transactionType,
                    paymentMethod: recurring.paymentMethod,
                    note: recurring.note,
                    date: recurring.nextRunDate,
                    recurringTransaction: recurring._id,
                });

                await createRecurringNotificationService(
                    recurring.user,
                    recurring._id,
                    expense._id,
                    recurring.nextRunDate,
                    "Recurring Expense Added",
                    `${recurring.title} of ₹${recurring.amount} has been added automatically.`
                );

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