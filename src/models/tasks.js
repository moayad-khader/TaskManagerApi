const mongoose=require("mongoose");


const task_schema=new mongoose.Schema({
    description:{
        type:String,
        trim:true,
        required:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true
})


//Tasks model
const Tasks=mongoose.model("Tasks",task_schema)

//exports task model
module.exports=Tasks;
