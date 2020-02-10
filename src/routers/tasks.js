const Tasks=require('../models/tasks')
const express=require('express')
const auth=require('../midleware/auth')

const router=new express.Router()


//creation endpoint for tasks
router.post('/tasks',auth,async (req,res)=>{

    const new_task=new Tasks({
        ...req.body,
        owner:req.user._id
    })

    try{
        await new_task.save()
        res.status(201).send(new_task);
    }
    catch(e){
        res.status(400).send(e)
    }

})


//fetching all tasks GET /tasks?completed=
// GET /tasks?limit=&skip=
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks',auth,async(req,res)=>{
    const match={}
    const sort={}

    if(req.query.completed){
        match.completed=req.query.completed==="true"
    }

    if(req.query.sortBy){
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parts[1]==='desc'? -1 : 1
    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(400).send(e);
    }
})

//fetching task by id
router.get('/tasks/:id',auth, async(req,res)=>{
    const _id=req.params.id;

    try{
        const task=await Tasks.findOne({_id,owner:req.user._id})
        if(!task){
            res.status(404).send()
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(404).send(e)
    }
   
})


//update task
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates=Object.keys(req.body)
    const Allowed_updates=['completed','description']
    const valid_updates=updates.every((update)=>Allowed_updates.includes(update))
    if(!valid_updates){
        return res.status(500).send("invalid updates")
    }
    try{
       const task=await Tasks.findOne({_id:req.params.id,'owner':req.user._id})
       // const task=await Tasks.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!task){
            return res.status(400).send()
        }
        updates.forEach(update=>task[update]=req.body[update])
        await task.save()
        res.status(200).send(task)
    }
    catch(error){
        res.status(400).send(error)
    }

})


//delete a task by id
router.delete('/tasks/:id',auth,async(req,res)=>{

    try{
        const task=await Tasks.findOneAndDelete({_id:req.params.id,'owner':req.user._id})
        if(!task){
            return res.status(400).send()
        }
        res.status(200).send(task)
    }
    catch(error){
        res.status(400).send(error)
    }
})

module.exports=router
