var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.render('help', { title: 'Lightcycles - Help' });
});

module.exports = router;