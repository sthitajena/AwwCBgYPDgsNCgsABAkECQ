
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

2.Run ```node start.js```

This will process get exchange rates of USD to HKD  from xe.com  and store it in mongodb.

Test 1: USD to HKD

mongodb data sample :
USD to HKD


```
{
    "_id": {
        "$oid": "57b873c8e0277e100de4c512"
    },
    "from": "USD",
    "to": "HKD",
    "rate_data": "7.75",
    "created_date": {
        "$date": "2016-08-20T15:14:16.111Z"
    },
    "__v": 0
  }
```

```
{
    "_id": {
        "$oid": "57b873c90767c14c8a280c28"
    },
    "from": "USD",
    "to": "HKD",
    "error": 0,
    "success": 10,
    "__v": 0
}

```

![My image](https://cloud.githubusercontent.com/assets/21002646/17832090/6df081ee-672d-11e6-8598-f12fbfa91973.png)
![My image](https://cloud.githubusercontent.com/assets/21002646/17832094/754f0a96-672d-11e6-91dc-f3d45a3081e9.png)


Test2:

USD to XXX

```
{
    "_id": {
        "$oid": "57b877520767c14c8a280c29"
    },
    "from": "USD",
    "to": "XXX",
    "error": 1,
    "__v": 0
}
```


![My image](https://cloud.githubusercontent.com/assets/21002646/17832135/48b1dda0-672e-11e6-98a8-d2808df90777.png)





Note: Please change beanstalk, mongodb settings i,e port, username, password accordingly.


awwcbgypdgsncgsabakecq



