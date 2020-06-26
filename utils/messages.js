const moment = require('moment');



function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
    

  };

}

function formatMessage3(username, text, color, flag, tag) {
  return {
    username,
    text,
    time: moment().format('h:mm a'),
    color,
    flag,
    tag
    

  };

}



module.exports = {formatMessage,formatMessage3} ;



