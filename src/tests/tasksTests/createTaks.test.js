const request=require('supertest')
const app=require('../../app')
const Task=require('../../models/tasks')
const {taskMethods}=require('../../Routes/routes')
const {userOne,
       setupDatabase} =require('../fixtures/db')

beforeEach(setupDatabase)




test('should create a new task',async ()=>{
    const response =await request(app)
                   .post(taskMethods)
                   .set('authorization',`Bearer ${userOne.tokens[0].token}`)
                   .send({
                       description:'flying to the moon'
                    })
                   .expect(201)
   
       
       const task=await Task.findById(response.body._id)
       expect(task).not.toBeNull()
       
   
   
   })


test('should not create a new task',async()=>{
    await request(app)
          .post(taskMethods)
          .send({
              description:'finshing node js project',
              completed:true
          }).expect(401)
})


   


