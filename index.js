var Comments = require('./comments.js');
var config = require('./config.json');

exports.handler = function(event, context) {
  try {
    var comments = new Comments(config);
    comments.submit(event)
    .then(function(url) {
      context.succeed(url);
    })
    .catch(function(err) {
      context.fail('Server error');
    });
  } catch(err) {
    context.fail('Bad request');
  }
}
