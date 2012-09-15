var user = require('../../user/model')
    , should = require('should')
    , ds = require('../../ds');

describe("User", function(){

  beforeEach(function(done){
    ds.clear(function(err){
      done();
    });
  });

  it("create new user", function(done){
    var nu = {
      'name': {
        'givenName': 'Kyle',
        'familyName': 'Finley'
      },
      'email': 'test@example.com',
      'password': {
        'new': 'pass1'
      }
    };
    user.create(nu, function(err, u){
      should.not.exist(err);
      u.email.should.equal('test@example.com');
      done();
    });
  });
});