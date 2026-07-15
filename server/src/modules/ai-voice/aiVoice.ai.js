const fs = require("fs");
const { GoogleGenAI } = require("@google/genai");
const ApiError = require("../../shared/errors/ApiError");
const HTTP_STATUS = require("../../shared/constants/httpStatus");
const extractJson = require("../../shared/utils/extractJson");
const normalizeExpenseAIResponse = require("../../shared/utils/normalizeExpenseAIResponse");
const { VOICE_ANALYSIS_PROMPT } = require("./aiVoice.prompt");

const CANDIDATE_MODELS = [
    "gemini-flash-latest",      // Gemini 1.5 Flash (Confirmed Working)
    "gemini-2.0-flash",         // Gemini 2.0 Flash
    "gemini-2.0-flash-lite",    // Gemini 2.0 Flash Lite
    "gemini-2.5-flash",         // Gemini 2.5 Flash
];

const analyzeVoice = async (audioPath, mimeType) => {
    console.log(`[AI Voice] Analyzing audio: ${audioPath} (${mimeType})`);

    if (!fs.existsSync(audioPath)) {
        console.error("[AI Voice] Audio file not found at path:", audioPath);
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "voice scanning error");
    }

    const audioBuffer = fs.readFileSync(audioPath);
    const base64Audio = audioBuffer.toString("base64");
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let hadQuotaError = false;

    for (const model of CANDIDATE_MODELS) {
        console.log(`[AI Voice] Trying model: ${model}`);
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
                                    data: base64Audio,
                                },
                            },
                            {
                                text: VOICE_ANALYSIS_PROMPT,
                            },
                        ],
                    },
                ],
            });

            const text = response.text.trim();
            console.log(`[AI Voice] ✅ SUCCESS with ${model}`);
            console.log(`[AI Voice] Raw response: ${text}`);

            const parsedResponse = extractJson(text);
            return normalizeExpenseAIResponse(parsedResponse);

        } catch (error) {
            const errMsg = error.message || String(error);
            const isQuotaError = errMsg.includes("429") || errMsg.includes("RESOURCE_EXHAUSTED") || errMsg.includes("quota");
            
            if (isQuotaError) {
                hadQuotaError = true;
                console.warn(`[AI Voice] ⚠️  Quota limit reached for ${model}`);
            } else {
                console.error(`[AI Voice] ❌ Error with ${model}:`, errMsg.substring(0, 300));
            }
        }
    }

    // Throw specific errors
    if (hadQuotaError) {
        console.error("[AI Voice] Throwing ApiError: voice analysis limit reach out");
        throw new ApiError(HTTP_STATUS.TOO_MANY_REQUESTS, "voice analysis limit reach out");
    } else {
        console.error("[AI Voice] Throwing ApiError: voice scanning error");
        throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, "voice scanning error");
    }
};

module.exports = {
    analyzeVoice,
};