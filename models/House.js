const { Schema, model } = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const houseSchema = new Schema({
  operation: { type: String, required: true },
  price: { type: Number, required: true },
  country: { type: String, required: true },
  region: { type: String, required: true },
  city: { type: String, required: true },
  neighborhood: { type: String, required: true },
  postalCode: { type: String, required: true },
  street: { type: String, required: true },
  addressNumber: { type: String, required: true },
  floor: { type: String },
  door: { type: String },
  stair: { type: String },
  propertyType: { type: String },
  rooms: { type: Number },
  bathrooms: { type: Number },
  size: { type: Number },
  floors: { type: Number },
  heatingCooling: { type: String },
  water: { type: Boolean },
  electricity: { type: Boolean },
  gas: { type: Boolean },
  furnished: { type: Boolean },
  pets: { type: Boolean },
  parkingIncluid: { type: Boolean },
  parkingOptional: { type: Boolean },
  parkingPrice: { type: Number },
  pool: { type: Boolean },
  jacuzzi: { type: Boolean },
  garden: { type: Boolean },
  terrace: { type: Boolean },
  horizontal: { type: Boolean },
  exterior: { type: Boolean },
  elevator: { type: Boolean },
  constructionYear: { type: Date },
  renovationYear: { type: Date },
  antiquity: { type: Number },
  observations: { type: String },
  ownerName: { type: String, required: true },
  ownerPhone: { type: String },
  ownerEmail: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  isAddress: { type: Boolean },
  exactPosition: { type: Boolean },
  showInMap: { type: Boolean },
  photos: [{ type: String }],
  videos: [{ type: String }],
  documents: [{ type: String }],
});

houseSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

houseSchema.plugin(uniqueValidator);

const House = model("House", houseSchema);

module.exports = House;
