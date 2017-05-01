/**
 * Created by apple on 2017/5/1.
 */

var express = require('express'),
    routes = require('./routes'),
    http = require('http'),
    path = require('path'),
    mongoskin = require('mongoskin'),
    dburl = process.env.MONGOHQ_URL || 'mongodb://@localhost:27017/node',
    db = mongoskin.db(dburl, {safe: true}),
    collections = {
        articles: db.collection('articles'),
        users: db.collection('users')
    };

var session = require('express-session'),
    logger = require('morgan'),
    errorhandler = require('errorhandler'),
    cookieparser = require('cookie-parser'),
    bodyparser = require('body-parser'),
    methodoverride = require('method-override');

var app = express();
app.locals.appTitle = '使用NodeJS重构Wordpress博客';

app.use(function (req, res, next) {
    if (!collections.articles || !collections.users) {
        return next(new Error('No collections.'));
    }
    req.collections = collections;
    return next();
});

app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));    //__dirname是当前文件的绝对路径
app.set('view engine', 'jade');

//设定一个静态的引用目录
app.use("/lib",express.static(path.join(__dirname, 'node_modules')));

// 静态内容暂时不设置
app.use(logger('dev'));

//处理服务器的路由， 主要是用get、post来渲染JADE模板文件成为html文件
app.get('/', routes.index);                                         //ok
//index.js文件

app.get('/login', routes.user.login);                               //ok
//user.js文件   切换到登录界面 login是js文件中定义的函数

app.get('/logout', routes.user.logout);                             //ok
//user.js文件  登出

app.post('/login', routes.user.authenticate);
//user.js文件    点击"登录"button之后的认证

app.get('/admin', routes.post.admin);
//post  管理博客

app.get('/post', routes.post.post);

app.post('/post', routes.post.newpost) ;
//post 发布新博客

app.post('/post/:slug', routes.post.show) ;
//user.js文件      //显示页面


//使用rest api routes，主要是javascript执行AJAX方法，输出json  - 包含GET/POST/PUT/DELETE方法
app.get('/api/posts', routes.post.list);        //
app.post('/api/posts', routes.post.add);
app.put('/api/post/:id', routes.post.edit);
app.del('/api/post/:id', routes.post.del);

app.all('*', function (req, res) {
    res.send(404);

})


//启动http 服务
var server = http.createServer(app);


var boot = function () {
    server.listen(app.get('port'), function () {
        console.info('正在监听端口：' + app.get('port'));
    });
}

var shutdown = function () {
    server.close();
}

if (require.main === module) {
    boot();
}
else {
    console.info('Runing app as a module');
    exports.boot = boot;
    exports.shutdown = shutdown;
    exports.port = app.get('port');
}




