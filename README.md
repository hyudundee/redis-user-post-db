# Redis-user-post-db

### requirement as pdf

https://github.com/hyudundee/mongodb-assignment/blob/master/class-related/requirement.pdf

### UML

![image](https://github.com/hyudundee/user-db-sqlite3-ejs-express/blob/master/class-related/UML.png)

### ERD

![image](https://github.com/hyudundee/mongodb-assignment/blob/master/class-related/DataSchemaDesign.png)

### Definition of file data schema with proof that it is in BCNF.

Define User's Schema

```javascript
const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	friends: [
		{
			user: {
				type: Schema.Types.ObjectId,
				ref: "users",
			},
			connectDate: {
				type: Date,
				default: Date.now,
			},
		},
	],
	createDate: {
		type: Date,
		default: Date.now,
	},
});
```

Design of Posts' Schema

```javascript
const PostSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
	},
	text: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	createDate: {
		type: Date,
		default: Date.now,
	},
});
```

### Mongo Atlas Post

![image](https://github.com/hyudundee/mongodb-assignment/blob/master/class-related/MongoAtlas-Posts.png)

### Mongo Atlas User

![image](https://github.com/hyudundee/mongodb-assignment/blob/master/class-related/MongoAtlas-Users.png)

### The code of your basic application

https://github.com/hyudundee/mongodb-assignment

### Overview of app

![image](https://github.com/hyudundee/mongodb-assignment/blob/master/class-related/Overview%20of%20app.png)

### First time install

run

- _npm install_

- _npm run server_

access the app via 'http://localhost:5000/users'

- enjoy!
