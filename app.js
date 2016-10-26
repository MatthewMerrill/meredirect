var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var fs = require('fs');

var api   = require('./routes/api');
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/admin', express.static(path.join(__dirname, 'frontend/app')));

app.get('/', function (req, res) {
  res.redirect(process.env.ROOT_REDIRECT || "http://www.mattmerr.com");
  return;
});

app.use('/api',   api);
app.use('/admin', admin);

app.get('/:link', function(req, res, next){
  try {
    fs.exists('links/'+req.params.link, function(exists){
      if (exists)
        res.redirect(fs.readFileSync('links/' + req.params.link));
      else if (req.params.link == '404')
        res.sendFile("public/404.html", { 'root':'./'});
      else
        res.redirect("./404");
    })
  } catch (err) {
    // Oh well lol
  }
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  /*var err = new Error('Not Found');
  err.status = 404;
  next(err);*/

  if (req.url.indexOf(".") > -1)
    return next();

  res.redirect("/404");
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
