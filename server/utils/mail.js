var nodemailer = require('nodemailer');
var logger = require('./winston')(module);
var config = require('./nconf');
var HttpError = require('../middleware/HttpError').HttpError;

function mail(options, callback) {
  if (options.to === undefined) {
    return callback(new HttpError(400, null, "Не указан адресат письма!"));
  }

  var mailTransporter = nodemailer.createTransport(config.get('nodemailer:transport'));

  var subj = options.subject || ' Без темы!';
  var text = options.text || '';

  // TODO: API -текст письма нужно на русском
  // TODO: API -шаблоны писем https://github.com/nodemailer/nodemailer#using-templates
  // TODO:  -шаблон писема подтверждения сброса пароля https://github.com/nodemailer/nodemailer#using-templates
  var mailOptions = {
    to:      options.to,
    from:    config.get('nodemailer:mailOptions:from'),
    subject: 'LOFTOGRAM: ' + subj,
    text:    text
  };

  mailTransporter.sendMail(mailOptions, function (err, info) {
    if (typeof callback === 'function') {
      if (err) return callback(err);
      return callback(err, info);
    }

    return err ? false : true;
  });

}

exports = module.exports = mail;