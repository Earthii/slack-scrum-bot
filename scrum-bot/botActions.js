var CONFIG = require('./settings');
var calendarAPI = require('node-google-calendar');
var teamModel = require('./models/team');

var cal = new calendarAPI(CONFIG);

function createTeam(bot, params, channel) {
    console.log("create params", params);
    if(params.length == 0){
        throw "Seems like you\'re missing some parameters!"
    }
    var team = new teamModel({
        name: params[0],
        members: []
    })

    team.save(function (err, team) {
        if (err) {
            throw err;
        }
        bot.postMessage(channel, 'Team has been successfully created!');

    })
}

function deleteTeam(bot, params, channel) {
    console.log("delete params", params);
    if(params.length == 0){
        throw "Seems like you\'re missing some parameters!"
    }
    teamModel.findOne({name: params[0]}).remove((err, res) => {
        if (err) {
            throw err;
        }
        if (res.result.n == 0) {
            bot.postMessage(channel, 'Team did not exist... nothing necessary was needed on my end');
        }
        else {
            bot.postMessage(channel, 'Team has been successfully deleted!');
        }

    })

}
function addMember(bot, params, channel) {
    console.log("add member params", params);
    if(params.length == 0){
        throw "Seems like you\'re missing some parameters!"
    }
    let teamName = params[0];
    let membersToAdd = params.slice(1);

    teamModel.findOne({name: teamName}).then((team) => {
        if (team == null) {
            bot.postMessage(channel, 'Team did not exist... cannot add a member to a non existing team');
            throw ""
        }
        let currentMembers = team.members;
        let tmpMemberArr = [...currentMembers];
        // let allNewMembers = [];
        bot.getUsers().then(allUsers => {
            var membersArr = membersToAdd.map(name => {
                var user = allUsers.members.filter(member => member.real_name.includes(name))[0];
                if(user != null && user != undefined){
                    return {
                        username: user.name,
                        real_name: user.real_name,
                        email: user.profile.email
                    }
                }

            });
            membersArr.forEach((member) => {
                let filter = currentMembers.filter((currentMember) => currentMember.username == member.username);

                if (!filter.length) {
                    tmpMemberArr.push(member);
                }
            });

            teamModel.findByIdAndUpdate(team._id, {members: tmpMemberArr}).then(() => {
                bot.postMessage(channel, 'These names have been added to ' + teamName + ':' + membersArr.map((member) => ` @${member.username} : ${member.real_name}`));
            })
        })
    })
}

function removeMember(bot, params, channel) {
    console.log("delete member params", params);
    if(params.length == 0){
        throw "Seems like you\'re missing some parameters!"
    }
    let teamName = params[0];
    let membersToRemove = params.slice(1);
    let removeMembersPromises = [];

    teamModel.findOne({name: teamName}).then(team => {
        if (team == null) {
            throw "Team did not exist... cannot remove a member to a non existing team"
        }
        membersToRemove.forEach(member => {
            removeMembersPromises.push(teamModel.findByIdAndUpdate(team._id, {$pull: {members: {username: member}}}, {multi: true}).then(() => {
            }))
        })

        Promise.all(removeMembersPromises)
            .then(() => {
                bot.postMessage(channel, `I have finished removing the following members from ${teamName} : ${membersToRemove}`);
            })
    })

}

function listAllTeams(bot, params, channel) {
    console.log("list all team params,", params);
    let allTeams = [];
    teamModel.find({}, (err, data)=>{
        if(err){
            throw err;
        }
        if(data.length > 0){
            allTeams = data.map(team => team.name);
            bot.postMessage(channel, `Here is the list of all existing team:${allTeams.map(team => ' ' +team)}`);
        }else{
            bot.postMessage(channel, `There are currently no teams in the database!`);

        }
    })
}

function scrum(bot, params, channel) {
    console.log("scrum params", params);

    if(params.length != 2){
        throw "Seems like the parameters for this actions are wrong. Please use this action by doing 'scrum #team #yyyy-mm-ddThh:mm:ss'"
    }

    var startDate = new Date(params[1]+'-0400');
    var endDate = new Date(startDate.getTime() + 30*60000);
    console.log(startDate, endDate);
    let event = {
        'start': {
            'dateTime': startDate,
            'timeZone': "America/Montreal",
        },
        'end': {
            'dateTime': endDate,
            'timeZone': "America/Montreal",
        },
        'summary': 'scrum',
        'status': 'confirmed',
        'colorId': 1,
        'sendNotifications' : true,
        'attendees': [
            {
                'email' : 'eternaldag@hotmail.com'
            }
        ]
    };

    cal.Events.insert(calendarId = 'primary', event)
        .then(resp => {
            bot.postMessage(channel, `Calendar event created: ${resp.summary}`);

        })
        .catch(err => {
            bot.postMessage(channel, "Error: insertEvent- "+ err.message);
        });
}

let actions = new Map();
actions.set("new-team", createTeam);
actions.set("delete-team", deleteTeam);
actions.set("add-member", addMember);
actions.set("remove-member", removeMember);
actions.set("list-all-teams", listAllTeams);
actions.set("scrum", scrum);

module.exports = actions;