var multer = require('multer')
var serverPath = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,'./public/images')
    },
    filename: (req,file,cb) =>{
        cb(null, file.originalname)
    }
})
var upload = multer({storage:serverPath});

module.exports = upload;