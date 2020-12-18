const express = require('express')
const router = express.Router()
const client = require('../db/db')

// @route POST
// @desc get all user
router.get('/', function(req, res, next) {
  let cursor = '0'
  const pattern = 'user*'
  client.scan(cursor, 'MATCH', pattern, 'COUNT', '1000', function(err, reply) {
    if (err) {
      console.log(err)
    }
    if (reply[1].length === 0) {
      res.json({"msg": "Please seed the database before search!"})
    }
    const userids = reply[1]
    let users = []
    userids.forEach(id => {
      client.hgetall(id, function(err, obj) {
        if (!obj) {
          res.render('searchusers', {
            error: 'User does not exist'
          })
        } else {
          obj.id = id
          users.push(obj)
          if (users.length === userids.length) {
            res.render('getallusers', { users })
          }
        }
      })
    })
  })
})

// @route POST
// @desc search a user by id
router.post('/search', function(req, res, next) {
  let id = req.body.id;
  client.hgetall(id, function(err, obj) {
    if (id.substring(0, 4) === 'post') {
      res.render('searchusers', {
        error: 'Cannot use user search to search post'
      })
    }
    if (!obj) {
      res.render('searchusers', {
        error: 'User does not exist'
      })
    } else {
      obj.id = id
      res.render('userdetails', {
        user: obj
      })
    }
  })
})

// @route GET
// render user page
router.get('/add', function(req, res, next) {
  res.render('adduser')
})

// @route POST
// process add/update user page
router.post('/add', function(req, res, next) {
  let id = req.body.id
  let first_name = req.body.first_name
  let last_name = req.body.last_name
  let email = req.body.email
  let phone = req.body.phone
  client.hmset(id, [
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone
  ], function(err, reply) {
    if(err) {
      console.log(err);
    }
    console.log(reply);
    res.redirect('/')
  })
})

// @route DELETE
// process add/update user page
router.delete('/delete/:id', function(req, res, next){
  client.del(req.params.id)
  res.redirect('/')
})


module.exports = router