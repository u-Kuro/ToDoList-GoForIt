const express = require('express');

const authController = require('../controllers/category');

const router = express.Router();

router.post('/addcategory', authController.addcategory);
router.post('/updatecategory', authController.updatecategory);
router.post('/deletecategory', authController.deletecategory);
router.post('/opencategory', authController.opencategory);


module.exports = router;