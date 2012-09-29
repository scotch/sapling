require '../../utils'
request = require 'supertest'
app = require('../../..').app
should = require 'should'
mongoose = require 'mongoose'


describe 'Password: API', ->

  apiUrl = '/-/api/v1'

  describe 'GET /-/api/v1/auth/password', ->

    describe 'No User', ->
      it 'should return a 401 error', (done) ->
        request(app)
          .get(apiUrl + '/auth/password')
          .set('Accept', 'application/json')
          .expect(401)
          .end (err, res) ->
            should.not.exist err
            res.text.should.equal 'Unauthorized'
            done()
