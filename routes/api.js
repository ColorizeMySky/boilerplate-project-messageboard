/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;

const bodyParser  = require('body-parser');
const url = require('url'); 

const Boards = require('../models/board');


module.exports = function (app) {
  
  app.route('/api/threads/:board')
    //I can GET an array of the most recent 10 bumped threads on the board with only the most recent 3 replies from /api/threads/{board}. The reported and delete_passwords fields will not be sent.
    .get(function(req, res, next) {
      Boards.find({"name": req.params.board})
        .then( (board) => {          
          if(board.length == 0) {
            res.statusCode = 404;
            res.end("Board not found");
          }
          else {
            let result = board[0].threads;
            result.length = 10;
            for (let item of result) {
              if(item.replies.length > 3) item.replies.length = 3;
            }            
            
            res.statusCode = 200;
            res.json(result);          
          }
      }).catch((err) => next(err));  
    })

  
    //I can POST a thread to a specific message board by passing form data text and delete_password to /api/threads/{board}.
    //(Recomend res.redirect to board page /b/{board}) Saved will be _id, text, created_on(date&time), bumped_on(date&time, starts same as created_on), reported(boolean), delete_password, & replies(array).
    .post(function(req, res, next) {  
      Boards.find({"name": req.params.board})
      .then((board) => { 
        if(board.length == 0) {
          Boards.create({
            "name": req.params.board,
            "threads": [{
                "text": req.body.text,
                "delete_password": req.body.delete_password
            }]
          })
          .then((board) => {
            res.statusCode = 201;
            res.end(`New board "${board.name}" with ID ${board._id} and new thread with ID ${board.threads[0]._id} are created successfully. Take a pie.`);
          })
        }
        else {
          board[0].threads.push({"text": req.body.text, "delete_password": req.body.delete_password});
          board[0].save()
          .then( (board) => {
            res.statusCode = 201;
          })
          res.end(`New thread with ID ${board[0].threads[0]._id} for board "${board[0].name}" is created successfully. Waiting for some more.`);
        }
      })
      .catch((err) => next(err));       
    })
  
  
    //I can report a thread and change it's reported value to true by sending a PUT request to /api/threads/{board} and pass along the thread_id. (Text response will be 'success')
    .put(function(req, res, next) {    
      Boards.find({"name": req.params.board})
      .then((board) => {
        if(board.length == 0) {
          res.statusCode = 404;
          res.end("Board not found");
        }
        else {
          let thread = board[0].threads.filter( (thread) => thread._id == req.body.thread_id);
          
          if(thread.length == 0) {
            res.statusCode = 404;
            res.end("Thread don't found");
          }
          
          if(thread[0].delete_password == req.body.delete_password) {
            board[0].threads.filter( (thread) => thread._id == req.body.thread_id).map( (item) => item.reported = true);
            board[0].save()
            .then((board) => {
              res.end('success');
            })
          }
          else {
            res.statusCode = 403;
            res.end("Access denied");
          }          
        }
        
      })
      .catch((err) => next(err));   
    })
  
  
    //I can delete a thread completely if I send a DELETE request to /api/threads/{board} and pass along the thread_id & delete_password. (Text response will be 'incorrect password' or 'success')
    .delete(function(req, res, next) {  
      Boards.find({"name": req.params.board})
      .then((board) => {
        if(board == null) {
          res.statusCode = 404;
          res.end("Board not found")
        }
        else {
          let thread = board[0].threads.filter( (thread) => thread._id == req.body.thread_id);
          
          if(thread.length == 0) {
            res.statusCode = 404;
            res.end("Thread don't found");
          }
          
          if(thread[0].delete_password == req.body.delete_password) {
            thread[0].remove()
            board[0].save()
            .then((board) => {
              res.end('success');
            })
          }
          else {
            res.statusCode = 403;
            res.end("Access denied");
          }
        }
        
      })
      .catch((err) => next(err));   
    });
    
  
  
  
  app.route('/api/replies/:board')
    //I can GET an entire thread with all it's replies from /api/replies/{board}?thread_id={thread_id}. Also hiding the same fields.
    // "Also hiding the same fields." What? What are you talking about? Why would not do univocal tasks?
    .get(function(req, res, next) {
      Boards.find({"name": req.params.board})
        .then( (board) => {
          let urlParsed = url.parse(req.url, true);
        
          if(board.length == 0) {
            res.statusCode = 404;
            res.end("Board not found");
          }
          else {            
            let thread = board[0].threads.filter( (thread) => thread._id == urlParsed.query.thread_id);
            
            if(thread.length == 0) {
              res.statusCode = 404;
              res.end("Thread don't found");
            }
            else {
              res.statusCode = 200;
              res.json(thread);
            }          
          }          
        })
        .catch((err) => next(err)); 
    })
  

    //I can POST a reply to a thead on a specific board by passing form data text, delete_password, & thread_id to /api/replies/{board} and it will also update the bumped_on date to the comments date.
    //(Recomend res.redirect to thread page /b/{board}/{thread_id}) In the thread's 'replies' array will be saved _id, text, created_on, delete_password, & reported.
    .post(function(req, res, next) {
      Boards.find({"name": req.params.board})
        .then( (board) => {
          let urlParsed = url.parse(req.url, true);
        
          if(board.length == 0) {
            res.statusCode = 404;
            res.end("Board not found");
          }
          else {       
            //req.body data text, delete_password, & thread_id
            let thread = board[0].threads.filter( (thread) => thread._id == req.body.thread_id);
            
            if(thread.length == 0) {
              res.statusCode = 404;
              res.end("Thread don't found");
            }
            else {
              let newReply = {
                "text": req.body.text,
                "delete_password": req.body.delete_password
              }
              thread[0].replies.push(newReply);
              board[0].save()
              .then( (board) => {
                res.statusCode = 200;
                res.json(board);
              })
            }                            
          }          
        })
        .catch((err) => next(err)); 
    })
  
  
    //I can report a reply and change it's reported value to true by sending a PUT request to /api/replies/{board} and pass along the thread_id & reply_id. (Text response will be 'success')
    .put(function(req, res, next) {
      Boards.find({"name": req.params.board})
        .then( (board) => {
          let urlParsed = url.parse(req.url, true);
        
          if(board.length == 0) {
            res.statusCode = 404;
            res.end("Board not found");
          }
          else {
            let thread = board[0].threads.filter( (thread) => thread._id == req.body.thread_id);
            
            if(thread.length == 0) {
              res.statusCode = 404;
              res.end("Thread don't found");
            }
            else {
              let reply = thread[0].replies.filter( (reply) => reply._id == req.body.reply_id);
              
              if(reply.length == 0) {
                res.statusCode = 404;
                res.end("Reply don't found");
              }
              else {
                if(reply[0].delete_password == req.body.delete_password) {
                  reply[0].reported = true;
                  board[0].save()
                  .then((board) => {
                    res.json(board);
                  })
                }
                else {
                  res.statusCode = 403;
                  res.end("Access denied");
                } 
              }
            }                            
          }          
        })
        .catch((err) => next(err)); 
  
    })
  
  
    //I can delete a post(just changing the text to '[deleted]') if I send a DELETE request to /api/replies/{board} and pass along the thread_id, reply_id, & delete_password.
    //Text response will be 'incorrect password' or 'success')
    .delete(function(req, res, next) {
      Boards.find({"name": req.params.board})
        .then( (board) => {
          let urlParsed = url.parse(req.url, true);
        
          if(board.length == 0) {
            res.statusCode = 404;
            res.end("Board not found");
          }
          else {
            let thread = board[0].threads.filter( (thread) => thread._id == req.body.thread_id);
            
            if(thread.length == 0) {
              res.statusCode = 404;
              res.end("Thread don't found");
            }
            else {
              let reply = thread[0].replies.filter( (reply) => reply._id == req.body.reply_id);
              
              if(reply.length == 0) {
                res.statusCode = 404;
                res.end("Reply don't found");
              }
              else {
                if(reply[0].delete_password == req.body.delete_password) {
                  reply[0].remove()
                  board[0].save()
                  .then((board) => {
                    res.end('success');
                  })
                }
                else {
                  res.statusCode = 403;
                  res.end("Access denied");
                } 
              }
            }                            
          }          
        })
        .catch((err) => next(err));     });

};
