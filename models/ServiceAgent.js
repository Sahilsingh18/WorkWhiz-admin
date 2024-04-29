import mongoose, {model, Schema, models} from "mongoose";

const ServiceAgentSchema = new Schema({
  name: {type:String, required:true},
  description: {type:String, required:true},
  price: {type: Number, required: true},
  details: {type:String},
  experience: {type:String},
  work: {type:String},
  gender: {type:String},
  images: [{type: String}],
  service: {type:mongoose.Types.ObjectId, ref:'Category'},
});

export const ServiceAgent = models.ServiceAgent || model('ServiceAgent', ServiceAgentSchema);