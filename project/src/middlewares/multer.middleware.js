import multer from 'multer'

const storage = multer.diskStorage({  // takes in two function : one to define the file path another to define the file name
   
    destination: function(req , file , cb){
        cb(null , './public/temp')
    },

    filename: function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null , file.fieldname + '-' + uniqueSuffix)
    }

})

export const upload = multer({
    storage: storage,
})

