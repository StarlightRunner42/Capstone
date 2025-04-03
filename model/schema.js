const mongoose = require('mongoose');

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

const Barangay = mongoose.model('Barangay', BarangaySchema);

module.exports = Barangay;
