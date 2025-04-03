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

router.get('/Baranggay', (req, res) => {
    res.render('dashboard-crm');
});

router.get('/Analytics', (req, res) => {
    res.render('dashboard-analytics');
});

router.post('/create-user',controller.createUser);
router.post('/login',controller.login);
router.get('/logout',controller.logout);
module.exports = router; 