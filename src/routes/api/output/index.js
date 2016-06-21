var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
  res.send('output');
});

module.exports = router;