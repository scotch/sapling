require '../utils'
request = require 'supertest'
app = require('../..').app
should = require 'should'
mongoose = require 'mongoose'


describe.only 'User: API', ->

  baseUrl = '/-/api/v1/users'

  describe 'POST /-/api/v1/users', ->

    it 'should create a new user', (done) ->
      obj =
        id: ''
        name:
          giveName: 'Jack'
          familyName: 'Scorn'
          middleName: '"Danger"'
        email: 'jack@example.com'
        username: 'agentscorn'

      request(app)
        .post(baseUrl)
        .send(obj)
        .set('Accept', 'application/json')
        .expect(201)
        .end (err, res) ->
          should.not.exist err
          res.text.should.equal 'Unauthorized'
          done()
