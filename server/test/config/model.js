'use strict';

var utils = require('../utils');
var should = require('should');
var Config = require('../../config/model').Config;


describe('Config', function () {
  describe('#new()', function () {
    var obj = {
      accessToken: '12345',
      num: 12345,
      obj: {
        one: 1,
        two: '2'
      }
    };
    it('should create a new config entity when the info is vaild', function (done) {
      Config["new"]('akey', obj, function (err, c) {
        c.data.accessToken.should.equal('12345');
        c.data.num.should.equal(12345);
        c.data.obj.one.should.equal(1);
        c.data.obj.two.should.equal('2');
        Config.get('akey', function (err, c) {
          should.not.exist(err);
          c.data.accessToken.should.equal('12345');
          c.data.num.should.equal(12345);
          c.data.obj.one.should.equal(1);
          c.data.obj.two.should.equal('2');
          done();
        });
      });
    });
  });
  describe('#getOrInsert()', function () {
    var obj = {
      prop: 'original'
    };
    it('should get or insert a new config entity', function (done) {
      Config.getOrInsert('akey', obj, function (err, c) {
        c.data.prop.should.equal('original');
        Config.findByIdAndUpdate('akey', {
          data: {
            prop: 'changed'
          }
        }, function (err, cc) {
          cc.data.prop.should.equal('changed');
          Config.getOrInsert('akey', obj, function (err, ccc) {
            should.not.exist(err);
            ccc.data.prop.should.equal('changed');
            done();
          });
        });
      });
    });
  });
  describe('#getOrInsert()', function () {});
});
