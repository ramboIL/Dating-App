const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profile/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-profile-${file.originalname}`);
  },
});

const upload = multer({ storage: storage, limits: { files: 5 } });
const uploadProfilePicture = multer({ storage: profilePictureStorage }).single(
  "profilePicture"
);

const uploadImages = multer({ storage: storage }).array("images", 5);

module.exports = {
  uploadImages,
  uploadProfilePicture,
};
