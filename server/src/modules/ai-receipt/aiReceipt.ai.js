const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const normalizeReceiptResponse = require("../../shared/utils/normalizeReceiptResponse");
const { RECEIPT_ANALYSIS_PROMPT } = require("./aiReceipt.prompt");
const extractJson = require("../../shared/utils/extractJson");
const ApiError = require("../../shared/errors/ApiError");
const HTTP_STATUS = require("../../shared/constants/httpStatus");

// Models to try in priority order
const CANDIDATE_MODELS = [
    "gemini-flash-latest",      // Gemini 1.5 Flash
    "gemini-2.0-flash",         // Gemini 2.0 Flash
    "gemini-2.0-flash-lite",    // Gemini 2.0 Flash Lite
    "gemini-2.5-flash",         // Gemini 2.5 Flash
];

const analyzeReceiptImage = async (imagePath, mimeType) => {
    console.log(`[AI Receipt] Analyzing image: ${imagePath} (${mimeType})`);

    if (!fs.existsSync(imagePath)) {
        console.error("[AI Receipt] Image file not found at path:", imagePath);
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "scanning error");
    }

    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let hadQuotaError = false;

    for (const model of CANDIDATE_MODELS) {
        console.log(`[AI Receipt] Trying model: ${model}`);
        try {
            const response = await ai.models.generateContent({
                model,
                contents: [
                    {
                        role: "user",
                        parts: [
                            {
                                inlineData: {
                                    mimeType: mimeType,
                                    data: base64Image,
                                },
                            },
                            {
                                text: RECEIPT_ANALYSIS_PROMPT,
                            },
                        ],
                    },
                ],
            });

            const text = response.text.trim();
            console.log(`[AI Receipt] ✅ SUCCESS with ${model}`);
            console.log(`[AI Receipt] Raw response: ${text}`);

            const parsedResponse = extractJson(text);
            return normalizeReceiptResponse(parsedResponse);

        } catch (error) {
            const errMsg = error.message || String(error);
            const isQuotaError = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota");
            
            if (isQuotaError) {
                hadQuotaError = true;
                console.warn(`[AI Receipt] ⚠️  Quota limit reached for ${model}`);
            } else {
                console.error(`[AI Receipt] ❌ Error with ${model}:`, errMsg.substring(0, 300));
            }
        }
    }

    // All models failed — throw the specific user-requested ApiErrors
    if (hadQuotaError) {
        console.error("[AI Receipt] Throwing ApiError: image analysis limit reach out");
        throw new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, "image analysis limit reach out");
    } else {
        console.error("[AI Receipt] Throwing ApiError: scanning error");
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "scanning error");
    }
};

module.exports = {
    analyzeReceiptImage,
};