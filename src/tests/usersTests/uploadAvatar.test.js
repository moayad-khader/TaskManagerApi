const request=require('supertest');
const app=require('../../app');
const {ProfilePicture}=require('../../Routes/routes')
const User=require('../../models/users')

const {userOneId,
       userOne,
       setupDatabase} =require('../fixtures/db')



beforeEach(setupDatabase)




//upload avatar tests

test('should upload avatar image',async()=>{
    await request(app)
          .post(ProfilePicture)
          .set('authorization',`Bearer ${userOne.tokens[0].token}`)
          .attach('upload','./src/tests/fixtures/moayad.jpg')
          .expect(200)
    
    const user=await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should upload an image for avatar',async()=>{
    await request(app)
          .post(ProfilePicture)
           .set('authorization',`Bearer ${userOne.tokens[0].token}`)
           .attach('upload','./src/tests/fixtures/coins_collection.cpp')
           .expect(400)


})