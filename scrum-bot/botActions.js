var mongoose = require('mongoose');

mongoose.connect('mongodb://Earthii:Eric1234x@ds159033.mlab.com:59033/scrum-bot', {
    useMongoClient: true
})

var teamModel = require('./models/team');

function createTeam(bot, params, channel){

    var team = new teamModel({
        name:params[0],
        members:[]
    })

    team.save(function(err, team){
        if(err){
            throw err;
        }
        bot.postMessage(channel, 'Team has been successfully created!');

    })
}

function deleteTeam(bot, params, channel){
    console.log("delete params", params)
    teamModel.find({name:params[0]}).remove((err, res)=>{
        if(err){
            throw err;
        }
        bot.postMessage(channel, 'Team has been successfully deleted!');

    })

}
function addMember(bot, params, channel){
    console.log("add member params", params)
    let teamName = params[0];
    let membersToAdd = params.slice(1);
    teamModel.findOne({name:teamName}).then((team)=>{
        let currentMembers = team.members;
        let tmpMemberArr = [ ...currentMembers ];
        let allNewMembers = [];
        membersToAdd.forEach(name => {
            if(name != undefined && name != "" && name != null){
                allNewMembers.push(bot.getUser(name));
            }
        });
        Promise.all(allNewMembers)
            .then(members => {
                let newMembers = members.map((member)=> {
                    return {
                        username: member.name,
                        real_name: member.real_name,
                        email: member.profile.email
                    }
                });

                newMembers.forEach((member) => {
                    let filter = currentMembers.filter((currentMember) => {
                        return currentMember.username === member.username
                    });

                    if (!filter.length) {
                        tmpMemberArr.push(member);
                    }
                });

                teamModel.findByIdAndUpdate(team._id, {members: tmpMemberArr}).then(()=>{
                    bot.postMessage(channel, 'These names have been added to '+teamName+':'+newMembers.map((member)=>` @${member.username} : ${member.real_name}`));
                })
            }, (err)=>{
                bot.postMessage(channel, "seems like not all of the mentioned username can be found in this slack team...");
            })
    })
}

function removeMember(bot,params){
    console.log("delete member")
}
function scrum(bot, params){
    console.log("scrum")
}

let actions = new Map();
actions.set("new-team",createTeam);
actions.set("delete-team", deleteTeam);
actions.set("add-member", addMember);
actions.set("remove-member", removeMember);
actions.set("scrum",scrum);

module.exports = actions;