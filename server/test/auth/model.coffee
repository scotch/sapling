require '../utils'
should = require 'should'
AuthProfile = require('../../auth/model').AuthProfile


describe 'AuthProfile', ->

  userId = '000000000000000000000001'
  profile =
    name:
      givenName: 'Bob'
      familyName: 'Dole'

  describe '#new()', ->

    it 'should create a new auth entity when the info is vaild', (done) ->

      AuthProfile.new 'local', userId, userId, profile, (err, a) ->
        should.not.exist err
        should.exist a._id
        should.exist a.createdAt
        a.profile.provider.should.equal 'local'
        a.profile.id.should.equal userId
        String(a.userId).should.equal userId
        AuthProfile.findOne {userId: userId}, (err, u) ->
          String(a.userId).should.equal userId
          done()

  describe '#get()', ->

    beforeEach (done) ->
      AuthProfile.new 'local', userId, userId, profile, (err, a) ->
        done()

    it 'should get an auth entity by provider and id', (done) ->
      AuthProfile.get 'local', userId, (err, a) ->
        should.not.exist err
        String(a.userId).should.equal userId
        a.profile.provider.should.equal 'local'
        a.profile.id.should.equal userId
        done()