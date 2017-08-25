var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var member = new Schema({
    username: String,
    real_name: String,
    email: String
});

var teamSchema = new Schema({
    time: Date,
    name: String,
    members: [member]
    },
    {
        timestamps: true
    });

var Team = mongoose.model('team', teamSchema);

module.exports = Team;