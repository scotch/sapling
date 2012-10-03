require '../utils'
request = require 'supertest'
app = require('../..').app
should = require 'should'


describe 'User: api', ->

  baseUrl = '/-/api/v1/users'
  user1 =
    id: ''
    name:
      givenName: 'Micheal'
      middleName: '"Danger"'
      familyName: 'Scorn'
    emails:
      value: 'scorn@example.com'
    username: 'agentscorn'

  describe 'POST /-/api/v1/users', ->

    it 'should create a new user if request is valid', (done) ->
      request(app)
        .post(baseUrl)
        .send(user1)
        .set('Accept', 'application/json')
        .expect(201)
        .end (err, res) ->
          u = JSON.parse(res.text)
          #console.log u
          should.not.exist err
          should.exist u.id
          u.name.givenName.should.equal 'Micheal'
          u.name.middleName.should.equal '"Danger"'
          u.name.familyName.should.equal 'Scorn'
          u.username.should.equal 'agentscorn'
          done()

  describe 'GET /-/api/v1/users', ->
    
    userId = undefined

    beforeEach (done) ->
      request(app)
        .post(baseUrl)
        .send(user1)
        .expect(201)
        .end (err, res) ->
          u = JSON.parse(res.text)
          userId = u.id
          should.not.exist err
          done()

    it 'should return a new user if it exists', (done) ->
      request(app)
        .get(baseUrl + '/' + userId)
        .expect(200)
        .end (err, res) ->
          u = JSON.parse(res.text)
          should.not.exist err
          u.name.givenName.should.equal 'Micheal'
          u.name.middleName.should.equal '"Danger"'
          u.name.familyName.should.equal 'Scorn'
          u.username.should.equal 'agentscorn'
          done()
