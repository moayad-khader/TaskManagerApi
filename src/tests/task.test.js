const request=require('supertest');
const app=require('../app');
const Task=require('../models/tasks')
const Routes=require('../Routes/routes')

const {userOne,
    setupDatabase,
    userTwo,
    userTwoId,
    taskOne} =require('./fixtures/db')




beforeEach(setupDatabase)


test('should create a new task',async ()=>{
 const response =await request(app)
                .post(Routes.taskMethods)
                .set('authorization',`Bearer ${userOne.tokens[0].token}`)
                .send({
                    description:'flying to the moon'
                 })
                .expect(201)

    
    const task=await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    


})

test('should sends tasks back',async()=>{
    const response=await request(app)
                         .get(Routes.taskMethods)
                         .set('authorization',`Bearer ${userOne.tokens[0].token}`)
                         .send()
                         .expect(200)
    
    expect(response.body.length).toBe(2)
    
})


test('delete task should fail',async()=>{
    const response=await request(app)
          .delete(`/tasks/${taskOne._id}`)
          .set('authorization',`Bearer ${userTwo.tokens[0].token}`)
          .send()
          .expect(400)

     const task=await Task.findById(taskOne._id)
    
    expect(task).not.toBeNull()
})