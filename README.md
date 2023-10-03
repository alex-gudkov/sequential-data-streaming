# Sequential data streaming

## Task

Implement inside `execute()` function data reading stream from CSV file `4050-users.csv` which reads data by batch of `1000` rows and process data using `processAndInsertData()` function which requires some amount of time to do it.

__Extra condition:__ chunks of data should be processed sequentially (new chunk of data can be start processing only after previous one is finished)
