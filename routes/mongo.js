const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const ObjectID = require('mongodb').objectID;
const router = express.Router();

const app = express();
let users;

// app.use(express.static('front'));
app.use(bodyParser.json());

mongodb.MongoClient.connect('mongodb://localhost:27017/testdb', (err, database) => {
	console.log("MongoDB へ 接続中...");
	// Mongoで使うテーブルを指定
	users = database.collection("users");
});

router.get("/api/users", (req, res) => {
	users.find().toArray((err, items) => {
		res.send(items);
	});
});

router.get("/api/users/:_id", (req, res) => {
	users.findOne({_id: mongodb.ObjectID(req.params._id)}, (err, item) => {
		res.send(item);
	});
});

router.post('/api/users', (req, res) => {
	const user = req.body;
	if(user._id) user._id = mongodb.objectId(user._id);
	users.save(user, () => {
		res.send('insert or update');
	});
});

router.delete('/api/users/:_id', (req, res) => {
	users.remove({_id: mongodb.objectId(req.params._id)}, () => {
		res.send('deleted!');
	});
});

module.exports = router;