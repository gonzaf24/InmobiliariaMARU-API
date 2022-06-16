
const bcrypt = require('bcrypt')
const categorysRouter = require('express').Router()
const Category = require('../models/Category')
const userExtractor = require('../middleware/userExtractor')


const S3 = require('aws-sdk/clients/s3')

const s3 = new S3({
  region: process.env.S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY,
  secretAccessKey: process.env.S3_SECRET_ACCESSS_KEY
})

categorysRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const { body } = request
    console.log("entro en post category ")
    const { idName, categoryName, type, isActive, newCategory, discount, position } = body
    const categoryToPersist = new Category({
      idName,
      categoryName,
      type,
      isActive,
      newCategory,
      discount,
      position
    })

    categoryToPersist.save(function (err, element) {
      if (err) {
        //422 duplicated key
        return response.status(422).send(err);
      }
      //console.log("[ NEW CATEGORY ] ", element);
      response.status(201).json(element);
    });

  } catch (error) {
    console.log("error ", error)
  }

})

categorysRouter.get('/', async (request, response) => {
  console.log(" Entro en GET categorys")
  try {
    const categorys = await Category.find({})
    response.status(201).json(categorys)
  } catch (error) {
    console.log("error ", error)
    return response.status(422).send(error);
  }
})

categorysRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  console.log("aqui el delete de categoria id: ", id)
  const res = await Category.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)
  response.status(204).end()
})

categorysRouter.put('/:id', userExtractor, (request, response, next) => {
  try {
    const { id } = request.params
    console.log("aqui el put de categoria id:  ", id)
    const { idName, categoryName, type, isActive, newCategory, discount, position } = request.body
    const newCategoryInfo = {
      idName,
      categoryName,
      type,
      isActive,
      newCategory,
      discount,
      position,
      id
    }
    Category.findByIdAndUpdate(id, newCategoryInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch((error) => console.log("error Product.findByIdAndUpdate", error))
  } catch (error) {
    console.log("error al update category ", error)
    return response.status(422).send(error);
  }
})

module.exports = categorysRouter