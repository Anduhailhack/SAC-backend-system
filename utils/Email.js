const validator = require("validator");
const nodemailer = require("nodemailer");

let sendEmail = (email, verification_code, callback) => {
	//TODO: configure nodemailer properly
	console.log(verification_code);
	// return callback(true)
	let transporter = nodemailer.createTransport({
		service: "gmail", //this used to work
		auth: {
			user: "endeshawtadese496@gmail.com",
			// pass: "crjpidclpmiberci",
		},
	});

	let contact = {
		from: "SAC wellness program <SAC@SAC.com>",
		subject: "SAC wellness system, verification code",
		to: email,
		//text: verification_code,
		html: "<h1><code>" + verification_code + "</code></h1>"
	};
	transporter
		.sendMail(contact)
		.then((result) => callback(true))
		.catch((error) => callback(true));

	// callback(true);
};

module.exports = { sendEmail, validator };
