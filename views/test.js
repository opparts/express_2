//测试输出Jade模板的内容

var jade = require('jade');
var fs   = require('fs');


jade.renderFile('layout.jade',function (error,html){
    console.log(html);
})
