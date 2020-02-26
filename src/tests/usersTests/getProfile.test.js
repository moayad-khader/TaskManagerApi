const request=require('supertest');
const app=require('../../app');
const {Profile}=require('../../Routes/routes')

const {userOne,setupDatabase} =require('../fixtures/db')



beforeEach(setupDatabase)


//getting profile of the user

test ('should get profile for user',async()=>[
    await request(app).
          get(Profile)
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
])


test('should not get profile fo unauthenticated user',async()=>{
    await request(app).
          get(Profile).
          send().
          expect(401)
})
