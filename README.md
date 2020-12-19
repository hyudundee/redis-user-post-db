# Redis-user-post-db

### requirement as pdf

https://github.com/hyudundee/redis-user-post-db/blob/master/class-related/requirement.pdf

### Video Demo and Overview of app

### UML

```javascript
user (1) <---> (0...1) posts <---> (0...n) posts
```

### ERD

```javascript

A numnber [id] is used to mark both user and his/her posts
            \
             \
              \
user ->   user[id]
{               \
  first_name:    \
  second_name:    \
  email:           \
  phone:            \
}                    \
post ->   postofuser[id]
[
  {
    post1: {...}
    post2: {...}
    ...
  }
]
```

### Definition of file data schema with proof that it is in BCNF.

Define User's Schema

```javascript

{
  "id":"user1",
  "first_name":"Phillipe",
  "last_name":"Rodenburgh",
  "email":"prodenburgh0@sourceforge.net",
  "phone":"373-767-1444"
}


```

Design of Posts' Schema

```javascript
{
  "id":"postofuser1",
  "content":"In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus."},

```

### The code of your basic application

https://github.com/hyudundee/redis-user-post-db

### First time install

run

- _npm install_

- _npm start_

access the app via 'http://localhost:3000'

populate data into database

_cd seed_
_node user-seed.js_

after a few seconds, ctrl + c to exit

_node post-seed.js_

after a few seconds, ctrl + c to exit

_cd .._
_npm start_

- enjoy!
