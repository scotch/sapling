require '../utils'
should = require('should')
User = require('../../user/model').User

user1 =
  name:
    givenName: 'Kyle'
    familyName: 'Finley'
  emails: [
    address: 'test@example.com'
    status: 3
  ]
  username: 'kfinley'

describe 'User', ->

  describe '#create()', ->

    it 'should create a new user', (done) ->
      User.create user1, (err, u) ->
        should.not.exist err
        should.exist u._id
        u.name.givenName.should.equal 'Kyle'
        u.name.familyName.should.equal 'Finley'
        u.username.should.equal 'kfinley'
        #u.email.should.equal 'test@example.com'
        done()

  describe '#findByEmailOrUsername()', ->

    beforeEach (done) ->
      User.create user1, (err, u) ->
        should.not.exist err
        done()

    it 'should return a user by email address', (done) ->
      User.findByEmailOrUsername 'test@example.com', (err, u) ->
        should.not.exist err
        u.emails[0].address.should.equal 'test@example.com'
        done()

    it 'should return a user by username', (done) ->
      User.findByEmailOrUsername 'kfinley', (err, u) ->
        should.not.exist err
        u.emails[0].address.should.equal 'test@example.com'
        done()

    it 'should return an error if email address is not found', (done) ->
      User.findByEmailOrUsername 'notfound@example.com', (err, u) ->
        should.not.exist u
        done()

  describe '#addEmail()', ->

    it 'should create a new user', (done) ->
      User.create user1, (err, u1) ->
        should.not.exist err
        u1.addEmail 'new@example.com', (err, vs) ->
          # We should be able to find it.
          User.findByEmailOrUsername 'new@example.com', (err, u2) ->
            should.not.exist err
            String(u2._id).should.equal String(u1._id)
            u2.emails[0].address.should.equal 'test@example.com'
            u2.emails[1].address.should.equal 'new@example.com'
            u2.emails[1].status.should.equal 0
            done()
