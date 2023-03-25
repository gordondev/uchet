const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivationMail(to, link) {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Активация аккаунта на " + process.env.API_URL,
      text: "",
      html: `
				<!DOCTYPE html>
				<html lang="en" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;width:100%;font-size:14px;line-height:1;-ms-text-size-adjust:100%;-moz-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:white;" >
				  <head style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" >
					 <meta charset="UTF-8" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" />
					 <meta http-equiv="X-UA-Compatible" content="IE=edge" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" />
					 <meta name="viewport" content="width=device-width, initial-scale=1.0" style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" />
					 <title style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" >Document</title>
					 <style style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" >
						* {
						  padding: 0;
						  margin: 0;
						  border: 0;
						}
						*,
						*:before,
						*:after {
						  -moz-box-sizing: border-box;
						  -webkit-box-sizing: border-box;
						  box-sizing: border-box;
						}
						:focus,
						:active {
						  outline: none;
						}
						a:focus,
						a:active {
						  outline: none;
						}
						nav,
						footer,
						header,
						aside {
						  display: block;
						}
						html,
						body {
						  height: 100%;
						  width: 100%;
						  font-size: 100%;
						  line-height: 1;
						  font-size: 14px;
						  -ms-text-size-adjust: 100%;
						  -moz-text-size-adjust: 100%;
						  -webkit-text-size-adjust: 100%;
						  color: white;
						}
						a,
						a:visited {
						  text-decoration: none;
						}
						a:hover {
						  text-decoration: none;
						}
						img {
						  vertical-align: top;
						}
						h1 {
						  font-size: inherit;
						  font-weight: 700;
						  font-size: 20px;
						  margin-bottom: 20px;
						  font-family: Arial, Helvetica, sans-serif;
						}
						p {
						  font-family: Arial, Helvetica, sans-serif;
						  font-size: 14px;
						  margin-bottom: 20px;
						}
						a {
						  display: inline-block;
						  text-align: center;
						  border: 1px solid rgb(255, 255, 255);
						  background-color: white;
						  color: rgb(81, 97, 187);
						  padding: 10px;
						  border-radius: 10px;
						  font-family: Arial, Helvetica, sans-serif;
						}
						table {
						  max-width: 600px;
						  width: 100%;
						}
						table,
						tr {
						  background-color: rgb(81, 97, 187);
						  padding: 20px;
						}
						span {
						  font-style: italic;
						}
					 </style>
				  </head>
				  <body style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;height:100%;width:100%;font-size:14px;line-height:1;-ms-text-size-adjust:100%;-moz-text-size-adjust:100%;-webkit-text-size-adjust:100%;color:white;" >
					 <table style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;max-width:600px;width:100%;background-color:rgb(81, 97, 187);padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px;" >
						<tr style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;background-color:rgb(81, 97, 187);padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px;" >
						  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" >
							 <h1 style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;font-size:20px;font-weight:700;margin-bottom:20px;font-family:Arial, Helvetica, sans-serif;" >Учет и анализ результатов наюлюдений за работой персонала</h1>
						  </td>
						</tr>
						<tr style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;background-color:rgb(81, 97, 187);padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px;" >
						  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" >
							 <p style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;font-family:Arial, Helvetica, sans-serif;font-size:14px;margin-bottom:20px;" >
								Ваш адрес электронной почты был указан как контактный при
								регистрации по адрессу - <span style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;font-style:italic;" >ссылка</span>
							 </p>
						  </td>
						</tr>
						<tr style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;background-color:rgb(81, 97, 187);padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px;" >
						  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" >
							 <p style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;font-family:Arial, Helvetica, sans-serif;font-size:14px;margin-bottom:20px;" >Если это были вы, то подтвердите почту, нажав на кнопку снизу</p>
						  </td>
						</tr>
						<tr style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;background-color:rgb(81, 97, 187);padding-top:20px;padding-bottom:20px;padding-right:20px;padding-left:20px;" >
						  <td style="padding-top:0;padding-bottom:0;padding-right:0;padding-left:0;margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;border-width:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;" >
							 <a href="${link}" style="margin-top:0;margin-bottom:0;margin-right:0;margin-left:0;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;box-sizing:border-box;text-decoration:none;display:inline-block;text-align:center;border-width:1px;border-style:solid;border-color:rgb(255, 255, 255);background-color:white;color:rgb(81, 97, 187);padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:10px;border-radius:10px;font-family:Arial, Helvetica, sans-serif;" >Подтвердить</a>
						  </td>
						</tr>
					 </table>
				  </body>
				</html>				
				`,
    });
  }
}

module.exports = new MailService();
