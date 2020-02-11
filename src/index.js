const express=require('express');
require('./db/mongoose');
const User=require('./models/users');
const Tasks=require('./models/tasks');
const user_router=require('../src/routers/users');
const task_router=require('../src/routers/tasks');

const express_session=require('express-session');
const bodyParser=require('body-parser');



app=express();

const THREE_HOURS=1000*60*60*3;

//middlewares

app.use(bodyParser.json());

app.use(express_session({
    secret:'TaskManager',
    resave:false,
    saveUninitialized:false,
    cookie:{
        maxAge:THREE_HOURS,
        sameSite:true
    }
}));


//Routes
app.use(user_router);
app.use(task_router);


//start the server

const port = process.env.PORT;

app.listen(port,()=>{
    console.log('server is up on port ',port);
});


