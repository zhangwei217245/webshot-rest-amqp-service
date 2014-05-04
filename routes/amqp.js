/**
 * Created by zhangwei on 14-4-30.
 */
var express = require('express'),
    amqp = require('amqp');


var router = express.Router();

var config;

router.setconfig = function(cfg) {
    config = cfg;
}

/* GET users listing. */
router.get('/start', function(req, res) {
    res.send(JSON.stringify(config)+'  '+req.param('url'));
    res.send('respond with a resource');
});

router.get('/stop', function(req, res){

});

module.exports = router;