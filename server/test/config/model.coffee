require '../utils'
should = require 'should'
Config = require('../../config/model').Config


describe 'Config', ->

  describe '#new()', ->

    obj =
      accessToken: '12345'
      num: 12345
      obj:
        one: 1
        two: '2'

    it 'should create a new config entity when the info is vaild', (done) ->
      Config.new 'akey', obj, (err, c) ->
        c.data.accessToken.should.equal '12345'
        c.data.num.should.equal 12345
        c.data.obj.one.should.equal 1
        c.data.obj.two.should.equal '2'
        Config.get 'akey', (err, c) ->
          should.not.exist err
          c.data.accessToken.should.equal '12345'
          c.data.num.should.equal 12345
          c.data.obj.one.should.equal 1
          c.data.obj.two.should.equal '2'
          done()

  describe '#getOrInsert()', ->

    obj =
      prop: 'original'

    it 'should get or insert a new config entity', (done) ->
      Config.getOrInsert 'akey', obj, (err, c) ->
        c.data.prop.should.equal 'original'
        # Change the `prop`
        # c.data.prop = 'changed"; c.save() would be preferred here,
        # but that doesn't seem to work -- results are not immediately available
        Config.findByIdAndUpdate 'akey', {data: {prop: 'changed'}}, (err, cc) ->
          cc.data.prop.should.equal 'changed'
          Config.getOrInsert 'akey', obj, (err, ccc) ->
            should.not.exist err
            ccc.data.prop.should.equal 'changed'
            done()

  describe '#getOrInsert()', ->
