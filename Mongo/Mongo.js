const mongoose = require("mongoose");
const { APISearchFeatures } = require("./APISearchFeatures");
const { Admin, ServiceProvider, Student, Request, Appointment } = require("./SchemaModels");
require("dotenv").config();

const MongoDb = function () {
	// Connection to the Database
	mongoose.connect("mongodb://0.0.0.0:27017/SAC_Wellness_System").then(() => {
		console.log("MongoDB Connection Successful");
	});
};

//function that adds a new Admin/Student/ServiceProvider/Request to the MongoDB and returns the result
MongoDb.prototype.addAdmin = async function (
	f_name,
	l_name,
	email,
	telegram_id,
	speciality,
	working_hour,
	communication,
	phone_no,
	callback
) {
	await Admin.create({
		f_name,
		l_name,
		email,
		telegram_id,
		speciality,
		working_hour,
		communication,
		phone_no,
	})
		.then((data) => {
			const ret = { status: true, result : {data: data} };
			callback(ret);
		})
		.catch((err) => {
			const ret = {status: false, msg: "Error while Inserting to Database", err: err}
			callback(ret);
		});
};

MongoDb.prototype.addStudent = async function (
	stud_id,
	f_name,
	l_name,
	email,
	phone_no,
	telegram_id,
	ed_info,
	diagnosis,
	callback
) {
	await Student.create({
		stud_id,
		f_name,
		l_name,
		email,
		phone_no,
		telegram_id,
		ed_info,
		diagnosis,
	})
	.then((data) => {
			const ret = { status: true, result : {data : data}};
			callback(ret);
		})
		.catch((err) => {
			const ret = {status: false, msg: "Error while Inserting to Database", err : err}
			callback(ret);
		});
};

MongoDb.prototype.addServiceProvider = async function (
	provider_id, f_name, l_name, email, phone_no, 
	telegram_id, educational_bkg, sp_team, speciality,
	office_location, available_at, callback
) {
	await ServiceProvider.create({
		provider_id, f_name, l_name, email, phone_no, 
		telegram_id, educational_bkg, sp_team, speciality,
		office_location, available_at
	})
		.then((data) => {
			const ret = { status: true, data : data };
			callback(ret);
		})
		.catch((err) => {
			const ret = {status: false, msg: "Error while Inserting to Database", err: err}
			callback(ret);
		});
};

MongoDb.prototype.addRequest = async function (
	stud_id,
	sp_team,
	service_provider_id,
	issuedAt,
	urgency,
	diagnosis,
	callback
) {
	
	await Request.create({
		stud_id,
		sp_team,
		service_provider_id,
		issuedAt,
		urgency,
		diagnosis
	})
		.then((data) => {
			const ret = { status: true, data : data };
			callback(ret);
		})
		.catch((err) => {
			const ret = {status: false, msg: "Error while Inserting to Database", err : err }
			callback(ret);
		});
};

MongoDb.prototype.setAppointment = async function (
	student_id,
	request_id, 
	service_provider_id, 
	time,
	remark,
	callback
) {
	await Appointment.create({
		student_id,
		request_id,  
		service_provider_id, 
		time,
		remark
	})
		.then((data) => {
			console.log(data);
			const ret = { status: true, ...data };
			callback(ret);
		})
		.catch((err) => {
			console.log("ERROrR",err)
			const ret = {status: false, msg: "Error while Inserting to Database", ...err}
			callback(ret);
		});
};

MongoDb.prototype.getServiceProviderTeam = async function (sp_team, callback) {
	try {
		await ServiceProvider.find({ sp_team }).then(result => {
			const ret = { status: true, result : result };
			callback(ret);
		}).catch(err => {
			const ret = { status: false, msg: err };
			callback(ret);
		})
	} catch (err) {
		const ret = { status: false, msg: err.message };
		callback(ret);
	}
}

//Functions that are used to find Admin/Student/ServiceProvider/Request from the MongoDB
MongoDb.prototype.getStudents = async function (reqQueryObj, callback) {
	try {
		const studQ = new APISearchFeatures(Student.find(), reqQueryObj)
			.filter()
			.sort()
			.fields()
			.page();
		const gettedStuds = await studQ.query;
		if(gettedStuds.length == 0){
			throw new Error("No Student Found with this Specification")
		}
		const ret = { status: true, result: gettedStuds };
		callback(ret);
	} catch (err) {
		const ret = { status: false, msg: err.message };
		callback(ret);
	}
}

MongoDb.prototype.getStudent = async function (stud_id, callback) {
	try {
		// console.log(stud_id)
		await Student.find({ telegram_id : stud_id }).then(result => {
			const ret = { status: true, result : result };			
			callback(ret);
		}).catch(err => {
			const ret = { status: false, msg: err };
			callback(ret);
		})
	} catch (err) {
		const ret = { status: false, msg: err.message };
		callback(ret);
	}
};

