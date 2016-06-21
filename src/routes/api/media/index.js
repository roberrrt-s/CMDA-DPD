var express = require('express'),
    router = express.Router();

router.get('/', function (req, res) {
  res.send('media');
});

module.exports = router;