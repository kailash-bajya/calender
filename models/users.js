const Mongoose = require('mongoose')

var Schema = new Mongoose.Schema({
    _id: {
        type: Mongoose.Schema.ObjectId
    },
    name:{
        type: String
    },
    email: {
        type: String, unique: true
    },
    status: {
        type: Boolean, default: false
    },
    password: {
        type: String
    },
    created_at : {
        type: Date
    }
},
{
    'collection': 'users'
}
);

const USERS = Mongoose.model('user', Schema);

module.exports = USERS