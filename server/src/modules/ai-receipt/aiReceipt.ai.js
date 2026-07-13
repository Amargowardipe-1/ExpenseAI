const fs = require("fs");

const gemini = require("../../config/gemini");

const ApiError = require("../../shared/errors/ApiError");
const HTTP_STATUS = require("../../shared/constants/httpStatus");
const normalizeReceiptResponse = require(
    "../../shared/utils/normalizeReceiptResponse"
);

const {
    RECEIPT_ANALYSIS_PROMPT,
} = require("./aiReceipt.prompt");
const extractJson = require("../../shared/utils/extractJson");

const analyzeReceiptImage = async (
    imagePath,
    mimeType
) => {
    try {

        const imageBuffer =
            fs.readFileSync(imagePath);

        const response =
            await gemini.models.generateContent({
                model: "gemini-2.5-flash",

                contents: [
                    {
                        inlineData: {
                            mimeType,
                            data: imageBuffer.toString("base64"),
                        },
                    },

                    {
                        text: RECEIPT_ANALYSIS_PROMPT,
                    },
                ],
            });

        const text =
            response.text.trim();

        const parsedResponse =
            extractJson(text);

        return normalizeReceiptResponse(
            parsedResponse
        );

    } catch (error) {

        throw new ApiError(
            HTTP_STATUS.BAD_REQUEST,
            "Unable to analyze receipt image."
        );

    }
};

module.exports = {
    analyzeReceiptImage,
};