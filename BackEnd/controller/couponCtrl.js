const Coupon = require("../models/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongobld");

const createCoupon = asyncHandler(async (req, res) => {
  try {
    const newCoupon = await Coupon.create(req.body);
    console.log(newCoupon);
    res.json(newCoupon);
  } catch (error) {
    throw new Error(error);
  }
});

const getAllCoupons = asyncHandler(async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    throw new Error(error);
  }
});


const updateCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const coupons = await Coupon.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(coupons);
    } catch (error) {
      throw new Error(error);
    }
  });

  const deleteCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
      const coupons = await Coupon.findByIdAndDelete(id);
      res.json(coupons);
    } catch (error) {
      throw new Error(error);
    }
  });
module.exports = { createCoupon, getAllCoupons,deleteCoupon,updateCoupon };
