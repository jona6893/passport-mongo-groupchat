const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const optimizeImage = async (inputFile) => {
  const outputFile = path.join(
    path.dirname(inputFile),
    `optimized-${path.basename(inputFile)}`
  );

  try {
    await sharp(inputFile)
      .rotate() // Add this line to auto-rotate based on EXIF metadata
      .resize(800, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .toFile(outputFile);

    fs.unlinkSync(inputFile);
    return outputFile;
  } catch (error) {
    console.error("Error optimizing image:", error);
    return inputFile;
  }
};

module.exports = optimizeImage;
