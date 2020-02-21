const express=require('express')
const User=require('../models/users')
const auth=require('../midleware/auth')
const router=new express.Router()
const Routes=require('../Routes/routes')
const upload=require('../midleware/upload')
const sharp=require('sharp')
const {sendWelcomeEmail,sendCancelationEmail}=require('../emails/accounts')


// creation endpoint for users
router.post(Routes.signUp,async (req,res)=>{
    const new_user=new User(req.body);    

    try{
        await new_user.save();
        
        sendWelcomeEmail(new_user.email,new_user.name)
        const token = await new_user.generateAuthToken()
        
        res.status(201).send({new_user,token});
    }
    catch(e){
        res.status(400).send(e);
    }
    
})

//login
router.post(Routes.login,async (req,res)=>{
    try{
    const user=await User.finduser(req.body.email,req.body.password)
    const token= await user.generateAuthToken();
    res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send()
    }

})

//log out
router.post(Routes.logOut,auth,async (req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500)

    }
})

//log out all
router.post(Routes.logOutAll,auth,async (req,res)=>{
    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500)

    }
})


//fetching profile
router.get(Routes.Profile, auth ,async (req,res)=>{

    res.send(req.user)
})


//update user
router.patch(Routes.Profile,auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const Allowed_updates=['name','email','password']
    const valid_updates=updates.every((update)=>Allowed_updates.includes(update))
    if(!valid_updates){
        return res.status(500).send("Invalid updates")
    }
    try{
        updates.forEach(update=>req.user[update]=req.body[update])
        await req.user.save()
   
      
        res.status(200).send(req.user)
    }
    catch(e){
        res.status(400).send(e);
    }

})


//delete a user  
router.delete(Routes.Profile,auth,async(req,res)=>{

    try{
        await req.user.remove()

        sendCancelationEmail(req.user.email,req.user.name)

        res.status(200).send(req.user)

    }
    catch(error){
        res.status(400).send(error)
    }
})


//upload profile picture
router.post(Routes.ProfilePicture ,auth ,upload.single('upload'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.status(200).send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

//delete profile picture
router.delete(Routes.ProfilePicture,auth,async (req,res)=>{
    req.user.avatar=undefined
    
    await req.user.save()
    res.status(200).send()

})

//fetching profile picture by id
router.get('/users/:id/avatar' ,async(req,res)=>{
    try{
        const user=await User.findOne({_id:req.params.id})
        if(!user||!user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.status(200).send(user.avatar)
    }
    catch(e){
        res.status(400).send()
    }
   
})



module.exports=router