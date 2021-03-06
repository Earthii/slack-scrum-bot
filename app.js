var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var app = express();
var SlackBot = require('slackbots');
var mongoose = require('mongoose');
var botActions = require('./botActions');
var https = require("https");

mongoose.connect('mongodb://Earthii:Eric1234@ds115124.mlab.com:15124/scrum-bot', {
    useMongoClient: true
})
mongoose.Promise = global.Promise;
var db = mongoose.connection;

db.on('error', console.error.bind(console,'connection error:'));

db.once('open', function(){

    var bot = new SlackBot({
        token:'xoxb-242905906950-m8m5DgSZRsGbzcNM8qr4qGrO',
        name: 'scrumbot'
    });
    bot.on('start', function() {
        console.log(`\n*****************************\n|       Bot initilized      |\n*****************************`);

        // more information about additional params https://api.slack.com/methods/chat.postMessage
        var params = {
            icon_emoji: ':cat:'
        };

        isNewDay(bot);

        bot.on('message', function(data) {
            if(data.type == 'desktop_notification' && isBotMentioned(data)){
                let contentArr = data.content.split(" ");
                let channel = data.channel;
                if(contentArr.includes("Eric:")){
                    let action = contentArr[2];
                    let params = contentArr.slice(3);
                    try{
                        actionHandler(action, params, channel);
                    }catch(err){
                        bot.postMessage(channel, err);
                    }
                }else{
                    bot.postMessage(channel, "You're not Eric :)");
                }
            }
        });
    });

    function actionHandler(action, params, channel){
        if(action == undefined || !botActions.has(action)){
            bot.postMessage(channel, 'I Dont understand that action');
        }else{
            try{
                botActions.get(action)(bot, params, channel);
            }catch(err){
                bot.postMessage(channel, err);
            }
        }


    }

    function isBotMentioned(data){

        if(data.content != undefined){
            return data.content.split(" ").includes('@'+bot.name);
        }else{
            return false
        }

    }

    function isNewDay(bot){
        var now = new Date;
        var midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        setTimeout(function() {
            console.log("it is midnight!");
            bot.postMessage("C7EKNM067",  `*--------------- ${now.toDateString()} ---------------*`);
        }, midnight.getTime() - now.getTime());
    }
});
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
