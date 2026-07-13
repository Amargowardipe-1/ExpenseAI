const cron = require("node-cron");
const fs = require("fs");
const path = require("path");

const UPLOADS_DIR = path.join(
  __dirname,
  "../temp/uploads"
);

const FIFTEEN_MINUTES = 15 * 60 * 1000;

cron.schedule("*/15 * * * *", () => {
  try {
    if (!fs.existsSync(UPLOADS_DIR)) {
      return;
    }

    const userFolders =
      fs.readdirSync(UPLOADS_DIR);

    for (const folder of userFolders) {

      const folderPath = path.join(
        UPLOADS_DIR,
        folder
      );

      if (
        !fs.statSync(folderPath).isDirectory()
      ) {
        continue;
      }

      const files =
        fs.readdirSync(folderPath);

      for (const file of files) {

        const filePath = path.join(
          folderPath,
          file
        );

        const stats =
          fs.statSync(filePath);

        const age =
          Date.now() -
          stats.birthtimeMs;

        if (age >= FIFTEEN_MINUTES) {

          fs.unlinkSync(filePath);

          console.log(
            `Deleted temp file: ${filePath}`
          );
        }
      }

      // Delete empty user folder
      if (
        fs.readdirSync(folderPath).length === 0
      ) {
        fs.rmdirSync(folderPath);
      }
    }

  } catch (error) {
    console.error(
      "Temp cleanup job error:",
      error
    );
  }
});