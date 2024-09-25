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
  MinSalary: {
    type: Number,
    required: true,
  },
  MaxSalary: {
    type: Number,
    required: true,
  },
  Location: {
    type: String,
    required: true,
  },
  ApplicationLink: {
    type: String,
    required: true,
  },
  JobDescription: {
    type: [{}],
    required: true,
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
  CompanyBio: {
    type: [{}],
    required: true,
  },
});
export const Application = model("Application",ApplicationSchema);