const { EVENTS } = require('../models')
const SERVICES = require('../services')
const { DOA_EVENT_CHANGES, DOA_EVENT, DOA } = SERVICES

const EVENT_CHANGE_LOG_CONTROLLER = {
    validateCustomer: async ( req, res, next, id) => {
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

    storeEventChangeLog: async ( req, res, next) => {
        let body = req.body

        const USER_STATUS = await EVENT_CHANGE_LOG_CONTROLLER.validateCustomer(req, res, next, body.user_id)
        if ( USER_STATUS.status != 200 ) {
            return res.send(USER_STATUS)
        } 

        if ( !! body.event_date ) {
            console.log('at change log')

            body.time_start.value = body.time_start.hour * 60 + (body.time_start.minute ?
            body.time_start.minute: 0)
            body.time_end.value = body.time_end.hour * 60 + (body.time_start.minute ?
            body.time_end.minute: 0)

            const EVENT_CHANGE_RESPONSE = await DOA_EVENT_CHANGES.storeEventChangeLog(body)
            // console.log('vdfhjdfjd', EVENT_CHANGE_RESPONSE)
            res.send({
                status: 200,
                data: EVENT_CHANGE_RESPONSE.data,
                message: "Successfully updated"
            })
        } else {
            console.log('at updating event')
            const EVENT_UPDATE = await DOA_EVENT.updateEvent(body);
            let status = 400
            let message = "Failed"
            if ( EVENT_UPDATE.nModified > 0) {
                status = 200
                message = "Successfully updated"
            }
            res.send({
                status: status,
                data: [],
                message: message
            })
        }
    }
}

module.exports = EVENT_CHANGE_LOG_CONTROLLER