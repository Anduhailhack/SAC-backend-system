const mongoose = require("mongoose");

// Student's Schema and Model
const studentSchema = new mongoose.Schema({
	stud_id: {
		type: String,
		required: [true, "Student ID cannot be set empty"],
	},
	f_name: String,
	l_name: String,
	// full_name: String,
	email: {
		type: String,
		required: [true, "Email cannot be empty"],
		unique: [true, "Email already registered"],
	},
	phone_no: {
		type: String,
		required: [true, "Phone No cannot be empty"],
	},
	telegram_id: {
		type: String,
		unique: [true, "Telegram ID already registered"]
	},
	ed_info: {
		batch: {
			type: String,
			// enum: ['PC1', 'PC2', 'C1', 'C2', 'intern']
		},
		department: String,
	},
	diagnosis: [{}, {}, {}],
});
studentSchema.pre('save', function(next){
	this.full_name = `${this.f_name} ${this.l_name}`
	next()
})

const Student = mongoose.model("Student", studentSchema);

// Admin's Schema and Model
const adminSchema = new mongoose.Schema({
	f_name: {
		type: String,
		required: [true, "First name cannot be empty"],
	},
	l_name: {
		type: String,
		required: [true, "Last name cannot be empty"],
	},
	email: {
		type: String,
		required: [true, "Email cannot be emoty"],
		unique: true
	},
	telegram_id: String,
	speciality: String,
	working_hour: String,
	communication: String,
	phone_no: {
		type: String,
		required: [true, "Admin Phone Number missing"],
	},
});
const Admin = mongoose.model("Admin", adminSchema);

// ServiceProvider's Schema and Model
const serviceProviderSchema = new mongoose.Schema({
	provider_id: {
		type: String,
		required: [true, "Student ID cannot be set empty"],
	},
	f_name: {
		type: String,
		required: [true, "First name cannot be empty"],
	},
	l_name: {
		type: String,
		required: [true, "Last name cannot be empty"],
	},
	email: {
		type: String,
		required: [true, "Email cannot be emoty"],
		unique: true
	},
	phone_no: {
		type: String,
		required: [true, "Phone No cannot be empty"],
	},
	telegram_id: {
		type: String,
		required: [true, "Telegram ID cannot be empty"],
		unique: true
	},
	educational_bkg: {
		type: String,
	},
	sp_team: {
		type: String,
		//
	},
	// Add Some Additional
	work_exp: {
		type: String,
	},
	office_location: String,
	availabile_at: {
		starting_time: {
			type: Date,
			//required: [true, "Starting time must be set"],
		},
		ending_time: {
			type: Date,
			//required: [true, "ending time must be set"],
		},
	},
});

serviceProviderSchema.pre('save', function(next){
	this.full_name = `${this.f_name} ${this.l_name}`
	next()
})
const ServiceProvider = mongoose.model('ServiceProvider', serviceProviderSchema)


// Request
const requestSchema = new mongoose.Schema({
	stud_id: {
		type: String,
		required: [true, "Request needs to have an ID"],
	},
	sp_team: {
		type: String,
		// required: [true, "Request team need to be stated"],
	},
	service_provider_id: {
		type: String,
		// required: [true, "Service Provider cannot be empty"],
	},
	issuedAt: {
		type: Date,
		default: Date.now
	},
	urgency: String,
	diagnosis : {
		code1 : {
			type : Boolean,
			required: [true, "Suicidal wasn't set"]
		},

		code2 : {
			type : Boolean,
			required: [true, "Homocidal wasn't set"]
		},

		code3 : {
			type : Boolean,
			required: [true, "Mood wasn't set"]
		},

		code4 : {
			type : Boolean,
			required: [true, "Mood wasn't set"]
		},

		code5 : {
			type : Boolean,
			required: [true, "Substance abuse wasn't set"]
		},

		remark : {
			type : String,
		}
	}
});
const Request = mongoose.model("Request", requestSchema);


// Appointment
const AppointmentSchema = new mongoose.Schema({
	student_id: {
		type: String,	// mongoose.Schema.ObjectId
		//required: [true, "An appointment must have the ID of the Student"]
	},
	request_id: {
		type: mongoose.Schema.ObjectId,
		ref: 'Request',
		//required: [true, "Request must be refered by the appointment"]
	},
	service_provider_id: {
		type: String,
		// required: [true, "An appointment must have the ID of the Service Provider"]
	},
	time: {
		type: Date,
		// required: [true, "Starting time must be specified"]
	},
	status: {
		type: String,
		enum: ["rejected", "pending", "Accepted"],
		default: "pending"
	},
	remark: String
})

AppointmentSchema.pre('save', async function(next){
	this.request = await Student.findById(this.request_id)
	// this.student = await Student.findOne({stud_id: this.student}).select("+stud_id +email +full_name")
	// this.serviceProvider = await ServiceProvider.findOne({provider_id: this.serviceProvider}).select("+provider_id +full_name")
})
const Appointment = mongoose.model("Appointment", AppointmentSchema)

// Payment
const PaymentSchema = new mongoose.Schema({
	first_name: String,
	last_name: String,
	email: String,
	currency: { 
		type: String,
		enum: ["ETB", "USD"]
	},
	amount: { 
		type: Number
	},
	charge: {
		type: Number,
	},
	status: {
		type: String,
		enum: ["success", "pending", "failed"]
	}, 
	reference: {
		type: String
	},
	created_at: {
		type: String
	}, 
	type: String,
	tx_ref: String,
	payment_method: String,
	customization: {
		title: String,
		description: String,
	}

})

const Payment = mongoose.model("Payment", PaymentSchema)

module.exports = {Student, ServiceProvider, Admin, Request, Appointment, Payment}