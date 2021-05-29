const Mongoose = require("mongoose");
const APP_CONSTENT  = require('../constant')

var Schema = new Mongoose.Schema({
    // _id: {
    //     type: Mongoose.Schema.ObjectId,
    // },
    event_name:{
        type: String
    },
    user_id: {
        type: Mongoose.Schema.ObjectId,
        ref: 'Users',
        require: true
    },
    start_date: {
        type: Date, require: true
    },
    end_date: {
        type: Date
    },
    day: [{
        type: String,
        enum: APP_CONSTENT.DAYS_ENUM
    }],
    time_start:{
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
    recurring: {
      type: Boolean,
      default: false
    },
    created_at : {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'capture'],
        default: 'active'
    }
});

Schema.virtual('event_change_log',{
    ref: 'eventchangelogs',
    localField: '_id',
    foreignField: 'event_id'
});

Schema.set('toObject', { virtuals: true });
Schema.set('toJSON', { virtuals: true });

const EVENTS= Mongoose.model('events', Schema);

module.exports = EVENTS
