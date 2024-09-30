import {model,Schema} from "mongoose";
const ApplicationSchema = new Schema({
  JobTitle: {
    type: String,
    required: true,
  },
  Category: {
    type: String,
    required: true,
  },
  WorkMode: {
    type: String,
    required: true,
  },
  Type: {
    type: String,
    required: true,
  },
  AverageSalary: {
    type: Number,
    required: true,
  },
  Location: {
    type: String,
  },
  ApplicationLink: {
    type: String,
  },
  Responsibilities: {
    type: [{}],
    required: true,
  },
  Qualification: {
    type: [{}],
  },
  CompanyLogo: {
    type: String,
    required: true,
  },
  CompanyName: {
    type: String,
    required: true,
  },
  CompanyEmail: {
    type: String,
    required: true,
  },
  CompanyOverview: {
    type: [{}],
    required: true,
  },
  JobLink:{
    type:String,
    required:true,
    unique:true
  }
},{
  timestamps:true
});
export const Application = model("Application",ApplicationSchema);