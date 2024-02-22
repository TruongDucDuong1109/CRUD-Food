const Brand = require('../models/brandModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongobld');

const createBrand = asyncHandler(async (req, res) => {  
    try {
        const newBrand = await Brand.create(req.body);
        res.json(newBrand)
    } catch (error) {
        throw new Error(error);
    }
 });


 const updateBrand = asyncHandler(async (req, res) => {  
    
    const  {id}  = req.params;
    validateMongoDbId(id);
    try {
        const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateBrand)
    } catch (error) {
        throw new Error(error);
    }
 });


 const deleteBrand = asyncHandler(async (req, res) => {  
    const  {id}  = req.params;
    validateMongoDbId(id);

    try {
        const deleteBrand = await Brand.findByIdAndDelete(id)
        res.json(deleteBrand)
    } catch (error) {
        throw new Error(error);
    }
 });

 const getBrand = asyncHandler(async (req, res) => {  
    const  {id}  = req.params;
    validateMongoDbId(id);
    try {
        const getBrand = await Brand.findById(id)
        res.json(getBrand)
    } catch (error) {
        throw new Error(error);
    }
 });

 const getallBrand = asyncHandler(async (req, res) => {  
    try {
        console.log('Fetching all brands'); // Log fetching all brands
        const getallBrand = await Brand.find();
        console.log('Fetched all brands:', getallBrand); // Log fetched brands
        res.json(getallBrand);
    } catch (error) {
        console.error('Error fetching all brands:', error); // Log error
        throw new Error(error);
    }
 });

module.exports = {createBrand,
    updateBrand,
    deleteBrand,
    getBrand,
    getallBrand}