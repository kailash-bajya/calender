const { Query } = require('mongoose')
const MODELS = require('../models')

const {
    EVENTS,
    EVENT_CHANGE_LOG
} = MODELS

const DOA_EVENT = {
    getEvent: async ( user_id, start_date=null, end_date=null ) => {
        if ( !user_id ) {
            return 0
        }


        let date = new Date()
        let H = date.getHours()
        let M = date.getMinutes()
        let value = H * 60 + M

        let query = {
            user_id: user_id,
            status: 'active',
            start_date: { $lte: date },
            $or: [
                {
                    end_date : { $exists: false},
                    recurring: true
                },
                {
                    end_date: { $gte: date }
                }
            ]
        }

        let queryPopulate =  {
            $and: [
                {
                    status: 'active'
                },
                {
                    $or:[
                        {
                            event_date: { $eq: date },
                            'time_start.value': { $gte:  value },
                        },
                        {
                            event_date: { $gt: date },
                        }
                    ]
                }
            ]
        }

        if ( start_date && end_date ) {
            query = {
                $and: [
                    {
                        user_id: user_id
                    },
                    {
                        status: 'active'
                    }, 
                    {
                        $or: [
                            {
                                start_date: {
                                    $lte: start_date
                                },
                            },
                            {
                                end_date: {
                                    $gte: start_date
                                },
                            },
                            {
                                end_date: { 
                                    $lte: end_date
                                }
                            },
                            {
                                end_date : { $exists: false},
                                recurring: true,
                                start_date: {
                                    $lte: end_date
                                }
                            }
                        ]
                    }
                ],
            }
    
            queryPopulate =  {
                $and: [
                    // {
                    //     status: 'active'
                    // },
                    {
                        event_date: { $gte: start_date, $lte: end_date },
                    }
                ]
            }
        }

        const events = await EVENTS.find(
            query
        ).populate([
            {
                path: 'event_change_log',
                match: queryPopulate,
            }
        ]).lean()
        console.log('at get events', JSON.stringify(query))
        return {
            status : 200,
            data: events
        }
    },

    storeEvent: async ( event_data ) => {
        console.log('createign events', event_data)
        const event_object = await new EVENTS(event_data)
        const event_created= await event_object.save()

        return {
            status : 200,
            data: event_created
        }
    },

    updateEvent: async ( data ) => {
        const EVENT_ID = data.event_id
        const USER_ID = data.user_id

        delete data.event_id
        delete data.user_id

        const UPDATING_DATA = await EVENTS.updateOne({
            _id: EVENT_ID,
            user_id: USER_ID
        }, {
            $set: data
        })
        return UPDATING_DATA
    },

    validateEvent: async ( event_data, type='create' ) => {

        let sub_condition = [
            {
                start_date: { $lte: event_data.start_date }
            },
            {
                $or: [
                    {
                        end_date: { $exists: false },
                        recurring: true
                    },
                    {
                        end_date: { $gte: event_data.start_date }
                    }
                ]
            }
        ]

        if ( type == 'update' ) {
            sub_condition = [
                {
                    start_date: { $eq: event_data.event_date }
                },
                {
                    $or: [
                        {
                            end_date: { $exists: false },
                            start_date: { $lte: event_data.event_date },
                            recurring: true
                        },
                        {
                            end_date: { $eq: event_data.event_date }
                        }
                    ]
                }
            ]
        }

        const QUERY = {
            $and: [
                {
                    status: 'active'
                },
                {
                    user_id: event_data.user_id
                },
                {
                    day: { $in : event_data.day }
                },
                {
                    start_date: { $lte: event_data.start_date }
                },
                ...sub_condition,
                {
                    $or: [
                        {
                            "time_start.value":  { $lte: event_data.time_start.value },
                            "time_end.value":  { $gte: event_data.time_start.value }
                        },
                        {
                            "time_start.value":  { $lte: event_data.time_end.value },
                            "time_end.value":  { $gte: event_data.time_end.value }
                        }
                    ]
                }
            ]
        }
        const EVENT_CREATED = await EVENTS.find(QUERY)

        if ( EVENT_CREATED.length == 0 ) {
            return await DOA_EVENT.validateEventChangeLog(event_data)
        }
        //apply for checking in event change logs

        // console.log('event already created:::', EVENT_CREATED, JSON.stringify(QUERY) )
        return EVENT_CREATED;
    },

    validateEventChangeLog: async ( event_data, type='create' ) => {

        let sub_condition = [
            {
                event_date: { $gte: event_data.start_date }
            }
        ]

        if ( event_data.end_date ) {
            sub_condition.push({
                event_date: { $lte: event_data.end_date }
            })
        } else if ( !event_data.recurring ) {
            sub_condition.push({
                event_date: { $eq: event_data.start_date }
            })
        }

        if ( type == 'update' ) {
            sub_condition = [
                {
                    event_date: { $eq: event_data.event_date }
                }
            ]
        }

        const QUERY = {
            $and: [
                {
                    status: 'active'
                },
                {
                    user_id: event_data.user_id
                },
                // {
                //     day: { $in : event_data.day }
                // },
                {
                    start_date: { $lte: event_data.start_date }
                },
                ...sub_condition,
                {
                    $or: [
                        {
                            "time_start.value":  { $lte: event_data.time_start.value },
                            "time_end.value":  { $gte: event_data.time_start.value }
                        },
                        {
                            "time_start.value":  { $lte: event_data.time_end.value },
                            "time_end.value":  { $gte: event_data.time_end.value }
                        }
                    ]
                }
            ]
        }
        const EVENT_CREATED = await EVENT_CHANGE_LOG.find(QUERY)

        //apply for checking in event change logs

        console.log('event already created:::', EVENT_CREATED, JSON.stringify(QUERY) )
        return EVENT_CREATED;
    }
}

module.exports = DOA_EVENT