function createTeam(){
    console.log("create")
}

function deleteTeam(){
    console.log("delete")
}
function inviteMember(){
    console.log("add member")
}

function removeMember(){
    console.log("delete member")
}
function scrum(){
    console.log("scrum")
}

let actions = new Map();
actions.set("new-team",createTeam);
actions.set("delete-team", deleteTeam);
actions.set("invite-member", inviteMember);
actions.set("remove-member", removeMember);
actions.set("scrum",scrum);

module.exports = actions;