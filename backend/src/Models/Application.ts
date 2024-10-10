import mongoose from "mongoose";
const ApplicationSchema = new mongoose.Schema({
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
  },
 Applicants:[{
        ApplicantsID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        },
        status:{
          type:String,
          enum: ["Applied","Under Review","Interviewed", "Hired","Rejected","On Hold","Withdrawn","No Response"],
          default:"Applied"
        }
    }],

},{
  timestamps:true
});
export const Application = mongoose.model("Application",ApplicationSchema);
