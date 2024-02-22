const express = require('express');
const { createCategory, 
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory } = require('../controller/prodcategoryCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddeware');
const router = express.Router();

router.get('/:id',authMiddleware ,isAdmin, getCategory); 
router.get('/',authMiddleware ,isAdmin, getallCategory); 
router.post('/',authMiddleware ,isAdmin, createCategory); 
router.put('/:id',authMiddleware ,isAdmin, updateCategory); 
router.delete('/:id',authMiddleware ,isAdmin, deleteCategory); 


module.exports = router;