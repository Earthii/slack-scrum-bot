var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();

var SlackBot = require('slackbots');
var bot = new SlackBot({
    token:'xoxb-231007826193-NWQpbOYithTEECwAOUBlY8Lr',
    name: 'ScrumBot'
});
var botActions = require('./botActions');

const botName ='scrumbot';

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    console.log(`\n*****************************\n|       Bot initilized      |\n*****************************`);
    var params = {
        icon_emoji: ':cat:'
    };
    bot.on('message', function(data) {
        if(data.type == 'desktop_notification' && isBotMentioned(data)){
            let contentArr = data.content.split(" ");
            let action = contentArr[2];
            let params = contentArr.slice(3);
            actionHandler(action, params);
        }
    });
});

function actionHandler(action, params){
    if(action == undefined || !botActions.has(action)){
        bot.postMessageToChannel('general', 'I Dont understand that action', params);
    }else{
        botActions.get(action)(params);
    }


}

function isBotMentioned(data){

    if(data.content != undefined){
        return data.content.split(" ").includes('@'+botName);
    }else{
        return false
    }

}
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;