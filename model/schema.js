const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Staff'], required: true }
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

const User = mongoose.model('User', UserSchema);
const Barangay = mongoose.model('Barangay', BarangaySchema);

module.exports = { User, Barangay };
