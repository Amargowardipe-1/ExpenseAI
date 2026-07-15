const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const {
  STORAGE_FOLDERS,
} = require("../shared/constants/storage.constants");

const TEMP_DIR = path.join(
  __dirname,
  "../temp"
);

const FIFTEEN_MINUTES = 15 * 60 * 1000;

cron.schedule("*/15 * * * *", () => {
  try {

    const folders = [
      STORAGE_FOLDERS.IMAGE,
      STORAGE_FOLDERS.VOICE,
    ];

    for (const folder of folders) {

      const storagePath = path.join(
        TEMP_DIR,
        folder
      );

      if (!fs.existsSync(storagePath)) {
        continue;
      }

      const userFolders =
        fs.readdirSync(storagePath);

      for (const userFolder of userFolders) {

        const userFolderPath = path.join(
          storagePath,
          userFolder
        );

        if (
          !fs
            .statSync(userFolderPath)
            .isDirectory()
        ) {
          continue;
        }

        const files =
          fs.readdirSync(userFolderPath);

        for (const file of files) {

          const filePath = path.join(
            userFolderPath,
            file
          );

          const stats =
            fs.statSync(filePath);

          const age =
            Date.now() -
            stats.mtimeMs;

          if (
            age >= FIFTEEN_MINUTES
          ) {

            fs.unlinkSync(filePath);

            console.log(
              `Deleted temp file: ${filePath}`
            );
          }
        }

        // Delete empty user folder
        if (
          fs.readdirSync(userFolderPath)
            .length === 0
        ) {
          fs.rmdirSync(
            userFolderPath
          );
        }
      }
    }

  } catch (error) {
    console.error(
      "Temp cleanup job error:",
      error
    );
  }
});