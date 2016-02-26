var Comments = require('./comments.js');
var config = require('./config.json');
var event = require('./test_event.json');
var comments = new Comments(config);
var url = comments.submit(event)
console.log(url);
