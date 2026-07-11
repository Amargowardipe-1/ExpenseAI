const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const userFolder = path.join(
      __dirname,
      "../temp/uploads",
      req.user._id.toString()
    );

    fs.mkdirSync(userFolder, {
      recursive: true,
    });

    cb(null, userFolder);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);

    const uniqueName =
      `${Date.now()}_${crypto.randomUUID()}${ext}`;

    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {

  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp",
  ];

  if (
    !allowedMimeTypes.includes(file.mimetype)
  ) {
    return cb(
      new Error("Only image files are allowed."),
      false
    );
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },
});

module.exports = upload;