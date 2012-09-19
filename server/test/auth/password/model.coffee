require '../../utils'
#require("mocha-mongoose")
should = require 'should'
password = require '../../../auth/password/model'
#mongoose = require('mongoose')

describe 'Password', ->

  describe '#create()', ->
    describe 'New Password for user', ->
      it 'should create a new password entity when the info is vaild', (done) ->
        password.create '000000000000000000000001', 'pass1', (err, p) ->
          should.not.exist err
          should.exist p._id
          should.exist p.created
          should.exist p.passwordHash
          p.provider.should.equal 'local'
          done()
#      it 'should return an error if user already has already created a password', (done) ->
#        userId = '000000000000000000000001'
#        password.create userId, 'pass1', (err, p) ->
##          should.not.exist err
#          password.create userId, 'pass1', (err, p) ->
##            should.exist err
##            err.code.should.equal 11
##            err.message.should.equal 'user'
#            done()

      it 'should return a "invalid password length" error, when the password is to short', (done) ->
        password.create '000000000000000000000001', 'pas', (err, p) ->
          should.exist err
          err.code.should.equal 11
          err.message.should.equal 'invalid password length'
          should.not.exist p
          done()

#    describe 'Existing User', ->
#      it 'should return an "email in use" error when an exsiting user trieds to create a new account', (done) ->
#        obj1 =
#          email: 'test@example.com'
#          password:
#            new: 'password1'
#            current: ''
#        obj2 =
#          email: 'test@example.com'
#          password:
#            new: 'password1'
#            current: ''
#        # this ones fine.
#        password.create obj1, (err, o) ->
#          should.not.exist err
#
#          # this is the duplicate.
#          password.create obj2, (err, o) ->
#            err.code.should.equal 13
#            err.message.should.equal 'email in use'
#            should.not.exist o
#            done()