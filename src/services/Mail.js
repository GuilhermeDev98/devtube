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
        await transporter.sendMail({
            from: this.from, // sender address
            to: this.to, // list of receivers
            subject: this.subject, // Subject line
            html: this.html, // plain text body
          });

        console.log("Message sent: %s", info.messageId);
    }

    conf(){
        return nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "b06f59aaf09624",
                pass: "677b45ee5e4365"
            }
          });
    }
}

module.exports = Mail