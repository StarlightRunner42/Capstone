const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Staff','Encoder'], required: true }
});

const SeniorCitizenSchema = new mongoose.Schema({
  reference_code: { type: String },

  identifying_information: {
      name: {
          last_name: { type: String },
          first_name: { type: String },
          middle_name: { type: String },
          extension: { type: String }
      },
      address: {
          barangay: { type: String },
          purok: { type: String },
      },
      date_of_birth: { type: Date },
      place_of_birth: { type: String },
      marital_status: { type: String },
      gender: { type: String },
      contact_number: { type: number },
      email_address: { type: String },
      religion: { type: String },
      ethnic_origin: { type: String },
      language_spoken_written: { type: String },
      osca_id_number: { type: String },
      gsis_sss: { type: String },
      philhealth: { type: String },
      sc_association_org_id_no: { type: String },
      tin: { type: String },
      other_govt_id: { type: String },
      capability_to_travel: { type: Boolean },
      service_business_employment: { type: String },
      current_pension: { type: String }
  },

  family_composition: {
      spouse: {
          last_name: { type: String },
          first_name: { type: String },
          middle_name: { type: String },
          extension: { type: String }
      },
      father: {
          last_name: { type: String },
          first_name: { type: String },
          middle_name: { type: String }
      },
      mother: {
          last_name: { type: String },
          first_name: { type: String },
          middle_name: { type: String }
      },
      children: [{
          full_name: { type: String },
          occupation: { type: String },
          income: { type: Number },
          age: { type: Number },
          working: { type: Boolean }
      }],
      other_dependents: { type: String }
  },

  education_hr_profile: {
    educational_attainment: {
        type: String,
        enum: [
            'Elementary Level', 'Elementary Graduate',
            'High School Level', 'High School Graduate',
            'College Level', 'College Graduate',
            'Post Graduate', 'Vocational', 'Not Attended School'
        ]
    },
    areas_of_specialization: [{
        type: String,
        enum: [
            'Medical',
            'Teaching',
            'Legal Services',
            'Dental',
            'Counseling',
            'Farming',
            'Fishing',
            'Cooking',
            'Arts',
            'Engineering',
            'Carpenter',
            'Plumber',
            'Barber',
            'Mason',
            'Sewing',
            'Evangelization',
            'Tailor',
            'Chef/Cook',
            'Millwright',
            'Others, specify'
        ]
    }],
    share_skills: [{ type: Number }],
    community_service_involvement: [{
        type: String,
        enum: [
            'Medical',
            'Resource Volunteer',
            'Community Beautification',
            'Community / Organization Leader',
            'Dental',
            'Friendly Visits',
            'Neighborhood Support Services',
            'Legal Services',
            'Religious',
            'Counseling / Referral',
            'Sponsorship',
            'Others, specify'
        ]
    }]
}
});

const User = mongoose.model('User', UserSchema);
const Senior = mongoose.model('SeniorCitizen', SeniorCitizenSchema);



module.exports = { User,Senior };
