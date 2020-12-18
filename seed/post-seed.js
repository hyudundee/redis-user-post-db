const posts = require('./MOCK_DATA_POST.json')
const redis = require('redis')

let client = redis.createClient();
client.on('connect', function() {
  console.log('Connected to Redis')
});


for (let i = 0; i < posts.length; i++) {
  let post = posts[i]
  let id = "postsofuser" + post.id
  let content = post.content

  client.rpush(id, [
    'content', content
  ], function(err, reply) {
    if(err) {
      console.log(err);
    }
    console.log(reply);
  })
}