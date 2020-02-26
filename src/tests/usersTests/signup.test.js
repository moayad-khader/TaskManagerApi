const request=require('supertest')
const app=require('../../app')
const {signUp}=require('../../Routes/routes')
const User=require('../../models/users')
const {setupDatabase,userOne,userOneId}=require('../fixtures/db')



beforeEach(setupDatabase)


//valid signup
test('should signup a new user',async()=>{
    const response=await request(app).
          post(signUp).
          send({
              name:'Moayad',
              email:'sdfks@klsdf.com',
              password:'Mypassdas5'
          }).expect(201)

          //assert that the database changed correctly
         const user= await User.findOne({_id:response.body.new_user._id})
         expect(user).not.toBeNull()

         //assertion about the response
         expect(response.body).toMatchObject({
             new_user:{
                 name:'Moayad',
                 email:'sdfks@klsdf.com',
             },
             token:user.tokens[0].token
         })

         //assertion about user password
         expect(user.password).not.toBe('Mypassdas5')
})
