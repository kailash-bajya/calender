const Mongoose = require("mongoose");
const APP_CONSTENT  = require('../constant')
var Schema = new Mongoose.Schema({
    // _id: {
    //     type: Mongoose.Schema.ObjectId,
    // },
    event_id:{
        type: Mongoose.Schema.ObjectId,
        ref: 'Events',
        required: true
    },
    user_id: {
        type: Mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    },
    old_time_start:{
        hour: {
            type: Number
        },
        minute: {
            type: Number,
            default:0
        },
        value: { // total in minutes
            type: Number
        }
    },
    old_time_end: {
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            default:0
        },
        value: { // total in minutes
            type: Number
        }
    },
    day: {
        type: String,
        enum: APP_CONSTENT.DAYS_ENUM
    },
    old_event_date: {
        type: Date, require: true
    },
    event_date: {
        type: Date, require: true
    },
    time_start:{
        hour: {
            type: Number
        },
        minute: {
            type: Number,
            default:0
        },
        value: { // total in minutes
            type: Number
        }
    },
    time_end: {
        hour: {
            type: Number,
            required: true
        },
        minute: {
            type: Number,
            default:0
        },
        value: { // total in minutes
            type: Number
        }
    },
    created_at : {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'capture', 'rescheduled'],
        default: 'active'
    }
});

const EVENT_CHANGE_LOGS = Mongoose.model('eventchangelogs', Schema);
module.exports =  EVENT_CHANGE_LOGS