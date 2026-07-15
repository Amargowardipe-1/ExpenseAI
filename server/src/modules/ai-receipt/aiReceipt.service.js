const {
  saveUploadedReceipt,
  findPotentialDuplicate,
} = require("./aiReceipt.repository");

const {
  analyzeReceiptImage,
} = require("./aiReceipt.ai");

const {
  AI_CONFIDENCE,
  AI_ANALYSIS_STATUS,
} = require("../../shared/constants/ai.constants");

const uploadReceiptService = async (
  file,
  userId,
  source = "gallery"
) => {
  const uploadedReceipt =
    await saveUploadedReceipt(
      file,
      userId,
      source
    );

  const analysis =
    await analyzeReceiptImage(
      uploadedReceipt.filePath,
      uploadedReceipt.mimeType
    );

  const duplicate = await findPotentialDuplicate(
    userId,
    analysis.amount,
    analysis.date
  );

  const isPossibleDuplicate = !!duplicate;

  const requiresManualReview =
    analysis.confidence <
    AI_CONFIDENCE.MIN_EXPENSE_CONFIDENCE;

  let analysisStatus = AI_ANALYSIS_STATUS.SUCCESS;
  if (requiresManualReview) {
    analysisStatus = AI_ANALYSIS_STATUS.LOW_CONFIDENCE;
  } else if (isPossibleDuplicate) {
    analysisStatus = AI_ANALYSIS_STATUS.POSSIBLE_DUPLICATE;
  }

  return {
    receipt: uploadedReceipt,

    analysis,

    analysisStatus,

    requiresManualReview,

    isPossibleDuplicate,

    duplicateExpenseId: duplicate ? duplicate._id : null,
  };
};

module.exports = {
  uploadReceiptService,
};