var request = require('superagent');
var expect = require('expect');

// Note that when writing synchronous code, omit the callback(done) and mocha will automatically
// continue  to the next test.
describe('express rest api server', function(){
  var id;
  // INSERT ONE
  it('posts an object', function(done){
    request.post('http://localhost:3000/collections/test')
      .send({name: 'chicken', type: 'bird'})
      .end(function(err, res) {
        console.log(res.body);
        expect(err).toEqual(null);
        // expect(res.body.length).toEqual(1);
        // expect(res.body[0]._id.length).toEqual(24);
        id = res.body[0]._id;
        done() ;
      });
  });

  // GET ONE
  it('retrieves an object', function(done) {
    request.get('http://localhost:3000/collections/test/'+id)
    .end(function (err, res) {
      // console.log(res.body);
      expect(err).toEqual(null);
      expect(typeof res.body).toEqual('object');
      expect(res.body._id.length).toEqual(24);
      expect(res.body._id).toEqual(id);
      done();
    });
  });

  // GET ALL
  it('retrieves a collection', function(done) {
    request.get('http://localhost:3000/collections/test')
    .end(function(err, res) {
      // console.log(res.body);
      expect(err).toEqual(null);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body.map(function (item){return item._id})).toContain(id);
      done();
    });
  });

  // UPDATES ONE
  it('updates an object', function (done) {
    request.put('http://localhost:3000/collections/test/'+id)
      .send({name: 'peter', email: 'peter@yahoo.com'})
      .end(function (err, res) {
        // console.log(res.body);
        expect(err).toEqual(null);
        expect(typeof res.body).toEqual('object');
        expect(res.body.msg).toEqual('success');
        done();
      });
  });

  //CHECKS FOR UPDATED OBJECT
  it('checks an updated object', function (done) {
    request.get('http://localhost:3000/collections/test/'+id)
      .end(function (err, res) {
        // console.log(res.body)
        expect(err).toEqual(null);
        expect(typeof res.body).toEqual('object');
        expect(res.body._id.length).toEqual(24);
        expect(res.body._id).toEqual(id);
        expect(res.body.name).toEqual('peter');
        done();
      });
  });

  // DELETE ONE
  it('removes an object', function (done) {
    request.del('http://localhost:3000/collections/test/'+id)
      .end(function (err, res) {
      // console.log(res.body);
      expect(err).toEqual(null);
      expect(typeof res.body).toEqual('object');
      expect(res.body.msg).toEqual('success');
      done();
      });
  });
});

















