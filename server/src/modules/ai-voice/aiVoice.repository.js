const path = require("path");

const saveUploadedVoice = async (
  file,
  userId,
  language
) => {
  return {
    userId,
    language,
    fileName: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    fileSize: file.size,
    filePath: file.path,
    fileExtension: path.extname(file.originalname),
    uploadedAt: new Date(),
  };
};

module.exports = {
  saveUploadedVoice,
};