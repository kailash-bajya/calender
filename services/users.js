const MODELS = require('../models')
const mongoose = require('mongoose')
const {
    USERS
} = MODELS

const DOA = {
    getUser: async ( user_id ) => {
        if ( !user_id ) {
            return 0
        }
        const id = mongoose.Types.ObjectId(user_id)
        console.log('object id', id)
        let user_exists = await USERS.find(
            {
                _id: user_id,
                status: true
            }
        ).count()
        if ( user_exists == 0  && user_id == '60ae58c572230f3e7942c41d') {
            user_exists = await DOA.createUser()
        }

        console.log('user exist', user_exists)
        return user_exists
    },
    createUser: async () => {
        const CREATING_USER = await new USERS({
            _id: mongoose.Types.ObjectId('60ae58c572230f3e7942c41d'),
            status: 'true',
            email: 'kailash.cp2419@gmail.com',
            name: 'kailash'
        })

        const SAVE_USER = await CREATING_USER.save()
        return SAVE_USER
    }
}

module.exports = DOA