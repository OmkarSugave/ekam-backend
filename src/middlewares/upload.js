const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "ekam/fees",
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    resource_type: "image",
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 5 MB
});

module.exports = upload;