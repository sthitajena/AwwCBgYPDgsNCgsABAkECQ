//Check https://github.com/ceejbot/fivebeans for fivebeans
//A straightforward and (nearly) complete beanstalkd client for node.js, 
//along with a more opinionated beanstalkd jobs worker & runner.
var fivebeans = require('fivebeans');

//http://kr.github.io/beanstalkd/ 
//beanstalk run on port 11300
var client = new fivebeans.client("challenge.aftership.net", "11300");


client
    .on('connect', function()
    {
        console.log('connected');
		//Got connected to beanstack
		
		//Producing Jobs
		var job = {type : 'exchangerate',payload : {from : 'USD',to : 'HKD'}};
		//We have to put this job to tube - exchange
		client.use("exchange", function(err, tubename) {
			
			/*client.put(priority, delay, ttr, payload, function(err, jobid) {});

			Submit a job with the specified priority (smaller integers are higher priority), 
			delay in seconds, and allowed time-to-run in seconds. The payload contains the job
			data the server will return to clients reserving jobs; it can be either a Buffer 
			object or a string. No processing is done on the data. Responds with the id of the newly-created job.*/
			client.put(0, 0, 10, JSON.stringify(job), function(err, jobid) {
				if(err){
					console.log("Not Added");
				}else{
					console.log(jobid);
				}
			});
			
			
			
			//client.destroy(3, function(err) {});
			
			//Check Job stats
			//client.stats_job(84, function(err, response) {
			//	console.log(response);
			//});
			//Check tube stats
			//client.stats_tube("exchange", function(err, response) {
			//	console.log(response);
			//});
			
			
		});
		
    })
    .on('error', function(err)
    {
        console.log('connection failure'+err);
    })
    .on('close', function()
    {
        console.log('connection has closed');
    })
    .connect();
