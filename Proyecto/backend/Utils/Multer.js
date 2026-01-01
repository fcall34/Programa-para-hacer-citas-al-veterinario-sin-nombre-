import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/services",
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

export const uploadServiceImages = multer({
  storage,
  limits: { files: 5 }
});
