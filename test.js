/**
 * Created by zhangwei on 14-5-2.
 */

var webshot = require('webshot');
var UPYun = require('upyun-official').UPYun;
var fs = require('fs');
var stream = require('stream');
var config = require('config');
var weibo = require('weibo');


var upyun = new UPYun('ys-rsbook','zhangwei','zhangwei13');

var weibo_user= {
    appkey : '1852823608',
    secret : 'f7623417c5fbe029dd366e4e01e34e48',
    user: {"access_token":"2.00lW_NoBkDQ5BC58fb5391d3ULX5_B","remind_in":"157679999","expires_in":157679999,"uid":"1658122963", blogtype:'weibo'}
}
var tqq_user = {
    appkey : '801503676',
    secret : '4fe89516aa3ad2d545866c129aada22e',
    user: {access_token:'5df44587df2ebb2cdf1769e98aba3787',blogtype:'tqq',expires_in:'8035200',refresh_token:'032c213d67cbbe51d5f0cf75794a5b46',openid:'40e560a138fbc4084c6cd6f5be2a41e4', name:'X-Spirit', nick:'张威'}
}


console.log(JSON.stringify(config));
url = "http://mail.163.com/";
filename = url.replace(/(:\/\/|\/|\.|\?|=)/g, '_') + ".png";
localfile = '/tmp/' + filename;
cloudfile = '/test/' + filename;

weibo.init('weibo', weibo_user.appkey, weibo_user.secret, 'http://asdfsdf.com/ss');
weibo.init('tqq', tqq_user.appkey, tqq_user.secret, 'http://www.credentialsapp.com/example');

var user = {blogtype: 'weibo', access_token:weibo_user.user.access_token}
var cursor = {count:20};

//weibo.upload(weibo_user.user, 'test from node','/tmp/http_www_baidu_com_.png', function(err, statuses){
//   console.log(err, statuses);
//});

webshot(url, localfile, config.webshot.proto, function(err) {
    // screenshot now saved to google.png
    fs.readFile(localfile, null, function(err, filedata){
//        weibo.upload(weibo_user.user, status,{data:filedata, name:'baidu.png',content_type:'image/png'}, function(err, statuses){
//            console.log(err, statuses);
//        });
//        weibo.upload(tqq_user.user, status, {data:filedata, name:'baidu.png',content_type:'image/png'}, function(err, statuses){
//            console.log(err, statuses);
//        });
        status = 'upload from node2' + new Date();
//        if (err) {console.log(err); return;}
//        upyun.writeFile(cloudfile, data, true, function(err, resBody){
//            console.log(err);
//            console.log(resBody);
//        });

    });

//    upyun.getFileInfo(cloudfile,function(err, resbody){
//        console.log(err, resbody);
//        upyun.readFile('/test/http_www_qq_com_.png','/Users/zhangwei/Downloads/bb.png', function(err, data){
//            fs.writeFileSync('/Users/zhangwei/Downloads/aa.png',data);
//        })
//    })

});



