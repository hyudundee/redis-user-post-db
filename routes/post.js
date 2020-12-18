const express = require('express')
const router = express.Router()
const client = require('../db/db')

// @route POST
// @desc get all posts
router.post('/search', function(req, res, next) {
  let id = req.body.id;
  client.lrange(id, 0, -1, function(err, obj) {
    if (id.substring(0, 4) === 'user') {
      res.render('searchusers', {
        error: 'Cannot use post search to search user'
      })
    }
    if (!obj) {
      res.render('searchusers', {
        error: 'Post does not exist'
      })
    } else {
      console.log(obj)
      obj.id = id
      res.render('postdetails', {
        post: obj
      })
    }
  })
})

// @route GET
// @desc get all posts
router.get('/', function(req, res, next) {
  let cursor = '0'
  const pattern = 'postsofuser*'
  client.scan(cursor, 'MATCH', pattern, 'COUNT', '1000', function(err, reply) {
    if (err) {
      console.log(err)
    }
    if (reply[1].length === 0) {
      res.json({"msg": "Please seed the database before search!"})
    }
    const postids = reply[1]
    let posts = []
    postids.forEach(id => {
      client.hgetall(id, function(err, obj) {
        client.lrange(id, 0, -1, function(err, obj) {
        if (!obj) {
          res.render('searchusers', {
            error: 'Post does not exist'
          })
        } else {
          obj.id = id
          posts.push(obj)
          if (posts.length === postids.length) {
            res.render('getallposts', {posts})
          }
        }
      })
    })
    })
  })
})


// @route GET
// @desc render add post page
router.get('/add', function(req, res, next) {
  res.render('addpost')
})

// @route POST
// @desc add one post
router.post('/add', function(req, res, next) {
  let id = req.body.id
  let content = req.body.content
  client.rpush(id, [
    content
  ], function(err, reply) {
    if(err) {
      console.log(err);
    }
    console.log(reply);
    res.redirect('/')
  })
})

// @route DELETE
// @desc delete one post from specific user
router.delete('/delete/:id', function(req, res, next){
  let todelete = req.body.content
  let p_id, p_content
  [p_id, p_content] = todelete.split('#')
  let posts = req.params.id
  client.lrem(posts, '-' + p_id, p_content, function(err, reply) {
    if(err) {
      console.log(err);
    }
    console.log(reply);
    res.redirect('/')
  })
})

module.exports = router