/**
 * Module dependencies.
 */

var render = require('./lib/render');
var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var parseFile = require('co-busboy')
var fs = require('fs');
var koa = require('koa');
var swig = require('swig');
var send = require('koa-send');
var url = 'mongodb://localhost:27017/webMaker';
var monk = require('monk');
var wrap = require('co-monk');
var app = koa();
var os = require('os');
var path =require('path');
var assert = require('assert');

var db = monk(url);
swig.setDefaults({
    autoescape: false
});
app.use(logger());
// route middleware
app.use(function*(next) {
    console.log(this.path);
    if(this.path.indexOf('upload/')>0){
        yield send(this,__dirname +this.path);
    }
    if (this.accepts('text/css', 'text/javascript')) {
        yield send(this, __dirname + '/assert' + this.path);
    }
    yield next;
});

app.use(route.get('/', index));
app.use(route.get('/pages', list));
app.use(route.get('/page/:id', show));
app.use(route.post('/page', create));
app.use(route.get('/page/:id/edit', edit));
app.use(route.post('/page/delete/:id', deletePage))
app.use(route.post('/upload',upload));
    // app.use(route.get('/getPage/:id', getPage));
    /** deletePage 根据id删除对应的页面 **/
function* deletePage(id) {
        var pages = wrap(db.get('pages'));
        var msg = yield pages.remove({
            '_id': id
        });
        this.body = {
            'status': 200,
            msg: '数据成功删除'
        };
    }

/*上传文件的接口*/
function* upload(next){
    // if('POST' !== this.method){ return yield next;}
    var parts = parseFile(this);
    var part;
    while(part = yield parts){
        if(!part.length){
            var d = new Date();
            var _p = './upload/'+d.getFullYear()+(d.getMonth()+1)+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds()+part.filename;
            var stream = fs.createWriteStream(_p);
            part.pipe(stream);
        }
    }
    this.body = 'ok';
}
    /**pages list页面**/
function* list(next) {
        var pages = wrap(db.get('pages'));
        this.type = 'text/json';
        this.body = yield pages.find({});
    }
    /**
     * Post listing.
     */
function* edit(id) {
    var pages = wrap(db.get('pages'));
    var page = yield pages.findOne({
        _id: id
    });
    console.log(page);
    yield send(this, __dirname + '/views/edit.html');
}

function* index() {
    yield send(this, __dirname + '/views/index.html');
}

/**
 * Show post :id.
 */

function* show(id) {
    var pages = wrap(db.get('pages'));
    var comTmpl = wrap(db.get('tmpl'));
    var item = yield pages.findOne({
        _id: id
    });
    var page = item.pages;
    var html = '';
    for (var i in page) {
        var component_id = parseInt(page[i].id);
        var com = yield comTmpl.findOne({
            component_id: component_id
        });
        console.log(JSON.stringify(item));
        var tmplPath = com.path;
        if(component_id === 2){
            tmplPath = com.path[page[i].config.size].url;
        }
        var compile = swig.compileFile(tmplPath);
        html += compile(page[i]);

    }
    this.body = yield render('show', {
        content: html,
        title: item.title
    });
}

function* create() {
    var pages = wrap(db.get('pages'));
    var data = yield parse(this);
    data.created_at = new Date();
    var msg = yield pages.insert(data);
    console.log(msg);
    console.log(data);
    this.body = {
        status: 200,
        msg: 'ok',
        pageId: data._id
    };
}

// listen
app.listen(3000);
console.log('\x1B[32m%s\x1B[0m', 'listening on port 3000');
