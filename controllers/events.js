const SERVICES = require('../services')
const APP_CONSTANT = require('../constant')

const { DOA_EVENT, DOA } = SERVICES

const EVENT_CONTROLLER = {
    validateCustomer: async (req, res, next, id) => {
        const user_count = await DOA.getUser(id)
        if ( !user_count ) {
            return {
                status: 400,
                message: "invalid user",
                data: []
            }
        } else {
            return {
                status: 200
            }
        }
    },
    getEvent: async ( req, res, next ) => {
        const params = req.query
        const id = params.id
        const USER_STATUS = await EVENT_CONTROLLER.validateCustomer(req, res, next, id)
        
        if ( USER_STATUS.status != 200 ) {
            return res.send(USER_STATUS)
        }
        
        let eventDetails = await DOA_EVENT.getEvent(id)
        
        res.send({
            status: 200,
            data: eventDetails.data,
            message: "success"
        })
    },

    formatEventData: ( eventDetails, start_date, end_date ) => {
        let calender = {
            sunday: [],
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
        }

        let updated_event = {}
        let delete_event_date = {}
        
        eventDetails.map(x => {
            let days = x.day
            for( item in days) {
                calender[days[item]].push(x)
            }

            if ( x.event_change_log ) {
                let event_change = x.event_change_log
                for( let item in event_change ) {
                    let key = ( +new Date(event_change[item].event_date) ) / 1000
                    updated_event[key] = event_change[item]
                    if ( ! delete_event_date[event_change[item].event_id] ) {
                        delete_event_date[event_change[item].event_id] = []
                    }
                    delete_event_date[event_change[item].event_id]
                    .push( ( +new Date(event_change[item].old_event_date) ) / 1000 )
                }
            }
            delete x.event_change_log
        })
 
        let diffTime = Math.abs( ( new Date(end_date) ) - ( new Date(start_date) ) )
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let formated_calender = []
        // console.log('vdjhvjhv', start_date)
        for( let i = 0; i <= diffDays; i++ ) { 
            let tmp_date = new Date(start_date);
            tmp_date.setDate(tmp_date.getDate() + i)
            let timestamp = (+new Date(tmp_date)) / 1000
            let tmp_day = tmp_date.getDay()
            // console.log('tmp day:::', tmp_day, timestamp, tmp_date)
            
            if ( calender[APP_CONSTANT.DAYS_ENUM[tmp_day]] ) {
                let tmp_date_event = {
                    date : tmp_date,
                    day : APP_CONSTANT.DAYS_ENUM[tmp_day],
                    events : JSON.parse( JSON.stringify(calender[APP_CONSTANT.DAYS_ENUM[tmp_day]]) ),
                }

                let TMP_EVENT_LENGTH = tmp_date_event.events.length
                for ( let j=0; j < TMP_EVENT_LENGTH; j ++ ) {
                    // console.log('vdshvdhvdfhjdfhj', tmp_date, tmp_date < new Date(tmp_date_event.events[j].start_date), 
                    // tmp_date > new Date(tmp_date_event.events[j].end_date))
                    if (
                        tmp_date < new Date(tmp_date_event.events[j].start_date) ||
                        tmp_date > new Date(tmp_date_event.events[j].end_date) ||
                        (
                            delete_event_date[tmp_date_event.events[j].event_id] &&
                            delete_event_date[tmp_date_event.events[j].event_id].indexOf(timestamp) > -1
                        )
                    ) {
                        tmp_date_event.events.splice(j, 1)
                        j -=1
                        TMP_EVENT_LENGTH -=1 
                    }
                }

                if ( updated_event[timestamp] ) {
                    tmp_date_event.events.push( updated_event[timestamp] )
                }
                // console.log('formated:::', tmp_date_event);
                formated_calender.push(tmp_date_event)
            }
        }

        return formated_calender
    },

    storeEvent: async ( req, res, next ) => {
        const event_data = req.body

        const USER_STATUS = await EVENT_CONTROLLER.validateCustomer(req, res, next, event_data.user_id)
        
        if ( USER_STATUS.status != 200 ) {
            return res.send(USER_STATUS)
        }

        event_data.time_start.value = event_data.time_start.hour * 60 + (event_data.time_start.minute ?
        event_data.time_start.minute: 0)
        event_data.time_end.value = event_data.time_end.hour * 60 + (event_data.time_start.minute ?
        event_data.time_end.minute: 0)
        // console.log('event data', event_data.time_start, event_data.time_end)
        const USER_EVENT_EXISTS = await DOA_EVENT.validateEvent(event_data)

        if ( USER_EVENT_EXISTS.length > 0 ) {
            return res.send({
                status: 400,
                data: USER_EVENT_EXISTS,
                message: "Event Already Exists"
            })
        } else {
            const event_created = await DOA_EVENT.storeEvent(event_data)
            // console.log('event ctreated', event_created)
            return res.send({
                status: 200,
                data: event_created.data,
                message: "success"
            })
        }
    },

    getCalenderEvent: async ( req, res, next ) => {
        const event_data = req.query
        const id = event_data.id
        const START_DATE = event_data.start_date
        const END_DATE = event_data.end_date

        const USER_STATUS = await EVENT_CONTROLLER.validateCustomer(req, res, next, id)
        
        if ( USER_STATUS.status != 200 ) {
            return res.send(USER_STATUS)
        }

        let eventDetails = await DOA_EVENT.getEvent(id, START_DATE, END_DATE)
        
        eventDetails.data = EVENT_CONTROLLER.formatEventData(
            eventDetails.data,
            START_DATE,
            END_DATE
        )

        res.send({
            status: 200,
            data: eventDetails.data,
            message: "success"
        })
    }
}

module.exports = EVENT_CONTROLLER