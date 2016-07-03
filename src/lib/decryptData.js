// Unused but mandatory, a way to decrypt passwords.

var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'nerds';

var decrypt = function(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports = decrypt;