const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new Schema({
  ref: {
    type: String,
    unique: true
  },
  nameCategory: String,
  description: String,
  colors: [String],
  sizes: [String],
  photos: [String],
  sizesDescriptions: [{ data: String, description: String }],
  dateCreated: { type: Date, default: Date.now },
  isActive: Boolean,
  newProduct: Boolean,
  discount: String,
  position: Number,
  precioUY: String,
  precioES: String,
  precioUSD: String,
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject.__v
  }
})

productSchema.plugin(uniqueValidator)

const Product = model('Product', productSchema)

module.exports = Product



