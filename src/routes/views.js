const express = require('express');
const router = express.Router();


router.get('/', function(req,res) {
    res.render('home');
});

router.get('/feed', function(req,res) {
    res.render('feed');
});

router.get('/profile', function(req, res) {
    res.render('profile');
});

router.get('/questionnaire', function(req,res) {
    res.render('questionnaire');
});

router.get('/viewprofile', function(req,res) {
    res.render('viewPerson');
});


module.exports = router;