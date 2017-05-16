/*
 * GET article page.                                        //导航到post页面
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
 * GET article page.                                        //导航到new_post.jade这个模板页面中
 */
exports.new_post = function (req, res, next) {
    res.render('new_post');
};




/*
 * GET article page.  返回slug=xxx的所有的文章列表,不做任何排序     //导航到search_result这个JADE页面
 */
exports.search = function (req, res, next) {
    if (!req.params.slug) return next(new Error('No article slug.'));
    req.collections.articles.find({slug: req.params.slug}).toArray(function (error, articles) {
        if (error) return next(error);

        res.render(
            'search_result',            //加载search_result.jade这个模板文件
            {
                all_post: articles,
                slug: req.params.slug   //将slug作为新参数，传入到search_result的jade的模板文件中
            }
        );
    });
};


/*
 * GET - 返回所有的POST文章，是所有的博客，Articles这个collections（数据库表）中的所有的记录
 */

exports.list = function (req, res, next) {
    //              mongodb中的表名：叫articles.

    req.collections.articles.find({}).toArray(function (error, all_posts) {
        if (error) return next(error);
        res.send(
            {
                //这里res.send方法输出的是一个数组对象,因为all_posts是一个json数组
                // 所以返回的对象中其实只有一个元素，那就是articles，
                //它的值则是一个json数组,就睡这里的all_posts
                articles: all_posts
            }
        );
    });
};


/*
 * POST article API.
 * 发布一个文章，将新文章的内容，插入到数据库表articles中，插入的文章的发布状态默认就设置为"false"，表示未被公开出来，要审批
 */

exports.add = function (req, res, next) {
    if (!req.body.article) return next(new Error('No article payload.'));

    var article = req.body.article;
    article.published = false;

    //这里的article是算是一个JSON数组了{"列1":"值"，"列2"，"值"}这样的格式了，然后下面的insert进去

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
 * GET article POST page.             导航到new_post这个页面中
 */

exports.post = function (req, res, next) {
    //先把这个东西放在一边，等下再拿掉注释，可能是为了不让用户看到一个空的博客的list页面
    //if (!req.body.title)
    res.render('new_post');
};


/*
 * POST article POST page.   插入数据到mongodb之后，回到之前的页面
 */

exports.newpost = function (req, res, next) {

    if (!req.body.title || !req.body.slug || !req.body.content) {

        return res.render('new_post', {error: 'Fill title, slug and text.'});
    }
    var article = {
        title: req.body.title,
        slug: req.body.slug,
        text: req.body.content,
        published: false
    };
    req.collections.articles.insert(article, function (error, articleResponse) {
        if (error) return next(error);
        res.render('new_post', {error: 'Article was added. Publish it on Admin page.'});
    });
};


/*
 * GET admin page.   导航到admin的页面
 */

exports.admin = function (req, res, next) {
    req.collections.articles.find({}, {sort: {_id: -1}}).toArray(function (error, articles) {
        if (error) return next(error);
        res.render('admin', {all_post: articles});
    });

}