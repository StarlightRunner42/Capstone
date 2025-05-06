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

router.get('/Index', requireAuth,(req, res) => {
    res.render('admin/admin_index-1');
});

router.get('/index-staff',requireAuth,(req, res) => {
    res.render('staff/staff_dashboard');
});

router.get('/Map', requireAuth,(req, res) => {
    res.render('admin/admin_map');
});

router.get('/Analytics', requireAuth,(req, res) => {
    res.render('admin/admin_analytics');
});

router.get('/Senior-form', requireAuth,(req, res) => {
    res.render('staff/staff_senior');
});

router.get('/add_senior',(req, res) => {
    res.render('staff/staff_addSenior'); 
});

router.get('/add_pwd',(req, res) => {
    res.render('staff/staff_addPwd'); /* add pwd-form */
});

router.get('/Pwd-form', requireAuth,(req, res) => {
    res.render('staff/staff_pwd');
});

router.get('/Admin', requireAuth,(req, res) => {
    res.render('admin/admin_super_admin');
});







router.post('/create-user',controller.createUser);
router.post('/login',controller.login);
router.get('/logout',controller.logout);

//adding senior to database
router.post('/add-data',controller.createResident);
module.exports = router; 