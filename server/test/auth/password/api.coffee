require '../../utils'
request = require 'supertest'
app = require('../../..').app
should = require 'should'


describe 'Password: API', ->

  baseUrl = '/-/api/v1/auth/password'

  describe 'GET /-/api/v1/auth/password', ->

    it 'should return a 401 error if the user is not authenticated', (done) ->
      request(app)
        .get(baseUrl)
        .set('Accept', 'application/json')
        .expect(401)
        .end (err, res) ->
          should.not.exist err
          res.text.should.equal 'Unauthorized'
          done()

  describe 'POST /-/api/v1/auth/password', ->

    it 'should return a 400 error if an email address is not supplied', (done) ->
      obj1 =
        email: ''
        password: 'validpassword'
        user:
          name:
            givenName: 'Micheal'
            familyName: 'Scorn'
      request(app)
        .post(baseUrl)
        .send(obj1)
        .set('Accept', 'application/json')
        .expect(400)
        .end (err, res) ->
          should.not.exist err
          r = JSON.parse res.text
          r.code.should.equal 10
          r.message.should.equal 'invalid email address'
          done()

    it 'should return a 400 error if password is empty', (done) ->
      obj1 =
        password: ''
        user:
          name:
            givenName: 'Micheal'
            familyName: 'Scorn'
          email: 'scorn@example.com'
          username: 'agentscorn'
      request(app)
        .post(baseUrl)
        .send(obj1)
        .set('Accept', 'application/json')
        .expect(400)
        .end (err, res) ->
          should.not.exist err
          r = JSON.parse res.text
          r.code.should.equal 12
          r.message.should.equal 'invalid password length'
          done()

    it 'should create a new user and return a 201 if valid', (done) ->
      obj1 =
        password: 'pass1'
        user:
          id: ''
          name:
            givenName: 'Micheal'
            familyName: 'Scorn'
          email: 'SCORN@example.com'
      request(app)
        .post(baseUrl)
        .send(obj1)
        .set('Accept', 'application/json')
        .expect(201)
        .end (err, res) ->
          should.not.exist err
          u = JSON.parse res.text
          should.exist u.id
          u.name.givenName.should.equal 'Micheal'
          u.name.familyName.should.equal 'Scorn'
          u.emails[0].value.should.equal 'scorn@example.com'
          done()
