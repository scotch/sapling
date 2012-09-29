require '../../utils'
should = require 'should'
Password = require('../../../auth/password/model').Password


describe 'Password', ->

  describe '#new()', ->

    userId = '000000000000000000000001'

    it 'should create a new password entity when the info is vaild', (done) ->
      Password.new userId, 'pass1', (err, p) ->
        should.not.exist err
        should.exist p._id
        should.exist p.createdAt
        should.exist p.auth.passwordHash
        String(p.userId).should.equal userId
        p.provider.name.should.equal 'local'
        Password.findOne {userId: userId}, (err, u) ->
          String(p.userId).should.equal userId
          done()

    it 'should return an error when the password is to short', (done) ->
      Password.new userId, 'pas', (err, p) ->
        should.exist err
        err.code.should.equal 11
        err.message.should.equal 'invalid password length'
        should.not.exist p
        done()

    it 'should return an error if the user has already created a password', (done) ->
        Password.new userId, 'pass1', (err, p) ->
          should.not.exist err
          Password.new userId, 'pass1', (err, p) ->
            err.code.should.equal 11000
            should.exist err
            done()

  describe '#authenticate()', ->

    userId = '000000000000000000000001'
    pass = 'pass1'

    beforeEach (done) ->
      Password.new userId, pass, (err, p) ->
        done()

    it 'should return true when password is vaild', (done) ->
      Password.authenticate userId, pass, (err, valid) ->
        should.not.exist err
        valid.should.equal true
        done()

    it 'should return false when password is invaild', (done) ->
      Password.authenticate userId, 'fake', (err, valid) ->
        should.not.exist err
        valid.should.equal false
        done()
