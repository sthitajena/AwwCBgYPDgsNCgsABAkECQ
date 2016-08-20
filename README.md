
#Goal:

Code a currency exchagne rate worker

1.Input currency FROM and TO, say USD to HKD, one currency conversation per job.

2.Get FROM and TO currency every 1 min, save 10 successful rate results to mongodb include the timestamp, then that currency converstaion job is done.

3.If any problem during the get rate attempt, retry it delay with 3s

4.If failed more than 3 times in total (not consecutive), bury the job.

5.Get the exchange rate from xe.com or other source


#Note:

1.Exchange rate need to be round off to 2 decmicals in STRING type.

a. If request is failed, reput to the tube and delay with 3s.

b. If request is succeed, reput to the tube and delay with 60s.


#Tools you may need:

Use beanstalkd, mongodb, nodejs (v4.2.1)

1.beanstalkd server is setup for you already, make a JSON request to this:

/POST http://challenge.aftership.net:9578/v1/beanstalkd

header: aftership-api-key: a6403a2b-af21-47c5-aab5-a2420d20bbec

2.Get a free mongodb server at mongolab

3.You may also need Beanstalk console or any tools u like.

#How it works

1.run  ``` node beanstalk.js ```

This will create job in beanstalk server . Job structure will ready state in "exchange" tube of beanstalk server. If we check the status of the job it will like this shown below.

![My image](https://cloud.githubusercontent.com/assets/21002646/17831873/1a70c178-6728-11e6-8649-e986805ded11.png)




awwcbgypdgsncgsabakecq



