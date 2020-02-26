const request=require('supertest');
const app=require('../../app');
const {Profile}=require('../../Routes/routes')
const User=require('../../models/users')

const {userOneId,
       userOne,
       setupDatabase} =require('../fixtures/db')



beforeEach(setupDatabase)


//delete the profile of the user tests

test('should delete account for users',async()=>{
    await request(app)
          .delete(Profile)
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)

    const user=await User.findById(userOneId)
    expect(user).toBeNull()
})

test('should not delete account for unauthenticated user',async()=>{
    await request(app)
          .delete(Profile)
          .send()
          .expect(401)
})