//测试输出Jade模板的内容

var jade = require('jade');
var fs   = require('fs');

var data = {
    all_post:[
        {title:'nodejs编程实战',slug:'nodejs-tutoal1'},
        {title:'nodejs编程高手',slug:'nodejs-tutoal1'},
        {title:'nodejs精通7天教材',slug:'nodejs-tutoal1'},
    ]
};

jade.renderFile('index.jade',data, function (error,html){

    if (error)
        console.log(error);
    else
        console.log(html);
})
