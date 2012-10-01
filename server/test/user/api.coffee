require '../utils'
request = require 'supertest'
app = require('../..').app
should = require 'should'


describe 'User: api', ->

  baseUrl = '/-/api/v1/users'

  describe 'POST /-/api/v1/users', ->

    it 'should create a new user if request is valid', (done) ->
      obj =
        id: ''
        name:
          givenName: 'Micheal'
          middleName: '"Danger"'
          familyName: 'Scorn'
        emails:
          value: 'scorn@example.com'
        username: 'agentscorn'

      request(app)
        .post(baseUrl)
        .send(obj)
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
