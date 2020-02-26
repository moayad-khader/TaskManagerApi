const request=require('supertest')
const app=require('../../app')
const Task=require('../../models/tasks')
const {taskMethods}=require('../../Routes/routes')
const {userOne,
       setupDatabase,
       userTwo,
       taskOne} =require('../fixtures/db')

beforeEach(setupDatabase)


test('should delete task',async()=>{
    await request(app)
          .delete(`/tasks/${taskOne._id}`)
          .set('authorization',`Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
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