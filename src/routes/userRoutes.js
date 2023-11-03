import { Router } from "express";
import { Register, getUsers,Login,RegisterWithImage} from "../controller/userController.js"
import {upload} from '../config/multer.js'


const router = Router();

router.post('/create',Register)
router.get('/',getUsers)
router.post('/login', Login);
router.post('/createwithimage',upload.fields([{name:'image',maxCount:1}]),RegisterWithImage)
// ,async (req,res)=>{
//     const body = req.body
//     const image = req.files.image

//     if(image && image.length > 0){
//         const {downloadURL} = await uploadFile(image[0])

//         const newUser = await new UserModel({
//             email: body.email,
//             name: body.name,
//             lastname:body.lastname,
//             phone:body.phone,
//             image:downloadURL,
//             password:body.password

//         }).save()

//         return res.status(200).json({newUser})
        

//     }


//     return res.status(400).json({message:'debes enviar una imagen'})
// })

export default router