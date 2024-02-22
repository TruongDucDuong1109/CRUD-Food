const PCategory = require('../models/prodcategoryModel');
const asyncHandler = require('express-async-handler');
const validateMongoDbId = require('../utils/validateMongobld');

const createCategory = asyncHandler(async (req, res) => {  
    try {
        const newCategory = await PCategory.create(req.body);
        res.json(newCategory)
    } catch (error) {
        throw new Error(error);
    }
 });


 const updateCategory = asyncHandler(async (req, res) => {  
    
    const  {id}  = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await PCategory.findByIdAndUpdate(id, req.body, {new:true})
        res.json(updateCategory)
    } catch (error) {
        throw new Error(error);
    }
 });


 const deleteCategory = asyncHandler(async (req, res) => {  
    const  {id}  = req.params;
    validateMongoDbId(id);

    try {
        const deleteCategory = await PCategory.findByIdAndDelete(id)
        res.json(deleteCategory)
    } catch (error) {
        throw new Error(error);
    }
 });

 const getCategory = asyncHandler(async (req, res) => {  
    const  {id}  = req.params;
    validateMongoDbId(id);
    try {
        const getCategory = await PCategory.findById(id)
        res.json(getCategory)
    } catch (error) {
        throw new Error(error);
    }
 });

 const getallCategory = asyncHandler(async (req, res) => {  
    try {
        const getallCategory = await PCategory.find()
        res.json(getallCategory)
    } catch (error) {
        throw new Error(error);
    }
 });

module.exports = {createCategory,
    updateCategory,
    deleteCategory,
    getCategory,
    getallCategory}