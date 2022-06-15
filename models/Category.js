const { Schema, model } = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const categorySchema = new Schema({
  idName: {
    type: String,
    unique: true
  },
  categoryName: String,
  type: String,
  dateCreated: { type: Date, default: Date.now },
  isActive: Boolean,
  newCategory: Boolean,
  discount: Boolean,
  position: Number
})

categorySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id
    delete returnedObject.__v
  }
})

categorySchema.plugin(uniqueValidator)

const Category = model('Category', categorySchema)

module.exports = Category
