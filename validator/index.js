const Joi = require('joi');
const APP_CONSTANT = require('../constant')

module.exports = function(req, res, next) {
    let requestPath = req.originalUrl
    requestPath = requestPath.split('?')[0]
    let error = null
    let value = null
    console.log('request path', requestPath)
    switch( requestPath ) {
        case '/list/event':
            {
                const body = req.query
                const schema = Joi.object().keys({
                    id: Joi.string().required(),
                });

                const result = schema.validate(body);
                error = result.error
                value = result.value
                console.log('result list', result)
            }
            break
        case '/list/calender':
            {
                const body = req.query
                const schema = Joi.object().keys({
                    id: Joi.string().required(),
                    start_date: Joi.string().required(),
                    end_date: Joi.string().required()
                });

                const result = schema.validate(body);
                error = result.error
                value = result.value
                console.log('result list', result)
            }
            break
        case '/store/event':
            {
                const body = req.body
                console.log('body', JSON.stringify(body))

                const one_day = Joi.array().items(1);
                const two_day = Joi.array().items(2);
                Joi.array().when('.length', { is: 1, then: one_day, otherwise: two_day })
                
                const schema = Joi.object().keys({ 
                    event_name: Joi.string().required(),
                    user_id: Joi.string().required(),
                    start_date: Joi.date().required(),
                    end_date: Joi.date().optional(),
                    day: Joi.array().min(1).max(2).items(
                        Joi.string().valid(
                            'sunday',
                            'monday',
                            'tuesday',
                            'wednesday',
                            'thurday',
                            'friday',
                            'saturday'
                        ).required()
                    ).required(),
                    time_start: Joi.object().keys({
                        hour: Joi.number().required(),
                        minute: Joi.number().optional()
                    }),
                    time_end: Joi.object().keys({
                        hour: Joi.number().required(),
                        minute: Joi.number().optional()
                    }),
                    recurring: Joi.boolean().optional()
                });

                const result = schema.validate(body);
                error = result.error
                value = result.value
            }
            break
        case '/update/event':
            {
                const body = req.body

                // const seven_days = Joi.array().items(7);

                let validations = {
                    event_name: Joi.string().optional(),
                    event_id: Joi.string().required(),
                    user_id: Joi.string().required(),
                    event_date: Joi.date().optional(),
                    old_event_date: Joi.date().optional(),
                    day: Joi.array().max(1).items(
                        Joi.string().valid(
                            'sunday',
                            'monday',
                            'tuesday',
                            'wednesday',
                            'thurday',
                            'friday',
                            'saturday'
                        ).required()
                    ).required(),
                    time_start: Joi.object().keys({
                        hour: Joi.number().required(),
                        minute: Joi.number().optional()
                    }).optional(),
                    time_end: Joi.object().keys({
                        hour: Joi.number().required(),
                        minute: Joi.number().optional()
                    }).optional(),
                    recurring: Joi.boolean().optional(),
                    status: Joi.string().valid('cancel').optional(),
                }
                if ( body.event_date ) {
                    validations['event_date']  = Joi.date().required()
                    validations['time_start'] = Joi.object().keys({
                        hour: Joi.number().required(),
                        minute: Joi.number().optional()
                    }).required()
                    validations['time_end'] = Joi.object().keys({
                        hour: Joi.number().required(),
                        minute: Joi.number().optional()
                    }).required()
                    validations['old_event_date'] = Joi.date().required()

                    delete validations['day']
                }

                const schema = Joi.object().keys(validations);

                const result = schema.validate(body);
                error = result.error
                value = result.value
            }
            break
        default:
            break
                
    }

    if ( !error ) {
        next()
    } else {    
        return res.status(422).json({ error })
    }
}

// result.error == null means valid
