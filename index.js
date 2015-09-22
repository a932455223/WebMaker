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
var request = require('co-request');
var db = monk(url);
swig.setDefaults({
    autoescape: false
});
app.use(logger());
// route middleware
app.use(function*(next) {
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
app.use(route.get('/test',test));
app.use(route.post('/images/:target_id',getImages));
app.use(route.get('/products/:index',getProducts));
    // app.use(route.get('/getPage/:id', getPage));
function* test(){
    yield send(this,__dirname+'/views/test.html');
}

function* getProducts(index){
    index = index||1;

    var result = yield request('http://www.yst.com.cn/pc/security/landing/goods?index='+index+'&_='+Math.random());
    this.body = JSON.parse(result.body);
}
function* getImages(target_id){
    var table = wrap(db.get('images'));
    this.body = yield table.find({target_id:parseInt(target_id)});

}
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
    var target_id;
    while(part = yield parts){
        if(!part.length){
            var d = new Date();
            var _p = './upload/'+ d.getFullYear()+(d.getMonth()+1)+d.getDate()+d.getHours()+d.getMinutes()+d.getSeconds();
            fs.mkdirSync(_p);
            var filePath =  _p + '/'+part.filename;
            var stream = fs.createWriteStream(filePath);
            part.pipe(stream);
        }else{
            if(part[0] === 'target_id'){
                target_id = part[1];
            }
        }
    }
    var table = wrap(db.get('images'));
    var msg = yield table.insert({
        target_id:parseInt(target_id),
        src:filePath.substr(1),
        created_at:new Date()
    });
    this.type = 'text/json';
    this.body = {code:200,path:filePath.substr(1)};
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
        var tmplPath = com.path;
        if(component_id === 2){
            tmplPath = com.path[page[i].config.size].url;
            var products = page[i].config.products;
            if(!products || products.length === 0){
                continue;
            }
            var result = yield request('http://www.yst.com.cn/pc/security/landing/goods/'+products.join(','));
            console.log('http://182.254.222.64/pc/security/landing/goods/'+products.join(','));
            page[i] = result.body;
        }
        var compile = swig.compileFile(tmplPath);
        var data;
        if(typeof page[i] === 'string'){
            data = JSON.parse(page[i]);
        }else{
            data = page[i];
        }
        html += compile(data);

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
    this.body = {
        status: 200,
        msg: 'ok',
        pageId: data._id
    };
}

// listen
app.listen(3000);
console.log('\x1B[32m%s\x1B[0m', 'listening on port 3000');
