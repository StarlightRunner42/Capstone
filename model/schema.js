const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Admin', 'Staff','Encoder'], required: true }
});

const BarangaySchema = new mongoose.Schema({
    barangay: { type: String, required: true },
    puroks: [{ type: String, required: true }]
});

const SeniorCitizenSchema = new mongoose.Schema({
    reference_code: { type: String },
  
    identifying_information: {
      name: {
        last_name: { type: String, required: true },
        first_name: { type: String, required: true },
        middle_name: { type: String },
        extension: { type: String }
      },
      address: {
        barangay: { 
          type: String, 
          required: true,
          enum: [
            'Barangay 1', 
            'Barangay 2', 
            'Barangay 3', 
            'Barangay 4', 
            'Barangay 5', 
            'Barangay Mambulac', 
            'Barangay Guinhalaran', 
            'Barangay E-Lopez',
            'Barangay Bagtic', 
            'Barangay Balaring', 
            'Barangay Hawaiian',
            'Barangay Patag', 
            'Barangay Kapt.ramon', 
            'Barangay Guimbalaon',
            'Barangay Rizal', 
            'Barangay Lantad'
          ]
        },
        purok: { type: String, required: true }
      },
      date_of_birth: { type: Date }, // Will be populated from birthday field
      age: { type: Number, required: true },
      place_of_birth: { type: [String] }, // Array to match form field
      marital_status: { 
        type: String, 
        required: true,
        enum: [
          'Single but Head of the Family',
          'Single',
          'Married',
          'Widowed',
          'Separated',
          'Divorced'
        ]
      },
      gender: { 
        type: String, 
        required: true,
        enum: ['Male', 'Female', 'Other', 'Prefer not to say'] 
      },
      contacts: [{
        type: { 
          type: String, 
          enum: ['primary', 'secondary', 'emergency'],
          required: true
        },
        name: { type: String, required: true },
        relationship: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String }
      }],
      osca_id_number: { type: String }, // Matches osca_id
      gsis_sss: { type: String },      // Matches gsis_sss_no
      philhealth: { type: String },    // Matches philhealth_no
      sc_association_org_id_no: { type: String }, // Matches sc_association_id
      tin: { type: String },           // Matches tin_no
      other_govt_id: { type: String },
      service_business_employment: { type: String }, // Matches service
      current_pension: { type: String },  // Matches pension
      capability_to_travel: { // Added to match your form
        type: String,
        enum: ['Yes', 'No']
      }
    },
  
    family_composition: {
      spouse: {
        name: { type: String }  // Matches spouse_name
      },
      father: {
        last_name: { type: String },
        first_name: { type: String },
        middle_name: { type: String },
        extension: { type: String }
      },
      mother: {
        last_name: { type: String },
        first_name: { type: String },
        middle_name: { type: String }
      },
      children: [{
        full_name: { type: String },
        occupation: { type: String },
        income: { type: String },  // String to handle empty values
        age: { type: Number },
        working_status: { 
          type: String,
          enum: ['working', 'not_working', 'studying'] 
        }
      }]
    },
  
    education_hr_profile: {
      educational_attainment: {
        type: [String],
        enum: [
          'Yes', // To handle your form's initial value
          'No',
          'Elementary Level', 
          'Elementary Graduate',
          'High School Level', 
          'High School Graduate',
          'College Level', 
          'College Graduate',
          'Post Graduate', 
          'Vocational', 
          'Not Attended School'
        ]
      },
      skills: [{
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
          'Sapatero', // Added to match your form
          'Other' // For the "Others" checkbox
        ]
      }],
      skill_other_text: { type: String }  // For "Others, specify" field
    }
  }, { timestamps: true });
  
  // Middleware to clean data before saving
  SeniorCitizenSchema.pre('save', function(next) {
    // Clean education_level array
    if (this.education_hr_profile?.educational_attainment) {
      this.education_hr_profile.educational_attainment = 
        this.education_hr_profile.educational_attainment
          .filter(val => val !== 'Yes' && val !== 'No');
    }
    
    // Handle "Other" skills
    if (this.education_hr_profile?.skills?.includes('Other') && 
        this.education_hr_profile?.skill_other_text) {
      this.education_hr_profile.skills = this.education_hr_profile.skills
        .filter(skill => skill !== 'Other');
      this.education_hr_profile.skills.push(this.education_hr_profile.skill_other_text);
    }
    
    // Convert birthday string to Date if needed
    if (this.identifying_information?.date_of_birth && 
        typeof this.identifying_information.date_of_birth === 'string') {
      this.identifying_information.date_of_birth = new Date(this.identifying_information.date_of_birth);
    }
    
    next();
  });

  const pwdRegistrationSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  middle_name: { type: String },
  last_name: { type: String, required: true },

  barangay: { type: String, required: true },
  purok: { type: String, required: true },

  birthday: { type: Date, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other', 'Prefer not to say'], required: true },

  place_of_birth: { type: String, required: true },
  civil_status: { type: String, enum: ['Single but Head of the Family', 'Single', 'Married'], required: true },
  spouse_name: { type: String },

  // 👇 Embedded contacts directly
  contacts: [
    {
      type: { type: String, enum: ['primary', 'secondary', 'emergency'], required: true },
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String }
    }
  ],

  fatherLastName: { type: String },
  fatherFirstName: { type: String },
  fatherMiddleName: { type: String },
  fatherExtension: { type: String },

  motherLastName: { type: String },
  motherFirstName: { type: String },
  motherMiddleName: { type: String },

  sss_id: { type: String, required: true },
  gsis_sss_no: { type: String, required: true },
  psn_no: { type: String, required: true },
  philhealth_no: { type: String, required: true },

  education_level: {
    type: String,
    enum: [
      'Elementary Level',
      'Elementary Graduate',
      'High School Graduate',
      'College Level',
      'College Graduate',
      'Post Graduate',
      'Vocational',
      'Not Attended School'
    ],
    required: true
  },
  employment_status: {
    type: String,
    enum: ['Employee', 'Unemployed', 'Self-employed'],
    required: true
  },
  employment_category: { type: String, enum: ['Government', 'Private'], default: null },
  employment_type: {
    type: String,
    enum: ['Permanent/Regular', 'Seasonal', 'Casual', 'Emergency'],
    default: null
  },

 disability: [String], // e.g. ['Hearing', 'Autism']
  disability_other_text: String, // For storing custom input if "Other" is selected

  cause_disability: [String], // e.g. ['Accident']
  cause_other_text: String, // For storing custom input if "Other" is selected
});


const User = mongoose.model('User', UserSchema);
const SeniorCitizen  = mongoose.model('SeniorCitizen', SeniorCitizenSchema);
const Barangay = mongoose.model('Barangay', BarangaySchema);
const PWD = mongoose.model('PWD', pwdRegistrationSchema);


module.exports = { User,SeniorCitizen ,Barangay,PWD };
