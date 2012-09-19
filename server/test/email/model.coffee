require '../utils'
email = require '../../email/model'
should = require 'should'

describe 'Email', ->

  describe '#create()', ->

    it 'should succeed if valid', (done) ->
      address = 'test@example.com'
      status = 2
      email.create address, status, (err, e) ->
        should.not.exist err
        e.address.should.equal 'test@example.com'
        e.status.should.equal 2
        should.exist e.created
        done()

    it 'should fail if email address is invalid', (done) ->
      address = 'fakexample.com'
      status = 0
      email.create address, status, (err, e) ->
        should.exist err.errors.address
        done()

#  describe '#get()', ->
#
#    beforeEach (done) ->
#      # create some emails
#      email.create '1@example.com', 1, ->
#      email.create '2@example.com', 2, ->
#      done()
#
#    it 'should return email if one exists', (done) ->
#      email.get '2@example.com', (err, e) ->
#        should.not.exist err
#        e.address.should.equal '2@example.com'
#        e.status.should.equal 2
#        done()
#
#    it 'should return null if an email does *not* exists', (done) ->
#      email.get '3@example.com', (err, e) ->
#        should.not.exist err
#        should.not.exist e
#        done()

#  describe '#delete()', ->
#
#  describe '#getByUserId()', ->
#
#  describe '#getByEmail()', ->

