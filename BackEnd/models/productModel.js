const { string } = require("joi");
const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      
    },
    price: {
      type: Number,
      
    },
    category: {
      type: String,
     
    },
    brand: { type: String,
     

    },
    quantity: {
      type: Number,
    

    },
    sold: {
      type: Number,
      default: 0,
      
    },
    image: {
      type : String,
  
  },
    color: {
      type: String,
     

    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    totalrating: {
      type: String,
      default: 0,
    },
    date: {
      type: Date,
    },
  },
  
  
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Product", productSchema);
