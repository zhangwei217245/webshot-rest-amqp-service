/**
 * Created by zhangwei on 14-5-4.
 */

var config = require('config')
    , amqp = require('amqp')
    , webshot = require('webshot')
    , consumer = require('./src/consumer')