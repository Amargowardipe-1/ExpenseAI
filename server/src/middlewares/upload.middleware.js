const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const {
  MIME_TYPES,
  FILE_SIZE,
} = require("../shared/constants/file.constants");

const createStorage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      const userFolder = path.join(
        __dirname,
        `../temp/${folderName}`,
        req.user._id.toString()
      );

      fs.mkdirSync(userFolder, {
        recursive: true,
      });

      cb(null, userFolder);
    },

    filename: (req, file, cb) => {
      const extension = path.extname(
        file.originalname
      );

      const fileName =
        `${Date.now()}_${crypto.randomUUID()}${extension}`;

      cb(null, fileName);
    },
  });

const createFileFilter = (
  allowedMimeTypes
) => {
  return (req, file, cb) => {

    if (
      !allowedMimeTypes.includes(
        file.mimetype
      )
    ) {
      return cb(
        new Error(
          "Unsupported file type."
        ),
        false
      );
    }

    cb(null, true);
  };
};

const uploadImage = multer({
  storage: createStorage("uploads"),

  fileFilter: createFileFilter(
    MIME_TYPES.IMAGE
  ),

  limits: {
    fileSize: FILE_SIZE.IMAGE,
  },
});

const uploadAudio = multer({
  storage: createStorage("voice"),

  fileFilter: createFileFilter(
    MIME_TYPES.AUDIO
  ),

  limits: {
    fileSize: FILE_SIZE.AUDIO,
  },
});

module.exports = {
  uploadImage,
  uploadAudio,
};