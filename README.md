
#Goal

Code a currency exchagne rate worker

1.Input currency FROM and TO, say USD to HKD, one currency conversation per job.

2.Get FROM and TO currency every 1 min, save 10 successful rate results to mongodb include the timestamp, then that currency converstaion job is done.

3.If any problem during the get rate attempt, retry it delay with 3s

4.If failed more than 3 times in total (not consecutive), bury the job.


#Note:

1.Exchange rate need to be round off to 2 decmicals in STRING type.

a. If request is failed, reput to the tube and delay with 3s.

b. If request is succeed, reput to the tube and delay with 60s.


awwcbgypdgsncgsabakecq



