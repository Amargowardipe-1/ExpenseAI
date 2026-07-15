const normalizeExpenseAIResponse = (data = {}) => {
  return {
    merchant: data.merchant ?? null,
    
     title: data.title ?? null,

    amount:
      typeof data.amount === "number"
        ? data.amount
        : Number(data.amount) || null,

    currency: data.currency ?? "INR",

    date: data.date ?? null,

    time: data.time ?? null,

    category: data.category ?? "Other",

    paymentMethod:
      data.paymentMethod ?? "Unknown",

    transactionType:
      data.transactionType ?? "Expense",

    referenceNumber:
      data.referenceNumber ?? null,

    note: data.note ?? null,

    confidence:
      typeof data.confidence === "number"
        ? data.confidence
        : Number(data.confidence) || 0,
  };
};

module.exports = normalizeExpenseAIResponse;