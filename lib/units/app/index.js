var http = require('http')
var url = require('url')
var fs = require('fs')

var mysql  = require('mysql')
var connection = mysql.createConnection({     
  host     : '172.0.0.23',       //主机
  user     : 'root',               //MySQL认证用户名
  password : '123456',        //MySQL认证用户密码
  port: '3306',                   //端口号
  database: 'stftestresult',
  charset: 'UTF8_GENERAL_CI',
})

var express = require('express')
var validator = require('express-validator')
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')
var serveFavicon = require('serve-favicon')
var serveStatic = require('serve-static')
var csrf = require('csurf')
var Promise = require('bluebird')
var compression = require('compression')

var logger = require('../../util/logger')
var pathutil = require('../../util/pathutil')
var dbapi = require('../../db/api')
var datautil = require('../../util/datautil')

var auth = require('./middleware/auth')
var deviceIconMiddleware = require('./middleware/device-icons')
var browserIconMiddleware = require('./middleware/browser-icons')
var appstoreIconMiddleware = require('./middleware/appstore-icons')

var markdownServe = require('markdown-serve')

module.exports = function(options) {
  var log = logger.createLogger('app')
  var app = express()
  var server = http.createServer(app)

  connection.connect(function(err){
    if(err){        
          console.log('[query] - :'+err);
        return;
    }
      console.log('[connection connect]  succeed!');
  })

  app.use('/static/wiki', markdownServe.middleware({
    rootDirectory: pathutil.root('node_modules/stf-wiki')
  , view: 'docs'
  }))

  app.set('view engine', 'jade')
  app.set('views', pathutil.resource('app/views'))
  app.set('strict routing', true)
  app.set('case sensitive routing', true)
  app.set('trust proxy', true)

  if (fs.existsSync(pathutil.resource('build'))) {
    log.info('Using pre-built resources')
    app.use(compression())
    app.use('/static/app/build/entry',
      serveStatic(pathutil.resource('build/entry')))
    app.use('/static/app/build', serveStatic(pathutil.resource('build'), {
      maxAge: '10d'
    }))
  }
  else {
    log.info('Using webpack')
    // Keep webpack-related requires here, as our prebuilt package won't
    // have them at all.
    var webpackServerConfig = require('./../../../webpack.config').webpackServer
    app.use('/static/app/build',
      require('./middleware/webpack')(webpackServerConfig))
  }

  app.use('/static/bower_components',
    serveStatic(pathutil.resource('bower_components')))
  app.use('/static/app/data', serveStatic(pathutil.resource('data')))
  app.use('/static/app/status', serveStatic(pathutil.resource('common/status')))
  app.use('/static/app/browsers', browserIconMiddleware())
  app.use('/static/app/appstores', appstoreIconMiddleware())
  app.use('/static/app/devices', deviceIconMiddleware())
  app.use('/static/app', serveStatic(pathutil.resource('app')))

  app.use('/static/logo',
    serveStatic(pathutil.resource('common/logo')))
  app.use(serveFavicon(pathutil.resource(
    'common/logo/exports/STF-128.png')))
  
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded());

  app.post('/run', function(req, res) {
    console.log('yuanqiuqian run !!!!'); 
    console.log('yuanqiuqian req.body.serialNum ' + req.body.serialNum + req.body.package);
    var parmSerial = req.body.serialNum
    var pageage = req.body.package
    var devices = dbapi.loadDevices()
    var exec = require('child_process').exec,
    last = exec('ant -f ./lib/units/app/mus-captainamerica/build.xml -Ddevice='+parmSerial+' -Dpackagename='+pageage);
    last.stdout.on('data', function (data) {
        console.log('yuanqiuqian out' + data);
    });
  });
   app.post('/test/singleResult', function(req, res){
    console.log("req.body.starttime----"+req.body.starttime)
    connection.query('SELECT * from device_info where starttime='+req.body.starttime, function(err, rows, fields) {
      if (err) {
              console.log('[query] - :'+err);
          return;
      }
      var tempresultmap= {}
      for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].starttime)
        console.log(rows[i].device)
        console.log(rows[i].pass)
        console.log(rows[i].fail)
        console.log(rows[i].total)
        singleResultMap = {
          starttime: rows[i].starttime,
          device: rows[i].device,
          total: rows[i].total,
          pass: rows[i].pass,
          fail: rows[i].fail
        }
        tempresultmap[i]= singleResultMap

      }
      res.send(tempresultmap)
    })
  });
  app.post('/test/resultList', function(req, res){
    // console.log("req.body.starttime----"+req.body.starttime)
    connection.query('SELECT * from case_info where starttime='+req.body.starttime+' and device=\''+req.body.device+'\'', function(err, rows, fields) {
      if (err) {
              console.log('[query] - :'+err);
          return;
      }
      var tempresultmap= {}
      for (var i = 0; i < rows.length; i++) {
        console.log(rows[i].starttime)
        console.log(rows[i].device)
        console.log(rows[i].name)
        console.log(rows[i].result)
        console.log(rows[i].info)
        console.log(rows[i].picture)
        singleResultMap = {
          starttime: rows[i].starttime,
          device: rows[i].device,
          name: rows[i].name,
          module: rows[i].module,
          result: rows[i].result,
          info: rows[i].info,
          picture: rows[i].picture
        }
        tempresultmap[i]= singleResultMap

      }
      res.send(tempresultmap)
    })
  });
  app.post('/test/sumResultList', function(req, res){
    // console.log("req.body.starttime----"+req.body.starttime)
    connection.query('SELECT module, result from case_info where starttime='+req.body.starttime+' and device=\''+req.body.device+'\'', function(err, rows, fields) {
      if (err) {
              console.log('[query] - :'+err);
          return;
      }
      var tempresultmap= {}
      for (var i = 0; i < rows.length; i++) {
        singleResultMap = {
          module: rows[i].module,
          result: rows[i].result
        }
        tempresultmap[i]= singleResultMap

      }
      res.send(tempresultmap)
    })
  });
  app.post('/runAll', function(req, res) {
    console.log('yuanqiuqian run all!!!!'); 
    var exec = require('child_process').exec,
    last = exec('ant -f ./lib/units/app/mus-captainamerica/build.xml');
    last.stdout.on('data', function (data) {
        console.log('yuanqiuqian out' + data);
    });
  });
  app.post('/runAllSTF', function(req, res) {
    var currentTime = req.body.currentTime;
    console.log('yuanqiuqian run all STF!!!!'+currentTime); 
    var exec = require('child_process').exec,
    last = exec('ant -f ./lib/units/app/mus-captainamerica/build.xml -DcurrentTime='+currentTime+'');
    last.stdout.on('data', function (data) {
        console.log('yuanqiuqian out' + data);
    });
  });
  app.post('/result', function(req, res) {
    console.log('yuanqiuqian result !!!!'); 
    console.log('yuanqiuqian req.body.serialNum ' + req.body.serialNum);
  });


  app.use(cookieSession({
    name: options.ssid
  , keys: [options.secret]
  }))

  app.use(auth({
    secret: options.secret
  , authUrl: options.authUrl
  }))

  // This needs to be before the csrf() middleware or we'll get nasty
  // errors in the logs. The dummy endpoint is a hack used to enable
  // autocomplete on some text fields.
  app.all('/app/api/v1/dummy', function(req, res) {
    res.send('OK')
  })

  app.use(bodyParser.json())
  app.use(csrf())
  app.use(validator())

  app.use(function(req, res, next) {
    res.cookie('XSRF-TOKEN', req.csrfToken())
    next()
  })

  app.get('/test/result', function(req, res) {
      connection.query('SELECT * from result_info', function(err, rows, fields) {
      if (err) {
              console.log('[query] - :'+err);
          return;
      }
      var tempresultmap= {}
      for (var i = 0; i < rows.length; i++) {
        var singleResultMap
        console.log(rows[i].starttime);
        console.log(rows[i].pass);
        console.log(rows[i].fail);
        console.log(rows[i].total);
        console.log(rows[i].user);
        console.log(rows[i].buildverison);
        singleResultMap = {
          starttime: rows[i].starttime,
          total: rows[i].total,
          pass: rows[i].pass,
          fail: rows[i].fail,
          user: rows[i].user,
          buildverison: rows[i].buildverison
        }
        tempresultmap[i]= singleResultMap
      }
      res.send(tempresultmap)

    })
  })
  app.get('/device/ios', function(req, res) {
    var exec = require('child_process').exec,
    last = exec('instruments -w devicelist');
    last.stdout.on('data', function (data) {
      var returnList = [];
        console.log('yuanqiuqian out' + data);
        var iosD = data;
        var arrBefore = iosD.toString().split("\n");
        for(var i in arrBefore){
          if(arrBefore[i].indexOf('-')==-1&&arrBefore[i].indexOf('[')!=-1){
            // console.log("arrBefore "+arrBefore[i]);
            var arrAfter = arrBefore[i].toString().split("[");
            var name = arrAfter[0];
            var ida = arrAfter[1].toString().split("]");
            var id = ida[0];
            // console.log("name id ---"+name+' '+id);
            returnList.push(name+'-'+id);
            // if(arrAfter[0].indexOf('-')==-1){
            //   console.log("arrAfter[0]---"+arrAfter[0]);
            //   returnList.push(arrAfter[0]);
            // }
          }
        }
        console.log("returnList"+returnList)
        res.send(returnList);
    });
    

  })

  app.get('/', function(req, res) {
    res.render('index')
  })

  app.get('/app/api/v1/state.js', function(req, res) {
    var state = {
      config: {
        websocketUrl: (function() {
          var wsUrl = url.parse(options.websocketUrl, true)
          wsUrl.query.uip = req.ip
          return url.format(wsUrl)
        })()
      }
    , user: req.user
    }

    if (options.userProfileUrl) {
      state.config.userProfileUrl = (function() {
        return options.userProfileUrl
      })()
    }

    res.type('application/javascript')
    res.send('var GLOBAL_APPSTATE = ' + JSON.stringify(state))
  })

  app.get('/app/api/v1/user', function(req, res) {
    res.json({
      success: true
    , user: req.user
    })
  })

  app.get('/app/api/v1/group', function(req, res) {
    dbapi.loadGroup(req.user.email)
      .then(function(cursor) {
        return Promise.promisify(cursor.toArray, cursor)()
          .then(function(list) {
            list.forEach(function(device) {
              datautil.normalize(device, req.user)
            })
            res.json({
              success: true
            , devices: list
            })
          })
      })
      .catch(function(err) {
        log.error('Failed to load group: ', err.stack)
        res.json(500, {
          success: false
        })
      })
  })

  app.get('/app/api/v1/devices', function(req, res) {
    dbapi.loadDevices()
      .then(function(cursor) {
        return Promise.promisify(cursor.toArray, cursor)()
          .then(function(list) {
            list.forEach(function(device) {
              datautil.normalize(device, req.user)
            })

            res.json({
              success: true
            , devices: list
            })
          })
      })
      .catch(function(err) {
        log.error('Failed to load device list: ', err.stack)
        res.json(500, {
          success: false
        })
      })
  })

  app.get('/app/api/v1/devices/:serial', function(req, res) {
    dbapi.loadDevice(req.params.serial)
      .then(function(device) {
        if (device) {
          datautil.normalize(device, req.user)
          res.json({
            success: true
          , device: device
          })
        }
        else {
          res.json(404, {
            success: false
          })
        }
      })
      .catch(function(err) {
        log.error('Failed to load device "%s": ', req.params.serial, err.stack)
        res.json(500, {
          success: false
        })
      })
  })

  app.get('/app/api/v1/accessTokens', function(req, res) {
    dbapi.loadAccessTokens(req.user.email)
      .then(function(cursor) {
        return Promise.promisify(cursor.toArray, cursor)()
          .then(function(list) {
            var titles = []
            list.forEach(function(token) {
              titles.push(token.title)
            })
            res.json({
              success: true
            , titles: titles
            })
          })
      })
      .catch(function(err) {
        log.error('Failed to load tokens: ', err.stack)
        res.json(500, {
          success: false
        })
      })
  })

  server.listen(options.port)
  log.info('Listening on port %d', options.port)

  var qs = require('querystring');  
  var IPv4,hostName;
  var devices = dbapi.loadDevices()
  var os = require('os');
  hostName=os.hostname();
  for(var i=0;i<os.networkInterfaces().en0.length;i++){
      if(os.networkInterfaces().en0[i].family=='IPv4'){
          IPv4=os.networkInterfaces().en0[i].address;
      }
  }
  var deviceNum = 0
  console.log('----------local IP: '+IPv4);
  console.log('----------local host: '+hostName);
  console.log('----------local device: '+deviceNum);
  var post_data = {  
      pcip: IPv4,
      pcname: "god",
      pchostname: hostName,
      pcdevices: "x"
  }

    
  var content = qs.stringify(post_data);  
    
  var options2 = {  
      hostname: '172.0.0.23',  
      port: 7017,  
      path: '/stf',  
      method: 'POST',  
      headers: {  
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'  
      }  
  };  
    
  var req = http.request(options2, function (res) {  
      console.log('STATUS: ' + res.statusCode);  
      console.log('HEADERS: ' + JSON.stringify(res.headers));  
      res.setEncoding('utf8');  
      res.on('data', function (chunk) {  
          console.log('BODY: ' + chunk);  
      });  
  });  
    
  req.on('error', function (e) {  
      console.log('problem with request: ' + e.message);  
  });  
    
  // write data to request body  
  console.log(content);
  req.write(content);  
    
  req.end(); 
}
