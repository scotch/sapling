require '../utils'
should = require('should')
User = require('../../user/model').User

user1 =
  name:
    givenName: 'Kyle'
    familyName: 'Finley'
  email: 'test@example.com'

describe 'User', ->

  describe '#create()', ->

    it 'should create a new user', (done) ->
      User.create user1, (err, u) ->
        should.not.exist err
        should.exist u._id
        u.name.givenName.should.equal 'Kyle'
        u.name.familyName.should.equal 'Finley'
        u.email.should.equal 'test@example.com'
        done()