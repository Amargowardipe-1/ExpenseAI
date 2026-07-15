const {
  saveUploadedVoice,
} = require("./aiVoice.repository");

const {
  analyzeVoice,
} = require("./aiVoice.ai");

const {
  AI_CONFIDENCE,
  AI_ANALYSIS_STATUS,
} = require("../../shared/constants/ai.constants");

const uploadVoiceService = async (
  file,
  userId,
  language = "auto"
) => {

  const uploadedVoice =
    await saveUploadedVoice(
      file,
      userId,
      language
    );

  const analysis =
    await analyzeVoice(
      uploadedVoice.filePath,
      uploadedVoice.mimeType
    );

  const requiresManualReview =
    analysis.confidence <
    AI_CONFIDENCE.MIN_EXPENSE_CONFIDENCE;

  return {
    voice: uploadedVoice,

    analysis,

    analysisStatus:
      requiresManualReview
        ? AI_ANALYSIS_STATUS.LOW_CONFIDENCE
        : AI_ANALYSIS_STATUS.SUCCESS,

    requiresManualReview,
  };
};

module.exports = {
  uploadVoiceService,
};