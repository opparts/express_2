/**
 * Created by apple on 2017/4/25.
 */

var mongo = require("mongodb")
var host  = 'localhost';
var port  = 27017;

var db = mongo.Db
var connection = mongo.Server
var server = mongo.Server

var db = new db('node', new server(host,port), {safe:true});

//打开这个数据库
db.open(function (error, dbconnection) {
    if (error) {
        console.log(db._state);
        process.exit(1);
    }

    //定义一个新的对象
    var new_record = {
        b:'12345',
        c:'678910',
        d:'新的列'
    }

    //向集合test中插入一条记录
    dbconnection.collection('test').insertOne(new_record,function(error,new_record){
        if(error) {
            console.error(error);
            process.exit(1);

        }
        //console.info('要插入这条记录', new_record);

    });

    //从中取回一条记录
    dbconnection.collection('test').findOne({},function(error, item){
        if (error){
            console.log(error);
            process.exit(1);
        }
        console.log(item);

    });

})




