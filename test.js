var index = require('./index.js');
var event = require('./test_event.json');

index.handler(event, null, ((err, res) => {
  if (err === null) {
    console.log('==> ' + res);
  } else {
    console.error('==> ' + err);
  }
}));
