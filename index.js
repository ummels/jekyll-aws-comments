const Comments = require('./comments.js');
const config = require('./config.json');
const util = require('util');

exports.handler = function(event, context, callback) {
  try {
    console.log('Config: ' + util.inspect(config, { depth: 0 }));
    const comments = new Comments(config);
    console.log('Event: ' + util.inspect(event));
    console.log('Connecting to GitHub...');
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
