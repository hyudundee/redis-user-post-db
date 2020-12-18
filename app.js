const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const redis = require('redis')
// create redis client
let client = redis.createClient();
client.on('connect', function() {
  console.log('Connected to Redis')
});

// set port
const port = 3000

// init app
const app = express()

// view engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

// body parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

// method override
app.use(methodOverride('_method'))

// search page
app.get('/', function(req, res, next) {
  res.render('searchusers')
})

// get all user
app.get('/user', function(req, res, next) {
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

// search processing
app.post('/user/search', function(req, res, next) {
  let id = req.body.id;
  client.hgetall(id, function(err, obj) {
    console.log(id.substring(0, 4))
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

// add user page
app.get('/user/add', function(req, res, next) {
  res.render('adduser')
})

// process add user page
app.post('/user/add', function(req, res, next) {
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

// delete user
app.delete('/user/delete/:id', function(req, res, next){
  client.del(req.params.id)
  res.redirect('/')
})


// search processing
app.post('/post/search', function(req, res, next) {
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

// get all user
app.get('/post', function(req, res, next) {
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


// add post page
app.get('/post/add', function(req, res, next) {
  res.render('addpost')
})

// process add post page
app.post('/post/add', function(req, res, next) {
  let id = req.body.id
  let content = req.body.content
  console.log(req.body)
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

app.post('/post/add', function(req, res, next) {
  let id = req.body.id
  let content = req.body.content
  client.hmset(id, [
    'content', content
  ], function(err, reply) {
    if(err) {
      console.log(err);
    }
    console.log(reply);
    res.redirect('/')
  })
})

// delete post
app.delete('/post/delete/:id', function(req, res, next){
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

app.post('/reset', function(req, res, next) {
  console.log(1)
  client.flushdb(function(err, succeed) {
    res.json({"msg": "succeed"})
  })
})

// app listen on port 3000
app.listen(port, function() {
  console.log(`Server is running on port ${port}`)
})