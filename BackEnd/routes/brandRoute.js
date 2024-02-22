const express = require('express');
const { createBrand, 
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrand } = require('../controller/brandCtrl');
const { authMiddleware, isAdmin } = require('../middlewares/authMiddeware');
const router = express.Router();

router.get('/', getallBrand);
router.get('/:id', getBrand); 
router.post('/',authMiddleware ,isAdmin, createBrand); 
router.put('/:id',authMiddleware ,isAdmin, updateBrand); 
router.delete('/:id',authMiddleware ,isAdmin, deleteBrand); 


module.exports = router;