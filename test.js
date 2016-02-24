var index = require('./index.js');
var event = require('./test_event.json');

var context = {
  succeed: function(result) {
    console.log('Success with result:', JSON.stringify(result, null, 2));
    process.exit(0);
  },
  fail: function(err) {
    console.log('Failure with error:', err.toString());
    process.exit(1);
  },
  done: function(error, result) {
    if (error != null)
      this.fail(error);
    else
      this.succeed(result);
  },
  getRemainingTimeInMillis: function() {
    return Number.POSITIVE_INFINITY;
  }
}

index.handler(event, context);
