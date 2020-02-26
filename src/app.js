const bodyParser=require('body-parser');
const express=require('express');
require('./db/mongoose');
//FIXME delete
const User=require('./models/users');
const Tasks=require('./models/tasks');

//SECTION API
const user_router=require('../src/routers/users');
const task_router=require('../src/routers/tasks');

app=express();
app.use(bodyParser.json())


//Routes
app.use(user_router);
app.use(task_router);



module.exports=app


