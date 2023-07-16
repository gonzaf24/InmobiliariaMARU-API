const mongoose = require("mongoose");
const housesRouter = require("express").Router();
const House = require("../models/House");
const userExtractorAdmin = require("../middleware/userExtractorAdmin");

housesRouter.get("/", async (request, response) => {
  try {
    const houses = await House.find({});
    response.json(houses);
  } catch (error) {
    response.status(422).send(error);
  }
});

housesRouter.get("/:id", async (request, response) => {
  const id = request.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(404).send({ error: "House not found" });
  }
  try {
    const house = await House.findById(id);
    if (house) {
      response.json(house);
    } else {
      response.status(404).send({ error: "House not found" });
    }
  } catch (error) {
    response
      .status(500)
      .send({ error: "An error occurred while fetching the house" });
  }
});

housesRouter.post("/", userExtractorAdmin, async (request, response) => {
  console.log("entro en post housesRouter");
  try {
    const {
      operation,
      price,
      country,
      region,
      city,
      neighborhood,
      postalCode,
      street,
      addressNumber,
      floor,
      door,
      stair,
      propertyType,
      rooms,
      bathrooms,
      size,
      floors,
      heatingCooling,
      water,
      electricity,
      gas,
      furnished,
      pets,
      parkingIncluded,
      parkingOptional,
      parkingPrice,
      pool,
      jacuzzi,
      garden,
      terrace,
      horizontal,
      exterior,
      elevator,
      constructionYear,
      renovationYear,
      antiquity,
      observations,
      ownerName,
      ownerPhone,
      ownerEmail,
      title,
      description,
      address,
      lat,
      lng,
      isAddress,
      exactPosition,
      showInMap,
      photos,
      videos,
      documents,
    } = request.body;

    const newHouse = new House({
      operation,
      price,
      country,
      region,
      city,
      neighborhood,
      postalCode,
      street,
      addressNumber,
      floor,
      door,
      stair,
      propertyType,
      rooms,
      bathrooms,
      size,
      floors,
      heatingCooling,
      water,
      electricity,
      gas,
      furnished,
      pets,
      parkingIncluded,
      parkingOptional,
      parkingPrice,
      pool,
      jacuzzi,
      garden,
      terrace,
      horizontal,
      exterior,
      elevator,
      constructionYear,
      renovationYear,
      antiquity,
      observations,
      ownerName,
      ownerPhone,
      ownerEmail,
      title,
      description,
      address,
      lat,
      lng,
      isAddress,
      exactPosition,
      showInMap,
      photos,
      videos,
      documents,
    });
    const savedHouse = await newHouse.save();
    response.status(201).json(savedHouse);
  } catch (error) {
    console.log("entro en post housesRouter error", error);
    response.status(422).send(error);
  }
});

housesRouter.put("/:id", userExtractorAdmin, async (request, response) => {
  try {
    console.log("entro en put housesRouter ID", request.params.id);
    const house = await House.findById(request.params.id);
    if (!house) {
      return response.status(404).send({ error: "House not found" });
    }
    const {
      operation,
      price,
      country,
      region,
      city,
      neighborhood,
      postalCode,
      street,
      addressNumber,
      floor,
      door,
      stair,
      propertyType,
      rooms,
      bathrooms,
      size,
      floors,
      heatingCooling,
      water,
      electricity,
      gas,
      furnished,
      pets,
      parkingIncluded,
      parkingOptional,
      parkingPrice,
      pool,
      jacuzzi,
      garden,
      terrace,
      horizontal,
      exterior,
      elevator,
      constructionYear,
      renovationYear,
      antiquity,
      observations,
      ownerName,
      ownerPhone,
      ownerEmail,
      title,
      description,
      address,
      lat,
      lng,
      isAddress,
      exactPosition,
      showInMap,
      photos,
      videos,
      documents,
    } = request.body;

    house.operation = operation;
    house.price = price;
    house.country = country;
    house.region = region;
    house.city = city;
    house.neighborhood = neighborhood;
    house.postalCode = postalCode;
    house.street = street;
    house.addressNumber = addressNumber;
    house.floor = floor;
    house.door = door;
    house.stair = stair;
    house.propertyType = propertyType;
    house.rooms = rooms;
    house.bathrooms = bathrooms;
    house.size = size;
    house.floors = floors;
    house.heatingCooling = heatingCooling;
    house.water = water;
    house.electricity = electricity;
    house.gas = gas;
    house.furnished = furnished;
    house.pets = pets;
    house.parkingIncluded = parkingIncluded;
    house.parkingOptional = parkingOptional;
    house.parkingPrice = parkingPrice;
    house.pool = pool;
    house.jacuzzi = jacuzzi;
    house.garden = garden;
    house.terrace = terrace;
    house.horizontal = horizontal;
    house.exterior = exterior;
    house.elevator = elevator;
    house.constructionYear = constructionYear;
    house.renovationYear = renovationYear;
    house.antiquity = antiquity;
    house.observations = observations;
    house.ownerName = ownerName;
    house.ownerPhone = ownerPhone;
    house.ownerEmail = ownerEmail;
    house.title = title;
    house.description = description;
    house.address = address;
    house.lat = lat;
    house.lng = lng;
    house.isAddress = isAddress;
    house.exactPosition = exactPosition;
    house.showInMap = showInMap;
    house.photos = photos;
    house.videos = videos;
    house.documents = documents;

    const updatedHouse = await house.save();
    response.json(updatedHouse);
  } catch (error) {
    response.status(400).send({ error: error.message });
  }
});

housesRouter.delete("/:id", userExtractorAdmin, async (request, response) => {
  try {
    const house = await House.findById(request.params.id);
    if (!house) {
      return response.status(404).json({ error: "house not found" });
    }
    await House.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = housesRouter;
