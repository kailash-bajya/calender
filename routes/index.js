var express = require('express');
var router = express.Router();
// import { EVENT_CONTROLLER, EVENT_CHANGE_LOG_CONTROLLER } from '../controllers'
const controller = require('../controllers/index')

const {
  EVENT_CONTROLLER,
  EVENT_CHANGE_LOG_CONTROLLER
} = controller
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/store/event', EVENT_CONTROLLER.storeEvent)
router.get('/list/event', EVENT_CONTROLLER.getEvent)
router.get('/list/calender', EVENT_CONTROLLER.getCalenderEvent)
router.put('/update/event', EVENT_CHANGE_LOG_CONTROLLER.storeEventChangeLog)

module.exports = router;
