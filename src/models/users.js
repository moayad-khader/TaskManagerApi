const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');

const jwt=require('jsonwebtoken');
const Tasks=require('../models/tasks');

/**
 * @password => encrypted
 */
const UserSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        match:[/^[a-zA-Z0-9]+$/, 'is invalid']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
        

    }
    ,
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw Error("inavlid password!")
            }
        }
      
    },
    avatar:Buffer,
    tokens:[{
        
            token:{
                type:String,
                required:true
            }
        
     } ]
 },{
     timestamps:true
 })

 UserSchema.virtual('tasks',{
     ref:'Tasks',
     localField:'_id',
     foreignField:"owner"
 })

UserSchema.methods.toJSON= function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

UserSchema.methods.generateAuthToken=async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens=user.tokens.concat({token:token})
    await user.save()
    return token
}


UserSchema.statics.finduser=async (email,password)=>{
    const user=await User.findOne({email:email})

    if(!user){
        throw new Error('unable to find user')
    }

    const ismatch=await bcrypt.compare(password,user.password)
    if(!ismatch){
        throw new Error("Wrong password")
     }

    return user

}

//hash the password
UserSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    
    next()
 })

 //delete the tasks when the user removed
 UserSchema.pre('remove',async function(next){
     const user=this
     await Tasks.deleteMany({owner:user._id})
     next()

 })

//build user model 

const User=mongoose.model("User",UserSchema)

//export the model 

module.exports=User;