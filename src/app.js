const express=require('express');
require('./db/mongoose');
const User=require('./models/users');
const Tasks=require('./models/tasks');
const user_router=require('../src/routers/users');
const task_router=require('../src/routers/tasks');


const bodyParser=require('body-parser');



app=express();
app.use(bodyParser.json())


//Routes
app.use(user_router);
app.use(task_router);



module.exports=app


