const express = require('express')
const {Payment} = require('./../Mongo/SchemaModels')

const router = express.Router()

router.post("/chapaPay", (req, res) => {
	let {public_key, tx_ref, amount, currency, email, first_name, last_name, title, description, logo, callback_url, return_url, meta,phone_number} = req.body 

	var options = {
		'method': 'POST',
		'url': 'https://api.chapa.co/v1/transaction/initialize',
		'headers': {
			'Authorization': "Bearer " + process.env.CHAPA_SECRET_KEY,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			"public_key": public_key, 
			"amount": amount,
			"currency": "ETB",
			"email": email,
			"first_name": first_name,
			"last_name": last_name,
			"phone_number": phone_number || "0900112233",
			"tx_ref": tx_ref,
			"callback_url": callback_url,
			"return_url": return_url,
			"customization[title]": title,
			"customization[description]": description
	})
	};
		request(options, function (error, response) {
			if (error) {
				return res.status(400).json({
					status: "error",
					result: {
						msg: error.message
					}
				})
			}
		let result = JSON.parse(response.body)
			if(result.status == "success"){
				return res.status(200).json({
						status: true,
						result: {
							msg: result.message,
							data: result.data,
					}
				})
			} else {
				return res.status(400).json({
					status: false,
					result: {
						msg: result.message,
						data: result.data
					}
				})
			}

		})
})

router.post("/chapaWebhook", async (req, res)=> {

	const hash = crypto.createHmac('sha256', process.env.CHAPA_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex');

    if (hash == req.headers['x-chapa-signature']) {
    const event = req.body;
	try {
		console.log(event);
		await Payment.create(event)
	} catch (error) {
		console.log(error);
	}

    } 
    res.sendStatus(200);
})

router.get('/donations', async (req, res) => {
	const donations = await Payment.find({}).sort({createdAt: 1})

	res.status(201).json({
		status: true,
		result: {
			msg: "Donations",
			data: {
                donations
            }
		}
	})
})


module.exports = router