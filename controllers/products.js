
const bcrypt = require('bcrypt')
const productsRouter = require('express').Router()
const Product = require('../models/Product')
const userExtractor = require('../middleware/userExtractor')
const { deleteImage } = require('../utils/deleteImage')
const formatFileNameToShow = require('../utils/formatters')


productsRouter.post('/', userExtractor, async (request, response, next) => {
  try {
    const { body } = request
    console.log("entro en post product ")
    const { ref, nameCategory, description, detail, colors, sizes, photos, sizesDescriptions, isActive, newProduct, discount, position, precioUY, precioES, precioUSD } = body
    const productToPersist = new Product({
      ref,
      nameCategory,
      description,
      detail,
      colors,
      sizes,
      photos,
      sizesDescriptions,
      isActive,
      newProduct,
      discount,
      position,
      precioUY,
      precioES,
      precioUSD,
    })
    productToPersist.save(function (err, element) {
      if (err) {
        //422 duplicated key
        return response.status(422).send(err);
      }
      //console.log("[ NEW PRODUCT ] ", element);
      response.status(201).json(element);
    });
  } catch (error) {
    console.log("error ", error)
  }
})

productsRouter.get('/', async (request, response) => {
  try {
    console.log(" Entro en GET products")
    const products = await Product.find({})
    response.status(201).json(products)
  } catch (error) {
    return response.status(422).send(error);
  }
})

productsRouter.get('/:category', async (request, response) => {
  try {
    const { category } = request.params
    console.log(" Entro en GET products by category ", category)
    const products = await Product.find({})
    const porductsOut = products.filter((ele) => ele.nameCategory === category);
    if (products === null) return response.sendStatus(404)
    response.status(201).json(porductsOut)
  } catch (error) {
    return response.status(422).send(error);
  }
})

productsRouter.get('/id/:id', async (request, response) => {
  try {
    const { id } = request.params
    console.log(" Entro en GET products by 1d ", id)
    const product = await Product.findById(id)
    if (product === null) return response.sendStatus(404)
    response.status(201).json(product)
  } catch (error) {
    return response.status(422).send(error);
  }
})

productsRouter.delete('/:id', userExtractor, async (request, response, next) => {
  const { id } = request.params
  console.log("aqui el delete de producto id: ", id)
  const product = await Product.findById(id)
  if (product.photos.length > 0) {
    product.photos.forEach(async function (element) {
      console.log("elimino foto ", element)
      return await deleteImage(formatFileNameToShow(element));
    });
  }
  // if (!note) return response.sendStatus(404)
  const res = await Product.findByIdAndDelete(id)
  if (res === null) return response.sendStatus(404)
  response.status(204).end()
})

productsRouter.put('/:id', userExtractor, (request, response, next) => {
  try {
    const { id } = request.params;
    console.log("aqui entro put product con id ", id)
    const { ref, nameCategory, description, detail, colors, sizes, photos, sizesDescriptions, isActive, newProduct, discount, position, precioUY, precioES, precioUSD } = request.body
    const newProductInfo = {
      ref,
      nameCategory,
      description,
      detail,
      colors,
      sizes,
      photos,
      sizesDescriptions,
      isActive,
      newProduct,
      discount,
      position,
      precioUY,
      precioES,
      precioUSD,
      id
    }
    Product.findByIdAndUpdate(id, newProductInfo, { new: true })
      .then(result => {
        response.json(result)
      })
      .catch((error) => console.log("error Product.findByIdAndUpdate", error))
  } catch (error) {
    console.log("error al update product ", error)
    return response.status(422).send(error);
  }
})

module.exports = productsRouter