const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

function formatMessage1(username, text, text1) {
  return {
    username,
    text,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;
module.exports = formatMessage1;
