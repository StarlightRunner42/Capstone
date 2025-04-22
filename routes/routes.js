const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");
const {requireAuth} = require('../middleware/authMiddleware')

router.get('/', (req, res) => {
    res.render('auth');
});

router.get('/register', (req, res) => {
    res.render('register');
});

router.get('/index', requireAuth,(req, res) => {
    res.render('index-1');
});

router.get('/index-staff',requireAuth,(req, res) => {
    res.render('dashboard-staff');
});

router.get('/Baranggay', requireAuth,(req, res) => {
    res.render('dashboard-crm');
});

router.get('/Analytics', requireAuth,(req, res) => {
    res.render('dashboard-analytics');
});

router.post('/create-user',controller.createUser);
router.post('/login',controller.login);
router.get('/logout',controller.logout);

router.post('/add-data',controller.createResident);
module.exports = router; 