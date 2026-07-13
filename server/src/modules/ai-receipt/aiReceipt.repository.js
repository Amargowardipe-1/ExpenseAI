const path = require("path");
const Expense = require("../expense/expense.model");

const saveUploadedReceipt = async (
  file,
  userId,
  source
) => {
  return {
    userId,
    source,
    fileName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    filePath: file.path,
    fileExtension: path.extname(file.originalname),
    uploadedAt: new Date(),
  };
};

const findPotentialDuplicate = async (userId, amount, dateStr) => {
  if (!amount || !dateStr) return null;

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return null;

  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);

  const duplicate = await Expense.findOne({
    user: userId,
    amount: amount,
    isDeleted: false,
    date: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
  });

  return duplicate;
};

module.exports = {
  saveUploadedReceipt,
  findPotentialDuplicate,
};