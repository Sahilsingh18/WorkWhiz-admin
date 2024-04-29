const { Schema, models, model, default: mongoose } = require("mongoose");

const ServiceSchema = new Schema({
  name: {type: String, required: true},
  parent: {type:mongoose.Types.ObjectId, ref:'Service'},
})

export const Service = models?.Service || model('Service', ServiceSchema);