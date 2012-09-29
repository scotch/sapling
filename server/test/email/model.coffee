require '../utils'
Email = require('../../email/model').Email
should = require 'should'

#describe 'Email', ->

  #describe '#new()', ->

    #it 'should succeed if valid', (done) ->
      #Email.new 'test@example.com', 2, (err, e) ->
        #should.not.exist err
        #e.address.should.equal 'test@example.com'
        #e.status.should.equal 2
        #should.exist e.created
        #done()

    #it 'should fail if email address is invalid', (done) ->
      #Email.new 'fakexample.com', 0, (err, e) ->
        #should.exist err.errors.address
        #done()
