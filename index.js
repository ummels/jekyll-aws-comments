var Comments = require('./comments.js');
var config = require('./config.json');

exports.handler = function(event, context, callback) {
  try {
    var comments = new Comments(config);
    comments.submit(event)
    .then(function(url) {
      callback(null, url);
    })
    .catch(function(err) {
      callback(err);
    });
  } catch(err) {
    callback(err);
  }
}
