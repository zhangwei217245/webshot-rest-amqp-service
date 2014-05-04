/**
 * Created by zhangwei on 14-5-2.
 */

var webshot = require('webshot');
var UPYun = require('upyun-official').UPYun;
var fs = require('fs');
var stream = require('stream');
var config = require('config');

var upyun = new UPYun('ys-rsbook','zhangwei','zhangwei13');



url = "http://www.qq.com/";
filename = url.replace(/(:\/\/|\/|\.|\?|=)/g, '_') + ".png";
localfile = '/tmp/' + filename;
cloudfile = '/test/' + filename;
webshot(url, localfile, config.webshot.proto, function(err) {
    // screenshot now saved to google.png
    fs.readFile(localfile, null, function(err, data){
        if (err) {console.log(err); return;}
        upyun.writeFile(cloudfile, data, true, function(err, resBody){
            console.log(err);
            console.log(resBody);
        });
    });

});



