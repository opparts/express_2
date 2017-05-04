/*
 * GET article page.
 */

exports.show = function (req, res, next) {
    if (!req.params.slug) return next(new Error('No article slug.'));
    req.collections.articles.findOne({slug: req.params.slug}, function (error, article) {
        if (error) return next(error);
        if (!article.published) return res.send(401);
        res.render('post', article);
    });
};

/*
 * GET article page.  返回slug=xxx的所有的文章列表
 */
exports.search = function (req, res, next) {
    if (!req.params.slug) return next(new Error('No article slug.'));
    req.collections.articles.find({slug: req.params.slug}, function (error, article) {
        if (error) return next(error);
        if (!article.published) return res.send(401);
        res.render('search_result', {all_post: articles});
    });
};


/*
 * GET articles API.
 */

exports.list = function (req, res, next) {
    req.collections.articles.find({}).toArray(function (error, articles) {
        if (error) return next(error);
        res.send({articles: articles});
    });
};


/*
 * POST article API.
 */

exports.add = function (req, res, next) {
    if (!req.body.article) return next(new Error('No article payload.'));
    var article = req.body.article;
    article.published = false;
    req.collections.articles.insert(article, function (error, articleResponse) {
        if (error) return next(error);
        res.send(articleResponse);
    });
};


/*
 * PUT article API.
 */

exports.edit = function (req, res, next) {
    if (!req.params.id) return next(new Error('No article ID.'));
    req.collections.articles.updateById(req.params.id, {$set: req.body.article}, function (error, count) {
        if (error) return next(error);
        res.send({affectedCount: count});
    });
};

/*
 * DELETE article API.
 */

exports.del = function (req, res, next) {
    if (!req.params.id) return next(new Error('No article ID.'));
    req.collections.articles.removeById(req.params.id, function (error, count) {
        if (error) return next(error);
        res.send({affectedCount: count});
    });
};


/*
 * GET article POST page.
 */

exports.post = function (req, res, next) {
    //先把这个东西放在一边，等下再拿掉注释，可能是为了不让用户看到一个空的博客的list页面
    //if (!req.body.title)
    res.render('post');
};


/*
 * POST article POST page.
 */

exports.newpost = function (req, res, next) {
    if (!req.body.title || !req.body.slug || !req.body.text) {
        return res.render('post', {error: 'Fill title, slug and text.'});
    }
    var article = {
        title: req.body.title,
        slug: req.body.slug,
        text: req.body.text,
        published: false
    };
    req.collections.articles.insert(article, function (error, articleResponse) {
        if (error) return next(error);
        res.render('post', {error: 'Article was added. Publish it on Admin page.'});
    });
};


/*
 * GET admin page.
 */

exports.admin = function (req, res, next) {
    req.collections.articles.find({}, {sort: {_id: -1}}).toArray(function (error, articles) {
        if (error) return next(error);
        res.render('admin', {all_post: articles});
    });

}