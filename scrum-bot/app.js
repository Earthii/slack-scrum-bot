var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();

var SlackBot = require('slackbots');
var bot = new SlackBot({
    token:'xoxb-231326420275-o4u6zLaNlFiTa1e1EWsgiK2L',
    name: 'ScrumBot'
});
var botActions = require('./botActions');

const actions = [
    'createTeam',
    'deleteTeam',
    'inviteMember',
    'deleteMember',
    'scrum'
]

bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    console.log(`\n*****************************\n|       Bot initilized      |\n*****************************`);
    var params = {
        icon_emoji: ':cat:'
    };
    bot.on('message', function(data) {
        if(data.type == 'desktop_notification'){
            let content  = data.content.split(" ");
            let action = content.filter(text =>{
                if(actions.includes(text)){
                    return text
                }
            })
            actionHandler(action, content);
        }
    });
});

function actionHandler(action, params){
    if(action == undefined || action.length == 0){
        bot.postMessageToChannel('general', 'I Dont understand that action!', params);
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
