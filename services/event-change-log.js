const MODELS = require('../models')

const {
    EVENTS,
    EVENT_CHANGE_LOG
} = MODELS

const DOA_EVENT_CHANGES = {
    getEventChange: async ( user_data ) => {
        if ( !!user_data ) {
            return {
                status : 400,
                data: []
            }
        }

        const events = await EVENT_CHANGE_LOGS.find(
            {
                user_id: user_data.user_id,
                event_id: user_data.event_id,
                event_date: { $gte: new Date() },
                status: "capture"
            }
        )

        return {
            status: 200,
            data  : events
        }
    },

    storeEventChangeLog: async ( event_change_data ) => {
        console.log('event chane payload', event_change_data)
        const EVENT_DETAILS = await EVENTS.findOne({
            _id: event_change_data.event_id
        },
        {
            start_date: 1,
            end_date: 1,
            time_start: 1,
            time_end: 1,
            day: 1
        })
        console.log('old event time::', EVENT_DETAILS)
        event_change_data.old_start_date = EVENT_DETAILS.start_date
        if ( EVENT_DETAILS.end_date ) {
            event_change_data.old_end_date = EVENT_DETAILS.end_date
        }
        event_change_data.old_time_start = EVENT_DETAILS.time_start
        event_change_data.old_time_end = EVENT_DETAILS.time_end
        if ( !event_change_data.status ) {
            event_change_data.status = 'active'
        }
        
        const event_created = await EVENT_CHANGE_LOG.updateOne(
            {
                event_id : event_change_data.event_id,
                user_id : event_change_data.user_id,
                event_date: event_change_data.event_date 
            },
            {
                $set : event_change_data
            },
            {
                upsert: true
            }
        )
        // const event_object = await new EVENT_CHANGE_LOG(event_change_data)
        // const event_created= await event_object.save()
        // console.log('event changes log', event_created)
        return {
            status: 200,
            data: event_created
        }
    }
}

module.exports = DOA_EVENT_CHANGES