const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema(
    {
      userId : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        required: true,
      }
      ,
      brands: {type: Array, default: []},
    },
    {
      timestamps: true
    }
    );

//Export the model
module.exports = mongoose.model('Cart', cartSchema);