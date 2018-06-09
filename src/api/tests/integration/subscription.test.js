/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-expressions */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const sinon = require('sinon');
const bcrypt = require('bcryptjs');
const { some, omitBy, isNil } = require('lodash');
const app = require('../../../index');
const Subscription = require('../../models/subscription.model');
const adminAccessToken = 'eyJhbGciOiJSUzI1NiJ9.eyJkYXRhIjoidGVzdDIifQ.GFgZjxJaL5ZVXanSKZmmNIdWjrzqw84OtoFW15ahg_oDHbzJJIJydX6TWirJhNtlMmhmQaOe5Hfa4rr99vhnl1Okx8dWqCEYxbsTDv2hQ0ZrOGRfwycANoNd2-Yjdb0IjXbqPsKlFCNjIm7yZz7NM96ALRrmZr2IAp2qaZKHzxdivR63sypQ_anYIbxXmyM2v2uhGBMwfeV1FN_ogo29jCQDFuGePrHbSdY_A0-21PD0ezwsuXKWOQGn3ohswnZIpy7nb3HO2dx9Ves2wZkRyyPgAlCq8weIlPw36Vpu42dFkukl7-XBkEHGHLqwCt5b_c0UFO72110pO_VhnvqokA';

describe('Subscription API', async () => {

  const sampleSubscription1 = {
    name: "sampleSubscription1",
    items: [{
      productId: "111",
      quantity : 2,
      unitId : "334"
    }]
  }

  beforeEach(async () => {
    await Subscription.remove({});
    await Subscription.insertMany([sampleSubscription1]);
  });

  describe('POST /v1/subscriptions', () => {
    it('should create a new subscription when request is ok', () => {
      return request(app)
        .post('/v1/subscriptions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(sampleSubscription1)
        .expect(httpStatus.CREATED)
    });

    it('should report error when no token provided', () => {
      return request(app)
        .post('/v1/subscriptions')
        .send(sampleSubscription1)
        .expect(httpStatus.UNAUTHORIZED)
    });

    it('should report error when subcsription object is invalid', () => {
      return request(app)
        .post('/v1/subscriptions')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({})
        .expect(httpStatus.BAD_REQUEST)
    });

    // it('should report error when email already exists', () => {
    //   user.email = dbUsers.branStark.email;

    //   return request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(user)
    //     .expect(httpStatus.CONFLICT)
    //     .then((res) => {
    //       const { field } = res.body.errors[0];
    //       const { location } = res.body.errors[0];
    //       const { messages } = res.body.errors[0];
    //       expect(field).to.be.equal('email');
    //       expect(location).to.be.equal('body');
    //       expect(messages).to.include('"email" already exists');
    //     });
    // });

    // it('should report error when email is not provided', () => {
    //   delete user.email;

    //   return request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(user)
    //     .expect(httpStatus.BAD_REQUEST)
    //     .then((res) => {
    //       const { field } = res.body.errors[0];
    //       const { location } = res.body.errors[0];
    //       const { messages } = res.body.errors[0];
    //       expect(field).to.be.equal('email');
    //       expect(location).to.be.equal('body');
    //       expect(messages).to.include('"email" is required');
    //     });
    // });

    // it('should report error when password length is less than 6', () => {
    //   user.password = '12345';

    //   return request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${adminAccessToken}`)
    //     .send(user)
    //     .expect(httpStatus.BAD_REQUEST)
    //     .then((res) => {
    //       const { field } = res.body.errors[0];
    //       const { location } = res.body.errors[0];
    //       const { messages } = res.body.errors[0];
    //       expect(field).to.be.equal('password');
    //       expect(location).to.be.equal('body');
    //       expect(messages).to.include('"password" length must be at least 6 characters long');
    //     });
    // });

    // it('should report error when logged user is not an admin', () => {
    //   return request(app)
    //     .post('/v1/users')
    //     .set('Authorization', `Bearer ${userAccessToken}`)
    //     .send(user)
    //     .expect(httpStatus.FORBIDDEN)
    //     .then((res) => {
    //       expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
    //       expect(res.body.message).to.be.equal('Forbidden');
    //     });
    // });
  });

  // describe('GET /v1/subscriptions', () => {
  //   it('should get all users', () => {
  //     return request(app)
  //       .get('/v1/users')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .expect(httpStatus.OK)
  //       .then(async (res) => {
  //         const bran = format(dbUsers.branStark);
  //         const john = format(dbUsers.jonSnow);

  //         const includesBranStark = some(res.body, bran);
  //         const includesjonSnow = some(res.body, john);

  //         // before comparing it is necessary to convert String to Date
  //         res.body[0].createdAt = new Date(res.body[0].createdAt);
  //         res.body[1].createdAt = new Date(res.body[1].createdAt);

  //         expect(res.body).to.be.an('array');
  //         expect(res.body).to.have.lengthOf(2);
  //         expect(includesBranStark).to.be.true;
  //         expect(includesjonSnow).to.be.true;
  //       });
  //   });

  //   it('should get all users with pagination', () => {
  //     return request(app)
  //       .get('/v1/users')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ page: 2, perPage: 1 })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         delete dbUsers.jonSnow.password;
  //         const john = format(dbUsers.jonSnow);
  //         const includesjonSnow = some(res.body, john);

  //         // before comparing it is necessary to convert String to Date
  //         res.body[0].createdAt = new Date(res.body[0].createdAt);

  //         expect(res.body).to.be.an('array');
  //         expect(res.body).to.have.lengthOf(1);
  //         expect(includesjonSnow).to.be.true;
  //       });
  //   });

  //   it('should filter users', () => {
  //     return request(app)
  //       .get('/v1/users')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ email: dbUsers.jonSnow.email })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         delete dbUsers.jonSnow.password;
  //         const john = format(dbUsers.jonSnow);
  //         const includesjonSnow = some(res.body, john);

  //         // before comparing it is necessary to convert String to Date
  //         res.body[0].createdAt = new Date(res.body[0].createdAt);

  //         expect(res.body).to.be.an('array');
  //         expect(res.body).to.have.lengthOf(1);
  //         expect(includesjonSnow).to.be.true;
  //       });
  //   });

  //   it('should report error when pagination\'s parameters are not a number', () => {
  //     return request(app)
  //       .get('/v1/users')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .query({ page: '?', perPage: 'whaat' })
  //       .expect(httpStatus.BAD_REQUEST)
  //       .then((res) => {
  //         const { field } = res.body.errors[0];
  //         const { location } = res.body.errors[0];
  //         const { messages } = res.body.errors[0];
  //         expect(field).to.be.equal('page');
  //         expect(location).to.be.equal('query');
  //         expect(messages).to.include('"page" must be a number');
  //         return Promise.resolve(res);
  //       })
  //       .then((res) => {
  //         const { field } = res.body.errors[1];
  //         const { location } = res.body.errors[1];
  //         const { messages } = res.body.errors[1];
  //         expect(field).to.be.equal('perPage');
  //         expect(location).to.be.equal('query');
  //         expect(messages).to.include('"perPage" must be a number');
  //       });
  //   });

  //   it('should report error if logged user is not an admin', () => {
  //     return request(app)
  //       .get('/v1/users')
  //       .set('Authorization', `Bearer ${userAccessToken}`)
  //       .expect(httpStatus.FORBIDDEN)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
  //         expect(res.body.message).to.be.equal('Forbidden');
  //       });
  //   });
  // });

  // describe('GET /v1/subscriptions/:id', () => {
  //   it('should get user', async () => {
  //     const id = (await User.findOne({}))._id;
  //     delete dbUsers.branStark.password;

  //     return request(app)
  //       .get(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).to.include(dbUsers.branStark);
  //       });
  //   });

  //   it('should report error "User does not exist" when user does not exists', () => {
  //     return request(app)
  //       .get('/v1/users/56c787ccc67fc16ccc1a5e92')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .expect(httpStatus.NOT_FOUND)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(404);
  //         expect(res.body.message).to.be.equal('User does not exist');
  //       });
  //   });

  //   it('should report error "User does not exist" when id is not a valid ObjectID', () => {
  //     return request(app)
  //       .get('/v1/users/palmeiras1914')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .expect(httpStatus.NOT_FOUND)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(404);
  //         expect(res.body.message).to.equal('User does not exist');
  //       });
  //   });

  //   it('should report error when logged user is not the same as the requested one', async () => {
  //     const id = (await User.findOne({ email: dbUsers.branStark.email }))._id;

  //     return request(app)
  //       .get(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${userAccessToken}`)
  //       .expect(httpStatus.FORBIDDEN)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
  //         expect(res.body.message).to.be.equal('Forbidden');
  //       });
  //   });
  // });

  // describe('PATCH /v1/users/:userId', () => {
  //   it('should update user', async () => {
  //     delete dbUsers.branStark.password;
  //     const id = (await User.findOne(dbUsers.branStark))._id;
  //     const { name } = user;

  //     return request(app)
  //       .patch(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send({ name })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.name).to.be.equal(name);
  //         expect(res.body.email).to.be.equal(dbUsers.branStark.email);
  //       });
  //   });

  //   it('should not update user when no parameters were given', async () => {
  //     delete dbUsers.branStark.password;
  //     const id = (await User.findOne(dbUsers.branStark))._id;

  //     return request(app)
  //       .patch(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .send()
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body).to.include(dbUsers.branStark);
  //       });
  //   });

  //   it('should report error "User does not exist" when user does not exists', () => {
  //     return request(app)
  //       .patch('/v1/users/palmeiras1914')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .expect(httpStatus.NOT_FOUND)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(404);
  //         expect(res.body.message).to.be.equal('User does not exist');
  //       });
  //   });

  //   it('should report error when logged user is not the same as the requested one', async () => {
  //     const id = (await User.findOne({ email: dbUsers.branStark.email }))._id;

  //     return request(app)
  //       .patch(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${userAccessToken}`)
  //       .expect(httpStatus.FORBIDDEN)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
  //         expect(res.body.message).to.be.equal('Forbidden');
  //       });
  //   });

  //   it('should not update the role of the user (not admin)', async () => {
  //     const id = (await User.findOne({ email: dbUsers.jonSnow.email }))._id;
  //     const role = 'admin';

  //     return request(app)
  //       .patch(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${userAccessToken}`)
  //       .send({ role })
  //       .expect(httpStatus.OK)
  //       .then((res) => {
  //         expect(res.body.role).to.not.be.equal(role);
  //       });
  //   });
  // });

  // describe('DELETE /v1/users', () => {
  //   it('should delete user', async () => {
  //     const id = (await User.findOne({}))._id;

  //     return request(app)
  //       .delete(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .expect(httpStatus.NO_CONTENT)
  //       .then(() => request(app).get('/v1/users'))
  //       .then(async () => {
  //         const users = await User.find({});
  //         expect(users).to.have.lengthOf(1);
  //       });
  //   });

  //   it('should report error "User does not exist" when user does not exists', () => {
  //     return request(app)
  //       .delete('/v1/users/palmeiras1914')
  //       .set('Authorization', `Bearer ${adminAccessToken}`)
  //       .expect(httpStatus.NOT_FOUND)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(404);
  //         expect(res.body.message).to.be.equal('User does not exist');
  //       });
  //   });

  //   it('should report error when logged user is not the same as the requested one', async () => {
  //     const id = (await User.findOne({ email: dbUsers.branStark.email }))._id;

  //     return request(app)
  //       .delete(`/v1/users/${id}`)
  //       .set('Authorization', `Bearer ${userAccessToken}`)
  //       .expect(httpStatus.FORBIDDEN)
  //       .then((res) => {
  //         expect(res.body.code).to.be.equal(httpStatus.FORBIDDEN);
  //         expect(res.body.message).to.be.equal('Forbidden');
  //       });
  //   });
  // });

});
