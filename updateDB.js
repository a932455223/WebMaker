var monk = require('monk');
var url = 'mongodb://localhost:27017/webMaker';
var db = monk(url);
var wrap = require('co-monk');

var table = wrap(db.get('images'));
var data = {
	target_id:0,
	src:'/images/bg.jpg',
};
data.create_at = new Date();
var images = table.find({})
console.log(JSON.stringify(images));
process.exit();