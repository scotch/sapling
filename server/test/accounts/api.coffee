require '../utils'
request = require 'supertest'
app = require('../..').app
should = require 'should'


describe 'Accounts: API', ->

  baseUrl = '/-/api/v1/account/providers'

  describe 'GET /-/api/v1/account/providers', ->

    it 'should return a 401 error if the user is not authenticated', (done) ->
      request(app)
        .get(baseUrl)
        .set('Accept', 'application/json')
        .expect(401)
        .end (err, res) ->
          should.not.exist err
          res.text.should.equal 'Unauthorized'
          done()
