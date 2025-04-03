const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");

router.get('/', (req, res) => {
    res.render('auth');
});

router.get('/index', (req, res) => {
    res.render('index-1');
});

router.get('/Baranggay', (req, res) => {
    res.render('dashboard-crm');
});

router.get('/Analytics', (req, res) => {
    res.render('dashboard-analytics');
});
module.exports = router; 