var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
  res.send('api');
});

module.exports = router;