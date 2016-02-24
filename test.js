var Comments = require('./comments.js');
var config = require('./config.json');
var event = require('./test_event.json');
var comments = new Comments(config);
comments.submit(event)
