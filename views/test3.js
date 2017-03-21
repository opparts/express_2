//测试输出Jade模板的内容

var jade = require('jade');
var fs   = require('fs');

var data = {
    post_list:[
        {_id:"1",title:'nodejs编程实战',slug:'nodejs-tutoal1',published:true},
        {_id:"2",title:'nodejs编程高手',slug:'nodejs-tutoal2',published:true},
        {_id:"3",title:'nodejs精通7天教材',slug:'nodejs-tutoal3',published:false},
    ]
};

jade.renderFile('admin.jade',data, function (error,html){

    if (error)
        console.log(error);
    else
        console.log(html);
})
