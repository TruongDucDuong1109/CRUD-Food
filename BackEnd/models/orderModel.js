const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          
        },
        quantity: { type: Number },
        brands: {type: Array, default: []},
      },
    ],
    paidAt: {
      type: Date,
      default: Date.now(),
    },
    orderStatus: {
      type: String,
      default: "Ordered"
    }
  },
  { timestamps: true }
);

//Export the model
module.exports = mongoose.model("Order", orderSchema);
