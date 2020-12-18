const users = require('./MOCK_DATA_USER.json')
const redis = require('redis')

let client = redis.createClient();
client.on('connect', function() {
  console.log('Connected to Redis')
});


for (let i = 0; i < users.length; i++) {
  let user = users[i]
  let id = "user" + user.id
  let email = user.email
  let first_name = user.first_name
  let last_name = user.last_name
  let phone = user.phone

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
  })
}



for (let i = 0; i < posts.length; i++) {
  let post = posts[i]
  let id = "post" + post.id
  let content = post.content

  client.hmset(id, [
    'content', content
  ], function(err, reply) {
    if(err) {
      console.log(err);
    }
    console.log(reply);
  })
}