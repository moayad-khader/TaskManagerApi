const request=require('supertest')
const app=require('../../app')
const {login}=require('../../Routes/routes')
const User=require('../../models/users')
const {setupDatabase,userOne,userOneId}=require('../fixtures/db')



beforeEach(setupDatabase)



//valid login
test('should login existing user',async()=>{
    const response= await  request(app).
         post(login).
         send({
             email:userOne.email,
             password:userOne.password
         }).expect(200)
 
         //assertion about token
         const user=await User.findById(userOneId)
         expect(response.body.token).toBe(user.tokens[1].token)
 })



 //invalid login 

 test('should not login non-existent user',async()=>{
    await request(app).
          post(login).
          send({
            email:'sdkfkl@lsjd.com',
            password:'dfnsdkns'
          }).expect(400)
          
})