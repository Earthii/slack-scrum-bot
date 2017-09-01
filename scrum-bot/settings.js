const fs = require('fs');

const SERVICE_ACCT_ID = 'scrumbot@strange-mariner-178618.iam.gserviceaccount.com';
const TIMEZONE = 'UTC+08:00';
const KEYPATH = './json-googleapi-key.json';
const CALENDAR_ID = {
    'primary': '',
};
var json = fs.readFileSync(KEYPATH, 'utf8');
var key = JSON.parse(json).private_key;

module.exports.serviceAcctId = SERVICE_ACCT_ID;
module.exports.timezone = TIMEZONE;
module.exports.calendarId = CALENDAR_ID;
module.exports.key = key;