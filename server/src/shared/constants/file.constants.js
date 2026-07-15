const MIME_TYPES = {
  IMAGE: [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/heic",
  ],

  AUDIO: [
    "audio/mpeg",
    "audio/mp3",
    "audio/mp4",
    "audio/wav",
    "audio/x-wav",
    "audio/webm",
    "audio/aac",
    "audio/ogg",
    "audio/3gpp",
    "audio/amr",
    "audio/x-m4a",
  ],
};

const FILE_SIZE = {
  IMAGE: 10 * 1024 * 1024,
  AUDIO: 25 * 1024 * 1024,
};

module.exports = {
  MIME_TYPES,
  FILE_SIZE,
};