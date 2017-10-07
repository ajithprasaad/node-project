const nodemailer = require('nodemailer')
const pug = require('pug')
const juice = require('juice')
const htmlToText = require('html-to-text')
const promisify = require('es6-promisify')

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
})

exports.send = async options => {
  const html = generateHTML(options.filename, options)
  const mailOptions = {
    from: 'Wes Bos <wesbos@gmail.com>',
    to: options.user.email,
    subject: options.subject,
    html,
    text: 'I love <strong>pizza</strong>'
  }

  const sendMail = promisify(transport.sendMail, transport)
  return sendMail(mailOptions)
}

const generateHTML = (filename, options = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/email/password-reset.pug`, options)
  const inlined = juice(html)
  return inlined
}
