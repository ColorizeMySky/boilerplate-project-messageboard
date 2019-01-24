/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    suite('POST', function() {
      test('Test POST /api/threads/:board return data', function(done) {
        chai.request(server)
          .post('/api/threads/test')
          .send({
            "text": "I am litter sweety tester",
            "delete_password": "delete"
          })
          .end(function(err, res){          
            assert.equal(res.status, 201, 'Server should return 201 statusCode'); 
            assert.property(res, 'text', 'Responce should content the text');
            done();
          })      
      })
      
    });
    
    
    suite('GET', function() {
      test('Test GET /api/threads/:board return data', function(done) {
        chai.request(server)
        .get('/api/threads/getting')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Response should be an array');
          assert.isAtMost(res.body.length, 10, 'Response shouldn\'t contain more then 10 threads')
          assert.property(res.body[0], 'replies', 'Response should contain replies');
          assert.property(res.body[0], 'text', 'Response should contain text');
          assert.property(res.body[0], 'createdAt', 'Response should created date');
          assert.property(res.body[0], 'updatedAt', 'Response should update date');
          done();
        });
      
      });
      
      test('Test GET /api/threads/:board hide data', function(done) {
        chai.request(server)
        .get('/api/threads/getting')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body, 'Response should be an array');
          assert.isAtMost(res.body.length, 10, 'Response shouldn\'t contain more then 10 threads')
          assert.notProperty(res.body[0], 'delete_password', 'Response should\'t contain delete password');
          assert.notProperty(res.body[0], 'reported', 'Response should\'t contain reported field');
          done();
        });
      
      });
      
      test('Test GET /api/threads/:board wrong board', function(done) {
          chai.request(server)
          .get('/api/threads/get')
          .end(function(err, res){
            assert.equal(res.status, 404);
            done();
          });
        })
      
    });
    
    
    suite('DELETE', function() {
       test('Test DELETE /api/threads/:board wrong board', function(done) {
         chai.request(server)
            .delete('/api/threads/getting')
            .send({})
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
       });
      
      test('Test DELETE /api/threads/:board wrong thread', function(done) {
        chai.request(server)
          .delete('/api/threads/getting')
          .send({
            "delete_password": "delete",
            "thread_id": "100500"
          })
          .end(function(err, res){
            assert.equal(res.status, 404);  
            done();
          });
      });
      
      test('Test DELETE /api/threads/:board wrong password', function(done) {
        chai.request(server)
          .delete('/api/threads/getting')
            .send({
              "delete_password": "password",
              "thread_id": "100500"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });  
      
      test('Test DELETE /api/threads/:board return data', function(done) {
        chai.request(server)
          .delete('/api/threads/test')
            .send({
              "delete_password": "delete",
              "thread_id": "5c497c5c83b08210a459c848"
            })
            .end(function(err, res){
              assert.equal(res.status, 200);  
              done();
            });
      });
      
    });
    
    
    suite('PUT', function() {
      test('Test PUT /api/threads/:board wrong board', function(done) {
        chai.request(server)
          .put('/api/threads/test1')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "delete_password": "delete"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });
      
      test('Test PUT /api/threads/:board wrong thread', function(done) {
        chai.request(server)
          .put('/api/threads/test')
            .send({
             	"thread_id": "100500",
              "delete_password": "delete"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            })
      });
      
      test('Test PUT /api/threads/:board wrong password', function(done) {
        chai.request(server)
          .put('/api/threads/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "delete_password": "delete1"
            })
            .end(function(err, res){
              assert.equal(res.status, 403);  
              done();
            })
      });  
      
      test('Test PUT /api/threads/:board return data', function(done) {
        chai.request(server)
          .put('/api/threads/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "delete_password": "delete"
            })
            .end(function(err, res){
              assert.equal(res.status, 200);  
              done();
            })
      });
      
    });
    

  });
  
  
  
  
  
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
      test('Test POST /api/replies/:board return data', function(done) {
         chai.request(server)
          .post('/api/replies/test')
          .send({
            "thread_id": "5c497cb1f9904010e46a42a7",
            "text": "I am litter reply for testing",
            "delete_password": "reply"
          })
          .end(function(err, res){          
            assert.equal(res.status, 201, 'Server should return 201 statusCode'); 
            assert.property(res, 'text', 'Responce should content the text');
            assert.isObject(res.body, 'Response should be an object');           
            assert.property(res.body, 'name', 'Response should contain name');
            assert.property(res.body, 'threads', 'Response should contain threads');
            assert.isArray(res.body.threads, 'Threads should be an array');
            done();
          })       
      })
      
    });
    
    suite('GET', function() {
       test('Test GET /api/replies/:board wrong board', function(done) {
         chai.request(server)
          .get('/api/replies/test1')
          .query({thread_id: "5c497cb1f9904010e46a42a7"})
          .end(function(err, res){
            assert.equal(res.status, 404);
            done();
          });
       });
      
      test('Test GET /api/replies/:board wrong thread', function(done) {
          chai.request(server)
          .get('/api/replies/test')
          .query({thread_id: "100500"})
          .end(function(err, res){
            assert.equal(res.status, 404);
            done();
          }); 
      }); 
      
      test('Test GET /api/replies/:board return data', function(done) {
        chai.request(server)
          .get('/api/replies/test')
          .query({thread_id: "5c497cb1f9904010e46a42a7"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.property(res.body, 'replies', 'Response should contain threads');
            assert.isArray(res.body.replies, 'Replies should be an array');
            done();
          }); 
      });
      
      test('Test GET /api/replies/:board hide data', function(done) {
        chai.request(server)
          .get('/api/replies/test')
          .query({thread_id: "5c497cb1f9904010e46a42a7"})
          .end(function(err, res){
            assert.equal(res.status, 200);
            assert.isObject(res.body, 'Response should be an object');
            assert.property(res.body, 'replies', 'Response should contain threads');
            assert.isArray(res.body.replies, 'Replies should be an array');           
            assert.notProperty(res.body, 'delete_password', 'Response should\'t contain delete password');
            assert.notProperty(res.body, 'reported', 'Response should\'t contain reported field');
            assert.notProperty(res.body.replies[0], 'delete_password', 'Reply should\'t contain delete password');
            assert.notProperty(res.body.replies[0], 'reported', 'Reply should\'t contain reported field');
            done();
          }); 
      });
      
    });
    
    suite('PUT', function() {
      test('Test PUT /api/replies/:board wrong board', function(done) {
        chai.request(server)
          .put('/api/replies/test1')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "5c498d9f9bb6a55157f42771",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });
      
      test('Test PUT /api/replies/:board wrong thread', function(done) {
        chai.request(server)
          .put('/api/replies/test')
            .send({
             	"thread_id": "100500",
              "reply_id": "5c498d9f9bb6a55157f42771",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });
      
      test('Test PUT /api/replies/:board wrong reply', function(done) {
        chai.request(server)
          .put('/api/replies/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "100500",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });
      
      test('Test PUT /api/replies/:board wrong password', function(done) {
        chai.request(server)
          .put('/api/replies/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "5c498d9f9bb6a55157f42771",
              "delete_password": "password"
            })
            .end(function(err, res){
              assert.equal(res.status, 403);  
              done();
            });
      });  
      
      test('Test PUT /api/replies/:board return data', function(done) {
        chai.request(server)
          .put('/api/replies/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "5c498d9f9bb6a55157f42771",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 200);
              assert.isObject(res.body, 'Response should be an object');           
              assert.property(res.body, 'name', 'Response should contain name');
              assert.property(res.body, 'threads', 'Response should contain threads');
              assert.isArray(res.body.threads, 'Threads should be an array');
              done();
            });
      });
      
    });
    
    suite('DELETE', function() {
      test('Test DELETE /api/replies/:board wrong board', function(done) {
        chai.request(server)
          .delete('/api/replies/test1')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "5c498f1656b3065cda521abd",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });
      
      test('Test DELETE /api/replies/:board wrong thread', function(done) {
        chai.request(server)
          .delete('/api/replies/test')
            .send({
             	"thread_id": "100500",
              "reply_id": "5c498f1656b3065cda521abd",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });
      
      test('Test DELETE /api/replies/:board wrong reply', function(done) {
        chai.request(server)
          .delete('/api/replies/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "100500",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 404);  
              done();
            });
      });
      
      test('Test DELETE /api/replies/:board wrong password', function(done) {
        chai.request(server)
          .delete('/api/replies/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "5c498f1656b3065cda521abd",
              "delete_password": "password"
            })
            .end(function(err, res){
              assert.equal(res.status, 403);  
              done();
            });
      });  
      
      test('Test DELETE /api/replies/:board return data', function(done) {
        chai.request(server)
          .delete('/api/replies/test')
            .send({
             	"thread_id": "5c497cb1f9904010e46a42a7",
              "reply_id": "5c498f1656b3065cda521abd",
              "delete_password": "reply"
            })
            .end(function(err, res){
              assert.equal(res.status, 200);  
              done();
            });
      });
      
    });
    
  });

});
