var comments = require('./comments.js');

exports.handler = function(event, context) {
  try {
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
