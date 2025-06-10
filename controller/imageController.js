const imagekit = require("../config/imagekit.config");

// Allowed file extensions
const IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "gif", "webp"];

// Function to handle image upload to ImageKit
const uploadFile = async (file) => {
  try {
    const fileExtension = file.name.split(".").pop().toLowerCase();
    const isImage = IMAGE_EXTENSIONS.includes(fileExtension);

    if (!isImage) {
      throw new Error(`Unsupported file type: ${file.name}`);
    }

    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/\s+/g, "_"); // Replace spaces with underscores
    const fileName = `ayraj/${timestamp}_${sanitizedFileName}`; // Keep the same folder structure    // Upload to ImageKit
    const uploadResponse = await imagekit.upload({
      file: file.data, // express-fileupload provides file data in the data property
      fileName: fileName,
      folder: "/ayraj", // Optional: organize files in ImageKit folders
    });

    return {
      url: uploadResponse.url,
      type: "image",
      name: sanitizedFileName,
      fileId: uploadResponse.fileId // ImageKit specific file ID
    };
  } catch (error) {
    throw new Error("Error uploading file: " + error.message);
  }
};

module.exports = {
  uploadFile
};