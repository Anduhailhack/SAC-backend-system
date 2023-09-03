const axios = require("axios")
const router = require("express").Router();
require("dotenv").config();

const {db} = require('../Mongo/Mongo')

router.get("/", (req, res) => {
	console.log(req);
	res.json("user working");
});


router.post("/addRequest", (req, res) => {	
	const stud_id = req.locals.id
	try {
		const { stud_id, sp_team, service_provider_id,  issuedAt, urgency, diagnosis, initData } = req.body;
		db.addRequest(stud_id, sp_team, service_provider_id,  issuedAt, urgency, diagnosis, result => {
			if(result.status){
				db.getServiceProviderTeam(sp_team, result => {
					if (result && result.status){
						
						// console.log("Emotional", result.result, result.status)	//Checked
						if (result && result.result && result.result.length && result.result.length <= 0)
						{
							// console.log(result)
							return res.status(401).json({ 
								status: "error", 
								result: {
									msg : "We don't have a team with that team id."
								}
							});
						}

						if (result && result.result && result.result.length && result.result.length >= 0)
						{
							db.getStudent(stud_id, stud_info => {
								axios.post( /*process.env.BASE_WEB_API*/ "http://127.0.0.1:3000" + "/sp/notify_student_request", {
									msg : "New student sent request.",
									telegram_id : result.result,
									stud_info : stud_info,
									diagnosis : diagnosis,
									initData
								}).then((response) => {
									// console.log(response)
								}).catch((error) => {
									console.log(error)
								})
							})
							
						}
					}
				})
				return res.status(200).json({ status: "success"});
			}else {
				return res.status(401).json({status : "error", result : {
					msg : "Error happened during puting data into database." + JSON.stringify(result.err)
				}})
			}
		});
	} catch (error) {
		console.log(error)
		res.status(400).json({ status: "error", result: error });
	}
});


router.get("/getAppointment", async (req, res) => {
	const { stud_id } = req.params;

	db.getAppointments(stud_id, (appointment) => {
		res.status(200).json({ status: "success", result: appointment });
	});
});

router.get("/getMedicalHealthTeam", async (req, res) => {

	db.getMedicalHealthTeam((medicalHealthTeam) => {
		res.status(200).json({ status: "success", result: medicalHealthTeam });
	});
});

router.get("/getMentalHealthTeam", async (req, res) => {

	db.getMentalHealthTeam((mentalHealthTeam) => {
		res.status(200).json({ status: "success", result: mentalHealthTeam });
	});
});

router.get("/getAvailableMedicalHealthTeam", async (req, res) => {

	db.getAvailableMedicalHealthTeam((availableMedicalHealthTeam) => {
		res.status(200).json({
			status: "success",
			result: availableMedicalHealthTeam,
		});
	});
});

router.get("/getAvailableMentalHealthTeam", async (req, res) => {

	db.getAvailableMentalHealthTeam((availableMentalHealthTeam) => {
		res.status(200).json({
			status: "success",
			result: availableMentalHealthTeam,
		});
	});
});

/**
 * all private wproperties below this!
 */

let _createToken = (email, user_id) => {
	return jwt.sign(
		{ id: user_id, email: email, role: process.env.USER_ROLE },
		process.env.JWT_SECRET,
		{
			expiresIn: "3h",
		}
	);
};

let _sendEmail = (email, verification_code, callback) => {
	//TODO: configure nodemailer properly

	let transporter = nodemailer.createTransport({
		host: "gmail", //this used to work
		auth: {
			user: "youremail@gmail.com",
			pass: "youremailpassword",
		},
	});

	let contact = {
		from: "SAC wellness program <SAC@SAC.com>",
		to: email,
		text: verification_code,
	};
	transporter
		.sendMail(contact)
		.then((result) => callback(true))
		.catch((error) => callback(false));
};

module.exports = router;
