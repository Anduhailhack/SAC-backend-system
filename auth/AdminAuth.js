const jwt = require("jsonwebtoken");
require("dotenv").config();

const adminAuth = (req, res, next) => {
	try {
		const { token } = req.body.token ? req.body : req.cookies;

		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			if (
				err ||
				!decodedToken.hasOwnProperty("id") ||
				!decodedToken.hasOwnProperty("email") ||
				!decodedToken.hasOwnProperty("role") ||
				decodedToken.role !== process.env.ADMIN_ROLE
			) {
				res.status(403).json({
					status: "error",
					result: { msg: "Invalid token, please login again" },
				});
			} else {
				next();
			}
		});
	} catch (error) {
		res.status(400).json({ status: "error" });
	}
};

module.exports = { adminAuth };
