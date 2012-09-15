should = require('should')
password = require('../../../auth/password/password')
ds = require('../../../ds')

describe 'Password', ->

  beforeEach (done) ->
    ds.clear (err) ->
      done()

  describe '#create()', ->
    describe 'New User', ->
      it 'should create a new password entity when the info is vaild', (done) ->
        obj =
          email: 'test@example.com'
          password:
            new: 'pass1'
            current: ''

        password.create obj, (err, o) ->
          should.not.exist err
          o.password.isSet.should.equal true
          done()

      it 'should return a "invalid email address" error, when the email address is invaild', (done) ->
        obj =
          email: 'fakeexample.com'
          password:
            new: 'pass1'
            current: ''

        password.create obj, (err, o) ->
          err.code.should.equal 10
          err.message.should.equal 'invalid email address'
          should.not.exist o
          done()

      it 'should return a "invalid password length" error, when the password is to short', (done) ->
        obj =
          email: 'fake@example.com'
          password:
            new: 'no'
            current: ''

        password.create obj, (err, o) ->
          err.code.should.equal 11
          err.message.should.equal 'invalid password length'
          should.not.exist o
          done()

    describe 'Existing User', ->
      it 'should return an "email in use" error when an exsiting user trieds to create a new account', (done) ->
        obj1 =
          email: 'test@example.com'
          password:
            new: 'password1'
            current: ''
        obj2 =
          email: 'test@example.com'
          password:
            new: 'password1'
            current: ''
        # this ones fine.
        password.create obj1, (err, o) ->
          should.not.exist err

          # this is the duplicate.
          password.create obj2, (err, o) ->
            err.code.should.equal 13
            err.message.should.equal 'email in use'
            should.not.exist o
            done()