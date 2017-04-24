var Comments = require('./comments.js');
var config = require('./config.json');

exports.handler = function(event, context, callback) {
  try {
    var comments = new Comments(config);
    comments.submit(event)
    .then(function(url) {
      callback(null, url);
    })
    .catch(function(e) {
      console.error(e);
      callback('Server Error');
    });
  } catch(e) {
    console.error(e);
    callback('Bad Request');
  }
}