MongoDb.prototype.getServiceProviders = async function (reqQueryObj, callback) {
	try {
		const SP = new APISearchFeatures(ServiceProvider.find(), reqQueryObj)
			.filter()
			.sort()
			.fields()
			.page();
		const gettedSP = await SP.query;

		if(gettedSP.length == 0){
			throw new Error("No Service Provider Found with this Specification")
		}
		const ret = { status: true, result: gettedSP };
		callback(ret);
	} catch (err) {
		const ret = { status: false, msg: err.msg };
		callback(ret);
	}
};

MongoDb.prototype.getAdmins = async function (reqQueryObj, callback) {
	try {
		const AdminsQ = new APISearchFeatures(Admin.find(), reqQueryObj)
			.filter()
			.sort()
			.fields()
			.page();
		const gettedAdmins = await AdminsQ.query;

		if(gettedAdmins.length == 0){
			throw new Error("No Admin Found with this Specification")
		}
		const ret = { status: true, result: gettedAdmins };
		callback(ret);
	} catch (err) {
		const ret = { status: false, msg: err.message };
		callback(ret);
	}
};

MongoDb.prototype.getRequests = async function (reqQueryObj, callback) {
	try {
		if( reqQueryObj.stud_id==undefined 
			&& reqQueryObj.req_team_id==undefined 
			&& reqQueryObj.service_provider_id==undefined
			&& reqQueryObj.issuedAt==undefined) {
				reqQueryObj = {sort: '-issuedAt'}
		}
		if(reqQueryObj.issuedAt == undefined)
			reqQueryObj.sort = 'issuedAt'

		const requeQue = new APISearchFeatures(Request.find(), reqQueryObj)
			.filter()
			.sort()
			.fields()
			.page();
		const gettedRequests = await requeQue.query;

		//console.log(gettedRequests);

		if(gettedRequests.length == 0){
			throw new Error("No Request Found with this Specification")
		}
		const ret = { status: true, result: gettedRequests };
		callback(ret);
	} catch (err) {
		const ret = { status: false, msg: err.message, err};
		callback(ret);
	}
};

MongoDb.prototype.getAppointments = async function (reqQueryObj, callback){
	try {
		if( reqQueryObj.student_id == undefined 
			&& reqQueryObj.request_id == undefined 
			&& reqQueryObj.service_provider_id == undefined
			&& reqQueryObj.time == undefined 
			&& reqQueryObj.status == undefined) {
				reqQueryObj = {sort: 'time'}
			}

		const appoint = new APISearchFeatures(Appointment.find().populate('request_id'), reqQueryObj)
			.filter().sort().fields().page()
		const gettedAppoints = await appoint.query

		console.log(gettedAppoints);
		if(gettedAppoints.length == 0){
			throw new Error("No Appointment Found with this Specification")
		}
		const ret = { status: true, result: gettedAppoints};
		callback(ret);
	} catch (err) {
		const ret = { status: false, msg: err.message };
		callback(ret);
	}
};

MongoDb.prototype.getAppointment = async function (appointmentId, callback){
	const appoint = await Appointment.findById({appointmentId})

	if(appoint){
		const ret = {
			status: true,
			result: appoint
		}

		callback(ret);
	}else {
		const ret = {
			status: false,
			result: {
				data : {},
				msg : "Appointment not found."
			}
		}

		callback(ret);
	}
};

//==================== Check >>>>>>>>>>>>>>>>>>>>>>>>
MongoDb.prototype.checkAdmin = async function(email, callback){
    try {
        const user = await Admin.findOne({email})

        if(!user){
            const ret = {status: false, msg: `No Admin with this email ${email}`}
            callback(ret)
        } else {
            const ret = {status: true, _id: user._id, email: user.email}
            callback(ret)
        }
    } catch (error) {
        callback({status:false, ...error})

    }
}

MongoDb.prototype.checkServiceProvider = async function(email, callback){
	try {
		const user = await ServiceProvider.findOne({email})
        if(!user){
			const ret = {status: false, msg: `No Service Provider with this email ${email} was found.`}
            return callback(ret)
        } else {
			const ret = {status: true, _id: user._id, email: user.email}
            return callback(ret)
        }
    } catch (error) {
    	callback({status:false, msg: error.message})
    }
}

MongoDb.prototype.checkStudent = async function(email, callback){
    try {
        const user = await Student.findOne({email})

        if(!user){
            const ret = {status: false, msg: `No Stuednt with this email ${email} was found.`}
            return callback(ret)
        } else {
            const ret = {status: true, _id: user._id, email: user.email}
            callback(ret)
        }
    } catch (error) {
        callback({status:false, ...error})
    }
}

const db = new MongoDb();

module.exports = { db };