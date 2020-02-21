const request=require('supertest');
const app=require('../app');
const Routes=require('../Routes/routes')
const User=require('../models/users')
const {userOneId,userOne,setupDatabase} =require('./fixtures/db')



beforeEach(setupDatabase)



test('should signup a new user',async()=>{
    const response=await request(app).
          post(Routes.signUp).
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


test('should login existing user',async()=>{
   const response= await  request(app).
        post(Routes.login).
        send({
            email:userOne.email,
            password:userOne.password
        }).expect(200)

        //assertion about token
        const user=await User.findById(userOneId)
        expect(response.body.token).toBe(user.tokens[1].token)
})


test('should not login non-existent user',async()=>{
    await request(app).
          post(Routes.login).
          send({
            email:'sdkfkl@lsjd.com',
            password:'dfnsdkns'
          }).expect(400)
          
})

test ('should get profile for user',async()=>[
    await request(app).
          get(Routes.Profile)
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
])


test('should not get profile fo unauthenticated user',async()=>{
    await request(app).
          get(Routes.Profile).
          send().
          expect(401)
})


test('should delete account for users',async()=>{
    await request(app)
          .delete(Routes.Profile)
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)

    const user=await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete account for unauthenticated user',async()=>{
    await request(app)
          .delete(Routes.Profile)
          .send()
          .expect(401)
})


test('should upload avatar image',async()=>{
    await request(app)
          .post(Routes.ProfilePicture)
          .set('authorization',`Bearer ${userOne.tokens[0].token}`)
          .attach('upload','./src/tests/fixtures/moayad.jpg')
          .expect(200)
    
    const user=await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})


test('should update valid user',async()=>{
    await request(app)
          .patch(Routes.Profile)
          .set('authorization',`Bearer ${userOne.tokens[0].token}`)
          .send({
              name:'malek'
          })
          .expect(200)

    const user=await User.findById(userOneId)
    expect(user.name).toEqual('malek')
    

})

test('should not update invalid user',async()=>{
    await request(app)
          .patch(Routes.Profile)
          .set('authorization',`Bearer ${userOne.tokens[0].token}`)
          .send({
              wtf:'ksads'
          })
          .expect(500)

    

})