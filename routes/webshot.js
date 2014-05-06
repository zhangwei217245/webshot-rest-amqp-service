/**
 * Created by zhangwei on 14-4-30.
 */
var express = require('express')
    , fs = require('fs')
    , WebshotProxy = require('../lib/webshot_proxy').WebshotProxy
    , UPYun = require('upyun-official').UPYun;

var router = express.Router();

var config = {
    upyun: {
        bucketname: 'ys-rsbook',
        username: 'zhangwei',
        password: 'zhangwei13',
        resroot: '/test/',
        domain: 'http://test.img.seriousapps.cn'
    },
    webshot: {
        localTmp: '/tmp/webshot/',
        proto: {
            windowSize: {
                width: 1024,
                height: 768
            },
            shotSize: {
                width: 'all',
                height: 'all'
            },
            shotOffset: {left: 0,
                right: 0,
                top: 0,
                bottom: 0},
            defaultWhiteBackground: false,
            quality: 75,
            streamType: 'png',
            siteType: 'url',
            renderDelay: 0,
            timeout: 0
        }
    }
};


var wbShot = null;

router.setconfig = function(cfg) {
    if (cfg) {
        config = cfg;
        wbShot = new WebshotProxy(cfg);
    } else {
        wbShot = new WebshotProxy(config);
    }
}


/* GET take a shot for the web page and send stream as response. */
router.get('/takeshot', function(req, res) {

    url = req.param('url');

    wbShot.shot2Stream(url, function(inputStream){
        inputStream.pipe(res);
    });


});

router.get('/shot2cloud', function(req, res) {

    url = req.param('url');
    vendor = req.param('vendor');
    force = req.param('force');

//    wbShot.checkAndLoadFromCloud(url,vendor);

    try{
        wbShot.shot2Cloud(url, vendor, force, function(metadata, data){
            console.log('do sth...')
        });
    }catch(err){
        res.type('text/plain').send(400, err.message);

        throw err;
    }



    wbShot.once('cloudResponse', function(metadata){
        res.type(metadata.type).send(metadata.httpCode, metadata.httpMsg);
    });
    wbShot.once('cloudError', function(metadata){
        res.type(metadata.type).send(metadata.httpCode, metadata.httpMsg);
    });

});

router.get('/shot2SNS', function(req, res){
    url = req.param('url');
    usr = req.param('usr');

    user = {};
    if (usr) {
        user = JSON.parse(usr);
    } else {
        microblog = req.param('microblog');
        acc_token = req.param('acc_token');
        user.access_token=acc_token;
        user.blogtype = microblog;
    }

    status = req.param('status');
    if (!status) {
        status = url;
    }
    force = req.param('force');
    if (!force) {
        force=true;
    }

    wbShot.shot2SNS(url,user,status,force, function(err, rst){
        if (err) {
            res.send(400, JSON.stringify(err));
            throw err;
        }
        res.send(200, rst);
    });
});





// exports an router object
module.exports = router;