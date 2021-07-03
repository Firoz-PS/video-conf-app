// const multer = require("multer");

// const storage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 	  cb(null, "public/images");
// 	},
// 	filename: (req, file, cb) => {
// 	  cb(null, file.fieldname + '-' + Date.now());
// 	},
// });
  
// const uploadAvatar = (req, res, next) =>{
//     const upload = multer({ storage: storage });
//     upload.single("file")
//     .then(

//     ) 
//     next()
// }
//     app.post("/api/upload", , (req, res) => {
//     try {
//         return res.status(200).json("File uploded successfully");
//     } catch (error) {
//         console.error(error);
//     }
// });

// module.exports = {
//     uploadAvatar
// }