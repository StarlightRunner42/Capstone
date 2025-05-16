const express = require('express');
const router = express.Router();
const controller = require("../controller/controller");
const { requireAuth } = require('../middleware/authMiddleware');

// Public routes
router.get('/', (req, res) => {
    res.render('auth');
});

router.get('/register', (req, res) => {
    res.render('register');
});

// Authentication routes
router.post('/create-user', controller.createUser);
router.post('/login', controller.login);
router.get('/logout', controller.logout);

// Admin routes
router.get('/Index', requireAuth, (req, res) => {
    res.render('admin/admin_index-1');
});

router.get('/superadmin', requireAuth, (req, res) => {
    res.render('admin/admin_super_admin');
});

router.get('/Admin', requireAuth, (req, res) => {
    res.render('admin/admin_super_admin');
});

router.get('/Map', requireAuth, (req, res) => {
    res.render('admin/admin_map');
});

router.get('/Analytics', requireAuth, (req, res) => {
    res.render('admin/admin_analytics');
});

router.get('/Dashboard', requireAuth,(req, res) => {
    res.render('admin/dashboard');
});

router.get('/User', requireAuth, (req, res) => {
    res.render('admin/admin_update');
});

router.get('/youth', requireAuth,(req, res) => {
    res.render('admin/admin_youth');
});


// Staff routes
router.get('/index-staff', requireAuth, (req, res) => {
    res.render('staff/staff_dashboard');
});



router.post('/register-pwd', controller.registerPwd);

router.get('/add_senior', controller.renderAddSenior);

router.get('/add_pwd', controller.renderAddPWD);



//Super admin 
router.get('/index-superadmin',requireAuth ,controller.renderSuperAdminIndex);

router.get('/superadmin-users',requireAuth ,controller.renderSuperAdminUser);


// Form routes (used by both staff and admin)
router.get('/Senior-form', requireAuth, controller.renderSeniorForm);

router.get('/Pwd-form', requireAuth, controller.renderPWDForm);

// Data operations
router.post('/add-data', controller.createResident);

module.exports = router;