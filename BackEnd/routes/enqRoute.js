const express = require('express');
const { createEnquiry, 
    updateEnquiry,
    deleteEnquiry,
    getEnquiry,
    getallEnquiry } = require('../controller/enqCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddeware');
const router = express.Router();

router.get('/:id',authMiddleware ,isAdmin, getEnquiry); 
router.get('/',authMiddleware ,isAdmin, getallEnquiry); 
router.post('/', createEnquiry); 
router.put('/:id',authMiddleware ,isAdmin, updateEnquiry); 
router.delete('/:id',authMiddleware ,isAdmin, deleteEnquiry); 


module.exports = router;