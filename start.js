//Check how to create worker
//https://github.com/ceejbot/fivebeans

var Beanworker = require('fivebeans').worker;
var options =
{
    id: "worker",
    host: "challenge.aftership.net",
    port: 11300,
    handlers:
    {
        exchangerate: require('./exchangerate')()
    },
    ignoreDefault: true
}
var worker = new Beanworker(options);
//start the worker
worker.start(['exchange']);