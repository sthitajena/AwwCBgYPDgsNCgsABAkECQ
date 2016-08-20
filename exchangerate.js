//Check how handler works
//https://github.com/ceejbot/fivebeans

//var mongodb = require("./mongodb");
//var xedata = require("./xedata");

//http://blog.webkid.io/nodejs-scraping-libraries/
//Node.js Scraping Libraries


var Xray = require('x-ray');  
var x = Xray();



//Lets load the mongoose module in our program
var mongoose = require('mongoose');
//mongo DB created from mlab - https://mlab.com/
var url ="mongodb://admin:admin@ds153845.mlab.com:53845/exchange_rate";

mongoose.connect(url, function (err){
	
	if(err){
		console.log("Not Connected");
	}else{
		console.log("Connected");
	}
	
	
});


/**
 * Lets define our Model for job and exchange rate. This model represents a collection in the database.
 * We define the possible schema of job and exchange document and data types of each field.
 * */
 
 //http://mongoosejs.com/docs/api.html -- FOR schema mongo DB 
 
 //Exchange rate schema
 var ExchangerRate_Schema = mongoose.model('ExchangerRate_Schema', {from : String, to : String,	rate_data : String,	created_date : Date});
 
 //Jobs Schema
 var Jobs_Schema = mongoose.model('Jobs_Schema', {from : String, to : String,	success : Number,	error : Number});




module.exports = function()
{
    function ExchangeRate()
    {
        this.type = 'exchangerate';
		console.log('ExchangeRate started');
    }
	
	http://stackoverflow.com/questions/36509397/node-js-jquery-referenceerror-is-not-defined-error-how-do-i-use-jquery

    ExchangeRate.prototype.work = function(beanstalk_data, callback)
    {
       
	   //beanstalk_data = JSON.parse(beanstalk_data);
	   console.log('incoming data: ' + beanstalk_data);
	   var from_data = beanstalk_data.from;
	   var to_data = beanstalk_data.to;

	   this.getxedata(from_data,to_data, callback);
	  
        //console.log('success');
    };
	
	
	ExchangeRate.prototype.getxedata =function(from_data,to_data, callback) {
		
		//console.log(from_data+":--From Data");
		//console.log(to_data+":--To Data");
			var self_ref = this;
			var url = 'http://www.xe.com/currencyconverter/convert/?Amount=1&From='	+ from_data + '&To=' + to_data;
		//console.log(url+":--Url Data");
			x(url, '.uccRes .rightCol')(function(err, result){
				
				if (err) {
					//callback(err);
					
					console.log(err);
					callback('success');
					self_ref.fail_data(from_data,to_data,callback);
					return;
					
				} else {	
					var data = result.replace(to_data, '').trim();
				
					//result need to be round off to 2 decmicals in STRING type
					data = Math.round(parseFloat(data) * 100) / 100;
					//console.log(data);
					//callback(null,data);
					//If it 0 then failed 
					if(data==0){						
						callback('success');
						self_ref.fail_data(from_data,to_data,callback);
						return;						
					}else{					
						self_ref.save_data(from_data,to_data,data,callback);
					}
				}
				
			});	
		
		 };
		 
		 
		 ExchangeRate.prototype.save_data =function(from_data,to_data,rateData ,callback) {
			 
			 var self_ref = this;
			 
			  var rate = new ExchangerRate_Schema({from: from_data, to: to_data,rate_data:rateData,created_date:new Date()});
	 
				 rate.save(function (err, rateObj) {
					if (err) {
						callback(err);
					} else {
						self_ref.sucess(from_data,to_data, callback);
					}
				}); 
		

			};
			
			ExchangeRate.prototype.sucess =function(from_data,to_data,callback) {
				
				//console.log("sucess job entry"+from_data);
				
				var query = {from : from_data,to : to_data};
				//Set error 0 on sucess
				var update = {$inc: {success : 1},error : 0};
				var options = {upsert: true, 'new': true};
			// this will create the doc if it doesn't exist the first time, 
			// it should use the default value from the schema instead of the value passed to $inc
				Jobs_Schema.findOneAndUpdate(query, update, options, function (err, docObj) {
					if (err) {
						console.log("error"+err);
						callback(err);
					} else {
						console.log("sucess job entry");
						var success = docObj.success;
						
						if(success >= 10) {
							console.log('request succeed');
							callback('success');
						}else {			
							console.log('request succeed do it again');
							callback('release', 60);
						}
					} 
				});
				
			};
			
			
			ExchangeRate.prototype.fail_data=function(from_data, to_data, callback){
	 
				var query = {from : from_data,to : to_data};
				var update = {$inc: {error : 1}};
				var options = {upsert: true, 'new': true};
				Jobs_Schema.findOneAndUpdate(query, update, options, function (err, docObj) {
					if (err) {
						callback(err);
					} else {
						var error = docObj.error;

						if(error >= 3) {
							console.log('failed request');
							callback('success');
						}else {     
							console.log('failed request do it again');
							callback('release', 3);
						}						
					} 
				});
				 
			 };
		 
		 

    var handler = new ExchangeRate();
    return handler;
};