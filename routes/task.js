const express = require('express');

const authController = require('../controllers/task');

const router = express.Router();

router.post('/addtask', authController.addtask);
router.post('/updatetask', authController.updatetask);
router.post('/deletetask', authController.deletetask);
router.post('/changetaskstatus', authController.changetaskstatus);
router.post('/refreshtasks', authController.refreshtasks);

module.exports = router;