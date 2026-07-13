const ApiError = require("../errors/ApiError");
const HTTP_STATUS = require("../constants/httpStatus");

const extractJson = (responseText) => {
  try {
    if (!responseText || typeof responseText !== "string") {
      throw new Error();
    }

    let cleanedText = responseText.trim();

    // Remove markdown code blocks
    cleanedText = cleanedText.replace(
      /^```(?:json)?\s*/i,
      ""
    );

    cleanedText = cleanedText.replace(
      /\s*```$/i,
      ""
    );

    // Extract JSON object only
    const startIndex = cleanedText.indexOf("{");
    const endIndex = cleanedText.lastIndexOf("}");

    if (startIndex === -1 || endIndex === -1) {
      throw new Error();
    }

    cleanedText = cleanedText.substring(
      startIndex,
      endIndex + 1
    );

    return JSON.parse(cleanedText);

  } catch (error) {
    throw new ApiError(
      HTTP_STATUS.BAD_REQUEST,
      "Invalid AI response."
    );
  }
};

module.exports = extractJson;