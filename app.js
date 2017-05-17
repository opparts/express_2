/**
 * Created by apple on 2017/5/1.
 */

// 27017是MongoDB的端口
// brew services mongodb start


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
app.locals.title = '博客列表';

app.use(function (req, res, next) {
    if (!collections.articles || !collections.users) {
        return next(new Error('No collections.'));
    }
    req.collections = collections;
    return next();
});

//------------------------------------------------------------------------------//
//开始设置环境变量
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));    //__dirname是当前文件的绝对路径
app.set('view engine', 'jade');


//设定一个静态的引用目录，将其设置为lib，然后在其他引用这个node_modules的地方全部设置为"lib/xxx"就可以引用
//这个路径下的文件对象

app.use("/lib",     express.static(path.join(__dirname, 'node_modules')));
app.use("/public",  express.static(path.join(__dirname, 'public')));

// 静态内容暂时不设置
app.use(logger('dev'));
app.use(bodyparser.json());                             // 用来解决使用 content-type : application/json的提交的请求
app.use(bodyparser.urlencoded({ extended: true }));       // 用来解决使用 Content-type : application/x-www-form-urlencoded 提交的请求
                                                        // form表格提交post请求的时候，默认就是这个格式.
app.use(methodoverride());






if ('development' == app.get('env')) {
    app.use(errorhandler());
}



//------------------------------------------------------------------------------//
//处理服务器的路由， 主要是用get、post来渲染JADE模板文件成为html文件

//处理/的路由，将其设置routes（前面引入的）下面的index.js文件
app.get('/', routes.index);                                         //ok

//user.js文件   将login请求定位到user.js文件的login方法中
app.get('/login', routes.user.login);                               //ok

//user.js文件  登出
app.get('/logout', routes.user.logout);                             //ok

//user.js文件    点击"登录"button之后的认证
app.post('/login', routes.user.authenticate);

//              管理博客， 定位到post文件的admin方法中
app.get('/admin',       routes.post.admin);                               //ok
app.get('/post',        routes.post.post);                                //ok, title问题待解决 - 在post.js中注释掉了
app.get('/new_post',    routes.post.new_post);                                //ok, title问题待解决 - 在post.js中注释掉了


//post 发布新博客
app.post('/post',       routes.post.newpost) ;                          //

//查询slug为xxx的post页面，貌似show方法只返回一条记录                         //OK   返回slug=xx的第一条
app.get('/post/:slug',  routes.post.show) ;
//查询slug为xxx的post, 返回所有的                                         //ok   返回slug=xx的所有的post
app.get('/search/:slug',  routes.post.search) ;

//------------------------------------------------------------------------------//
//使用rest api routes，主要是javascript执行AJAX方法，输出json  - 包含GET/POST/PUT/DELETE方法
app.get('/api/posts',       routes.post.list);        //添加文章到草稿
app.post('/api/posts',      routes.post.add);         //在admin中将草稿---变成-->发布状态
app.put('/api/post/:id',    routes.post.edit);
app.delete('/api/post/:id',    routes.post.del);


//------------------------------------------------------------------------------//
//处理没有定义的请求，全部都当404来处理，因为：的确我们没有定义http服务
app.all('*', function (req, res) {
    //res.send(404);
    res.sendStatus(404);
})

//------------------------------------------------------------------------------//
//创建http服务
var server = http.createServer(app);

var start = function () {
    server.listen(app.get('port'), function () {
        console.info('正在监听端口：' + app.get('port'));
    });
}

var stop = function () {
    server.close();
}

//启动http服务
if (require.main === module) {
    console.info('运行app作为主模块');
    start();
}
else {
    console.info('Runing app as a module');
    exports.start = start;
    exports.stop = shutdown;
    exports.port = app.get('port');
}




