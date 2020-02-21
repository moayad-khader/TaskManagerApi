const mongoose=require('mongoose')
const User=require('../../models/users')
const jwt=require('jsonwebtoken')
const Task=require('../../models/tasks')


const userOneId=new mongoose.Types.ObjectId()

const userOne={
    _id:userOneId,
    name:'Ibrahim',
    email:'fsljdls@ljlds.com',
    password:'jlsdjfdsa;',
    tokens:[{
        token: jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}



const taskOne={
    _id:new mongoose.Types.ObjectId,
    description:"eating lunch",
    completed:false,
    owner:userOneId

}
const taskTwo={
    _id:new mongoose.Types.ObjectId,
    description:"eating dinner",
    completed:true,
    owner:userOneId

}
const userTwoId=new mongoose.Types.ObjectId
const userTwo={
    _id:userTwoId,
    name:"karam",
    email:'dlsfjlf@flsd.com',
    password:'djflsakdfs',
    tokens:[{
        token:jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

const taskThree={
    _id:new mongoose.Types.ObjectId,
    description:'sleeping',
    owner:userTwoId
}


const setupDatabase=async ()=>{
    await User.deleteMany()
    await Task.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}




module.exports={
    userOne,
    setupDatabase,
    userOneId,
    userTwo,
    userTwoId,
    taskOne
}