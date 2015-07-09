var dashboard = require('./dashboard');
var log = require('./log').logger('debug');
var config = require('./config');
var path = require('path');

var watch_semaphore = 0;
var NCP_TIMEOUT = 4000;

var appReloader = function(event, pth, details) {
  // Don't watch for changes if there is an update in progress
  if(watch_semaphore) { return; }
 
  var pth = details.watchedPath || details.path;
  // Determine which app changed, and re-copy that app
  app_index = dashboard.getAppIndex();
  for(var app_id in app_index) {
    app_info = app_index[app_id];
    a = path.relative(app_info.app_archive_path, pth);
    b = path.relative(pth, app_info.app_archive_path);
    if(true) {
      log.info(app_id + ' was changed. Reloading...');
      watch_semaphore+=1;
      var timeout = setTimeout(function() {
        log.warn('Timeout waiting for reload of ' + app_id);
        watch_semaphore-=1;
      }, NCP_TIMEOUT);
      return dashboard.reloadApp(app_id, function(err, result) {
        clearTimeout(timeout);
        log.info(app_id + ' updated.');
        watch_semaphore-=1;  
      });        
    }
  } 
}; 

function startDebug() {
  log.info("Starting debug watcher...");
  var chokidar = require('chokidar');
  var watcher = chokidar.watch('./dashboard/apps', {
    ignored: /[\/\\]\./,
    persistent: true
  });
  watcher.on('raw', appReloader);

  var watcher = chokidar.watch(config.getDataDir('apps'), {
    ignored: /[\/\\]\./,
    persistent: true
  });
  watcher.on('raw', appReloader);

}

exports.start = startDebug;