//测试输出Jade模板的内容

var jade = require('jade');
var fs   = require('fs');

var data = {
    posts: "",
    title:""
};

jade.renderFile('index.jade',data, function (error,html){

    if (error)
        console.log(error);
    else
        console.log(html);
})
