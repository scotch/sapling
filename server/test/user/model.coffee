require '../utils'
user = require('../../user/model')
should = require('should')

describe 'User', ->

  describe '#create()', ->
    it 'should create a new user', (done) ->
      obj =
        name:
          givenName: 'Kyle'
          familyName: 'Finley'
        email: 'test@example.com'

      user.create obj, (err, u) ->
        should.not.exist err
        should.exist u._id
        u.name.givenName.should.equal 'Kyle'
        u.name.familyName.should.equal 'Finley'
        u.email.should.equal 'test@example.com'
        done()

#    it 'should return an error, fore email in use', (done) ->
#      obj =
#        name:
#          givenName: 'Kyle'
#          familyName: 'Finley'
#        email: 'test@example.com'
#
#      user.create obj, (err, u1) ->
#        user.create obj, (err, u2) ->
#          should.exist err
#          done()

  describe '#get()', ->
    userIds = []

    beforeEach (done) ->
      userIds = []
      # create some users
      user.create {email: '1@example.com'}, (err, u) ->
        userIds.push u._id
        user.create {email: '2@example.com'}, (err, u) ->
          userIds.push u._id
          done()

    it 'should get a user by id', (done) ->
      user.get userIds[0], (err, u) ->
        should.not.exist err
        u.email.should.equal '1@example.com'
        done()

    it 'should get a user by email', (done) ->
      user.get {email: '2@example.com'}, (err, u) ->
        should.not.exist err
        u.email.should.equal '2@example.com'
        u.save (err) ->
          console.log err
        done()

