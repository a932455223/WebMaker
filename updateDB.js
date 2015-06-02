var monk = require('monk');
var url = 'mongodb://localhost:27017/webMaker';
var db = monk(url);
var wrap = require('co-monk');

var table = wrap(db.get('imagesInfo'));
var data = {
	target_id:5,
	component_id:16,
	description:'自定义按钮'
};
data.create_at = new Date();
table.insert(data);

