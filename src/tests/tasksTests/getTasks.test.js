const request=require('supertest')
const app=require('../../app')
const Task=require('../../models/tasks')
const {taskMethods}=require('../../Routes/routes')
const {userOne,
       setupDatabase} =require('../fixtures/db')

beforeEach(setupDatabase)


test('should send tasks back',async()=>{
    const response=await request(app)
                         .get(taskMethods)
                         .set('authorization',`Bearer ${userOne.tokens[0].token}`)
                         .send()
                         .expect(200)
    
    expect(response.body.length).toBe(2)
    
})


test('should not send tasks back',async()=>{
    const response=await request(app)
                         .get(taskMethods)
                         .send()
                         .expect(401)
    
    
})

