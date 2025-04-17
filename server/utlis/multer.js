
import multer from 'multer';
import path from 'path';

const storage=multer.diskStorage({

    destination:(req,file,cb)=>{
        console.log("Saving file to uploads directory...");
        cb(null,"uploads/");
    },
    filename: (req, file, cb) => {
        console.log("Generating unique filename...");
        cb(null, Date.now() + path.extname(file.originalname));
    },
})
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only images are allowed!"), false);
    }
};

const upload = multer({ storage, fileFilter });
const attach=multer({storage})
const addPhoto=multer({storage})
export const uploadMiddleware = upload.single("image");
export const attackMiddleware = attach.single("file");
export const addPhotoMiddleware=addPhoto.array("files")
// export default upload;
