var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('credits', { title: 'Lightcycles - Credits' });
});

module.exports = router;