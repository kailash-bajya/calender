# calender

start project by using command
    npm start project dirctory

Test Case:

1. first hit to create user: 
GET - localhost:3000/list/calender?id=60ae58c572230f3e7942c41d&start_date=2021-05-25&end_date=2021-06-09

we are creatingg only one user as of now and fixed the user id.

2. creating events: 

POST - localhost:3000/store/event
payload - {
    "event_name": "creating first event",
    "user_id": "60ae58c572230f3e7942c41d",
    "start_date": "2021-06-01",
    "day": [
        "tuesday",
        "sunday"
    ],
    "time_start": {
        "hour": 11,
        "minute":1
    },
    "time_end": {
        "hour": 12,
        "minute":0
    },
    "recurring": true
}

3. updating evvents:
PUT - localhost:3000/update/event
payload: {
    "event_name": "updating 2 first event",
    "user_id": "60ae58c572230f3e7942c41d",
    "event_id": "60af3fbaf1388c1dba604cd5",
    "event_date": "2021-05-28",
    "old_event_date": "2021-05-28",
    "time_start": {
        "hour":18,
        "minute":15
    },
    "time_end": {
        "hour": 19,
        "minute":15
    },
    "status":"cancel"
}

4. Listing calender:

GET - localhost:3000/list/calender?id=60ae58c572230f3e7942c41d&start_date=2021-05-25&end_date=2021-06-09