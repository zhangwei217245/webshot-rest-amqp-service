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



router.setconfig = function(cfg) {
    config = cfg;
}

var wbShot = new WebshotProxy(config);


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


    wbShot.shot2Cloud(url, vendor, force, function(metadata, data){
        console.log('do sth...')
    });

    wbShot.once('cloudResponse', function(metadata){
        res.type(metadata.type).send(metadata.httpCode, metadata.httpMsg);
    });

});





// exports an router object
module.exports = router;