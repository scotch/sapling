require '../utils'
should = require('should')
User = require('../../user/model').User

user1 =
  profile:
    name:
      givenName: 'Kyle'
      familyName: 'Finley'
    emails: [
      value: 'test@example.com'
      type: 'home'
      status: 3
    ]
    username: 'kfinley'

describe 'User: model', ->

  describe '#create()', ->

    it 'should create a new user', (done) ->
      User.create user1, (err, u) ->
        should.not.exist err
        should.exist u._id
        p = u.getProfile()
        p.name.givenName.should.equal 'Kyle'
        p.name.familyName.should.equal 'Finley'
        p.username.should.equal 'kfinley'
        u.profile.emails[0].value.should.equal 'test@example.com'
        u.profile.emails[0].status.should.equal 3
        u.profile.emails[0].primary.should.equal true
        done()

  describe '#findByEmailOrUsername()', ->

    beforeEach (done) ->
      User.create user1, (err, u) ->
        should.not.exist err
        done()

    it 'should return a user by email address', (done) ->
      User.findByEmailOrUsername 'test@example.com', (err, u) ->
        should.not.exist err
        u.profile.emails[0].value.should.equal 'test@example.com'
        done()

    it 'should return a user by username', (done) ->
      User.findByEmailOrUsername 'kfinley', (err, u) ->
        should.not.exist err
        u.profile.emails[0].value.should.equal 'test@example.com'
        done()

    it 'should return a null user if the email address is not found', (done) ->
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
            p = u2.getProfile()
            p.emails[0]._id.should.equal 'test@example.com'
            p.emails[0].value.should.equal 'test@example.com'
            p.emails[0].status.should.equal 3
            p.emails[0].primary.should.equal true
            p.emails[1]._id.should.equal 'new@example.com'
            p.emails[1].value.should.equal 'new@example.com'
            p.emails[1].status.should.equal 0
            p.emails[1].primary.should.equal false
            done()
