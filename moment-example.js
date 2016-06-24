var moment = require('moment');
var now = moment();

/*console.log(now.format());
console.log(now.format('MMM do YYYY, h:mma'));

console.log(now.format('X'));
console.log(now.valueOf());*/

var timestamp = 1466801392300;
var timestampMoment = moment.utc(timestamp).local();
console.log(timestampMoment.format('h:mma'));