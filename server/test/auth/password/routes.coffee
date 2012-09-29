require '../../utils'
request = require 'supertest'
app = require('../../..').app
should = require 'should'
mongoose = require 'mongoose'


describe 'Password', ->

  authUrl = '/-/auth'

  describe 'POST /-/auth/password', ->

    it 'create user and redirect to "/login"', (done) ->
      request(app)
        .post(authUrl + '/password')
        .send({username: 'test@exampl.com', password: 'pass1'})
        .expect(200)
        .end (err, res) ->
          #console.log res.text
          #console.log err
          done()
