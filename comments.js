var Octokat = require('octokat');
var moment = require('moment');
var md5 = require('js-md5');
var config = require('./config.json');
var octo = new Octokat(config.credentials);
var repo = octo.repos(config.owner, config.repo);

exports.submit = function(event) {
  var date = moment.utc();
  var email = event.email.trim().toLowerCase();
  var homepage = parseUrl(event.url.trim());
  var name = event.name.trim();
  var content = pack(event.postId, date, name, homepage, email, event.comment.trim());
  var commentId = date.format('YYYYMMDDTHHmmss');
  var branch = 'comment-' + commentId;
  
  return repo.git.refs.heads('master').fetch()
  .then(function(ref) { // Crete new comment branch
    return repo.git.refs.create({
      ref: 'refs/heads/' + branch,
      sha: ref.object.sha
    });
  })
  .then(function() { // Commit comment file
    return repo.contents('_comments/' + commentId + '.md').add({
      message: 'Add comment',
      content: new Buffer(content, 'utf8').toString('base64'),
      branch: branch
    });
  })
  .then(function () { // Create pull request
    return repo.pulls.create({
      title: 'New comment',
      body: name + ' commented on \'' + event.postId + '\'.',
      head: branch,
      base: 'master'
    });
  })
  .then(function (pull) {
    return pull.htmlUrl;
  });
};

function pack(postId, date, name, homepage, email, comment) {
  return '---\n' +
    'post_id: ' + postId + '\n' +
    'date: ' +  date.toISOString() + '\n' +
    'name: ' + name + '\n' +
    'homepage: ' + homepage + '\n' +
    'mail_hash: ' + md5(email) + '\n' +
    '---\n\n' +
    comment + '\n';
}

function parseUrl(url) {
  if (!url) {
    return "";
  } else {
    if (url.toLowerCase().substring(0, 4) === 'http')
      return url;
    else
      return 'http://' + url;
  }
}
