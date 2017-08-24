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

module.exports.botActions = {
    createTeam : createTeam,
    deleteTeam : deleteTeam,
    inviteMember : inviteMember,
    removeMember : removeMember,
    scrum : scrum
}