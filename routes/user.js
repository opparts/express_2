

exports.list = function(req, res){
    res.send('返回所有的用户');
};


/*
 * GET login page.
 */

exports.login = function(req, res, next) {
    res.render('login');
};

/*
 * GET logout route. 重新定向到首页
 */

exports.logout = function(req, res, next) {

    res.redirect('/');
};


/*
 * POST authenticate route.
 */

exports.authenticate = function(req, res, next) {
    res.redirect('/admin');

};