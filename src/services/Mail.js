const nodemailer = require('nodemailer')

class Mail{
    constructor(from, to, subject, html){
        this.from = from
        this.to = to
        this.subject = subject
        this.html = html
    }

    async send(){
        const transporter = this.conf()
        const info = await transporter.sendMail({
            from: this.from, // sender address
            to: this.to, // list of receivers
            subject: this.subject, // Subject line
            html: this.html, // plain text body
          });

        console.log("Message sent: %s", info);
    }

    conf(){
        return nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
          });
    }
}

module.exports = Mail