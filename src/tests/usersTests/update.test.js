const request=require('supertest');
const app=require('../../app');
const {Profile}=require('../../Routes/routes')
const User=require('../../models/users')

const {userOneId,
       userOne,
       setupDatabase} =require('../fixtures/db')



beforeEach(setupDatabase)




//update user profile tests

test('should update valid user',async()=>{
    await request(app)
          .patch(Profile)
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
          .patch(Profile)
          .set('authorization',`Bearer ${userOne.tokens[0].token}`)
          .send({
              wtf:'ksads'
          })
          .expect(500)

    

})