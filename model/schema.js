const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Staff','Encoder'], required: true }
});

const PurokSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true }
    },
    leader: { type: String },
});

const BarangaySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    puroks: [PurokSchema] // Array of puroks inside a barangay
});

const residentSchema = new mongoose.Schema({
  // Personal Information
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: String,
  birthdate: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female'], required: true },
  barangay: { type: String, required: true },
  purok: { type: String, required: true },
  
  // Contact Information
  contactNumber: String,
  email: String,
  emergencyContact: String,
  emergencyContactName: String,
  relationship: String,
  
  // Special Categories
  status: [{ type: String, enum: ['pwd', 'senior', 'indigent'] }],
  pwdDetails: {
    idNumber: String,
    disabilityType: String,
    accommodationNeeds: String
  },
  seniorDetails: {
    idNumber: String,
    pensioner: { type: String, enum: ['yes', 'no'] },
    livingArrangement: String
  },
  
  // Medical Information
  medicalConditions: String,
  healthInsurance: String,
  bloodType: String,
  medications: String,
  
  // Metadata
  registrationDate: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now }
});

// Update lastUpdated timestamp before saving
residentSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const User = mongoose.model('User', UserSchema);
const Barangay = mongoose.model('Barangay', BarangaySchema);
const Resident = mongoose.model('Resident', residentSchema);



module.exports = { User, Barangay,Resident };
