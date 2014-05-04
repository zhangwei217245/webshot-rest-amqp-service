/**
 * Created by zhangwei on 14-4-30.
 *
 * @author zhangwei
 */
var uuid = require('node-uuid')
    , webshot = require('webshot')
    , events = require('events')
    , util = require('util')
    , path = require('path')
    , fs = require('fs')
    , EventEmitter = events.EventEmitter
    , UPYun = require('upyun-official').UPYun;

// cfg may be structured as follows:
// {proxy:{}, proto:{},attribute1:..., attribute2:...}

//exports a class that accept a callback function
function WebshotProxy (cfg, fileNameResolver) {
    EventEmitter.call(this);

    this.config = {localTmp:'/tmp/webshot/', proto: { shotSize: {width:'all', height:'all'}}};
    this._filenameResolverFunc=this._defaultFilenameResolver;
    if (cfg) {
        this.globalCfg = cfg;
        this.config = this.globalCfg.webshot;
        this.upyuncfg = this.globalCfg.upyun;
        if (this.upyuncfg) {
            console.log('init:'+this.upyuncfg)
            this.upyun = new UPYun(this.upyuncfg.bucketname,this.upyuncfg.username,this.upyuncfg.password);
        }
    }
    if (fileNameResolver) {
        this._filenameResolverFunc = fileNameResolver;
    }
}

util.inherits(WebshotProxy, EventEmitter);
WebshotProxy.WebshotProxy = WebshotProxy;

WebshotProxy.prototype._defaultFilePath = function(filename, url) {
    var dir = '/tmp/webshot';
    var suffix = '.png';
    if (this.config.localTmp) {
        dir = this.config.localTmp;
        // create an dir if not exists.
        fs.exists(dir, function(isExists){
            if (!isExists) {
                fs.mkdir(dir, null, function(){
                    console.log('dir "' + dir + '" created!');
                })
            }
        });
    }
    if (this.config.proto.streamType) {
        suffix = '.' + this.config.proto.streamType;
    }
    fn = filename;
    if (!filename) {
        fn = this._filenameResolverFunc(url);
    }
    return path.join(dir, fn + suffix);
}

WebshotProxy.prototype._defaultFilenameResolver = function (url) {
    return url.replace(/(:\/\/|\/|\.|\?|=)/g, '_');
}

WebshotProxy.prototype.shot2File = function(url, filename, cb) {
    var self = this;
    var filepath = self._defaultFilePath(filename, url);

    webshot(url, filepath, self.config.proto, function(err) {
        if (err) {
            self.emit('fileError', err);
            return;
        }
        console.log('webshot done with ' + filepath);

        filename = filepath.replace(self.config.localTmp,'');
        self.emit('fileDone', filepath, filename, self.config);
        // execute the callback if there is any
        if (cb) {
            // filepath, filename, config
            cb(filepath, filename, self.config);
        }

    });

    return filepath;
}

WebshotProxy.prototype._fileExistsLocally= function(url, filename, cb) {
    var self = this;
    var filepath = self._defaultFilePath(filename, url);
    if (cb) {
        fs.exists(filepath, function(exists){
            cb(exists, filepath);
        });
    } else {
        if(fs.existsSync(filepath)){
            return filepath;
        } else {
            return undefined;
        }
    }

}

WebshotProxy.prototype.shot2Stream = function(url, cb) {
    webshot(url,this.config.proto, function(err, inputStream){
        if (err) {console.log(err);return;}
        if (cb) {
            cb(inputStream);
        }
    });
}

WebshotProxy.prototype.shot2Cloud = function(url, vendor, force, cb) {
    var self = this;
    cloud_cb = undefined;
    cloud_cfg = undefined;
    // verify cloud vendor
    switch(vendor) {
        case 'upyun':
            cloud_cb = this._shot2upYun;
            cloud_cfg = this.upyuncfg;
            break;
        default:
            metadata={httpCode: 400, httpMsg:'vendor not supported!', error: err};
            self.emit('cloudError', metadata);
            return;
    }
    // determine if the specified file exists locally.
    var localpath = this._fileExistsLocally(url, null);
    var filedata;

    console.log('exists: ' + localpath);
    console.log('self.' + self.upyuncfg.resroot);
    // if not exists, shot2File and then upload to cloud
    if (!localpath || force){
        // if file not exists, shot2File and then upload and share to another sns website
        //TODO: fuck, the async callback...
        this.shot2File(url, null, function(locPath, fName, cfg){
            console.log('shot done!', locPath, fName, JSON.stringify(cfg));
//            console.log('####',this.upyun.toString());
//            filedata = cloud_cb.call(this, fName, locPath, cloud_cfg);
        });

    } else {
        filedata = cloud_cb.call(this, localpath.replace(self.config.localTmp,''), localpath, cloud_cfg);
    }

    this.once('fileDone', function(locPath, fName, cfg){
        console.log('file done triggered');
        console.log('####',this.upyun.toString());
        filedata = cloud_cb.call(this, fName, locPath, cloud_cfg);
    });

    this.once('cloudDone', function(metadata){
        console.log('cloudDone triggered');
        // if there is any callback function passed, try to execute it.
        if (cb) {
            cb(metadata);
        }
        this.emit('cloudResponse', metadata);
    });
    this.once('cloudError', function(metadata){
        metadata.type='plain/text';
        this.emit('cloudResponse', metadata);
    });
};



WebshotProxy.prototype._shot2upYun = function(filename, localpath, upyuncfg) {
    var self = this;

    var picurl = '';
    console.log('_shot2upyun'+JSON.stringify(upyuncfg))
    var cloudFilePath = upyuncfg.resroot + filename;

    filedata = fs.readFileSync(localpath, null);

    if (filedata) {
        console.log('####',this.upyun.toString());
        console.log('start to upload to upyun');
        picurl = 'http://' + upyuncfg.bucketname + '.b0.upaiyun.com' + cloudFilePath;
        this.upyun.writeFile(cloudFilePath, filedata, true, function(err, resBody){
            console.log('upload finished');
            if (!err) {
                console.log('pic has upload to ' + picurl);
                metadata = {httpCode: 200, type: 'image/' + self.config.proto.streamType, cloudAddr: ''+cloudFilePath,
                    localAddr:''+localpath, fName: filename, httpMsg: filedata};
                self.emit('cloudDone', metadata);
            } else {
                console.log(err);
                metadata={httpCode: 400, httpMsg:'error occured!', error: err};
                self.emit('cloudError', metadata);
            }
        });
        return filedata;
    }
}

module.exports = WebshotProxy;
