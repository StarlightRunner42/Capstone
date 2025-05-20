require("dotenv").config(); 
const mongoose = require("mongoose");
const express = require('express');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const session = require('express-session');
const { User,SeniorCitizen,Barangay ,PWD,Youth } = require("../model/schema");




exports.createUser = async (req, res) => {
    try {
        const { name, email, password, confirm_password, role } = req.body;

        console.log(name, email, password, confirm_password, role);
        if (!name || !email || !password || !confirm_password || role=="user") {
            return res.status(400).json({ 
                success: false,
                error: "All fields are required" 
            });
        }
     

        if (password !== confirm_password) {
            return res.status(400).json({ 
                success: false,
                error: "Passwords do not match" 
            });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ 
                success: false,
                error: "Email already exists" 
            });
        }

        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, saltrounds);

        const newUser = new User({ 
            name, 
            email, 
            password: hashedPassword, // Store the hashed password
            role,
            status: "Active" // Default status
        });
        
        await newUser.save();

        // For security, don't return the hashed password in the response
        const userToReturn = { ...newUser._doc };
        delete userToReturn.password;

        res.status(201).json({ 
            success: true,
            message: "User created successfully", 
            user: userToReturn 
        });
    } catch (err) {
        res.status(400).json({ 
            success: false,
            error: err.message 
        });
    }
};

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "All fields are required",
        });
      }
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }
  
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }
  
      // Store user data in session (excluding password)
      req.session.user = {
        _id: user._id,
        email: user.email,
        role: user.role,  // Ensure 'role' exists in your database
    };
    
      // Successful login response
      if (user.role === "Admin") {
        return res.redirect("/index");
    } else if (user.role === "Staff") {
        return res.redirect("/Pwd-form");
    }else if (user.role === "Super Admin") {
        return res.redirect("/index-superadmin");
    }else if (user.role === "Youth") {
        return res.redirect("/index-youth");
    }else {
        return res.redirect("/index"); // Default redirection
    }
  
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
}

exports.logout = (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destruction error:', err);
        return res.redirect('/'); // Still redirect to root even on error
      }
      res.clearCookie('connect.sid'); // Clear the session cookie
      res.redirect('/'); // Explicit redirect to homepage
    });
  };


  //senior citizen form
  exports.createResident = async (req, res) => {
    console.log('Raw body:', req.body);
  
    try {
      const body = req.body;
  
      // Handle skill_other_text safely
      const skillOtherText = Array.isArray(body.education_hr_profile?.skill_other_text)
        ? body.education_hr_profile.skill_other_text.find(text => text && text.trim() !== '')
        : body.education_hr_profile?.skill_other_text;
  
      const residentData = {
        identifying_information: {
          name: {
            first_name: body.identifying_information?.name?.first_name,
            middle_name: body.identifying_information?.name?.middle_name,
            last_name: body.identifying_information?.name?.last_name
          },
          address: {
            barangay: body.identifying_information?.address?.barangay,
            purok: body.identifying_information?.address?.purok
          },
          date_of_birth: body.identifying_information?.date_of_birth,
          age: parseInt(body.identifying_information?.age) || 0,
          place_of_birth: Array.isArray(body.identifying_information?.place_of_birth)
            ? body.identifying_information.place_of_birth.filter(Boolean)
            : [body.identifying_information?.place_of_birth].filter(Boolean),
          marital_status: body.identifying_information?.marital_status,
          gender: body.identifying_information?.gender,
          contacts: Array.isArray(body.identifying_information?.contacts)
            ? body.identifying_information.contacts.filter(c => c?.name)
            : [],
          osca_id_number: body.identifying_information?.osca_id_number,
          gsis_sss: body.identifying_information?.gsis_sss,
          philhealth: body.identifying_information?.philhealth,
          sc_association_org_id_no: body.identifying_information?.sc_association_org_id_no,
          tin: body.identifying_information?.tin,
          other_govt_id: body.identifying_information?.other_govt_id,
          service_business_employment: body.identifying_information?.service_business_employment,
          current_pension: body.identifying_information?.current_pension,
          capability_to_travel: body.identifying_information?.capability_to_travel === 'Yes' ? 'Yes' : 'No'
        },
        family_composition: {
          spouse: {
            name: body.family_composition?.spouse?.name || undefined
          },
          father: {
            last_name: body.family_composition?.father?.last_name,
            first_name: body.family_composition?.father?.first_name,
            middle_name: body.family_composition?.father?.middle_name,
            extension: body.family_composition?.father?.extension || undefined
          },
          mother: {
            last_name: body.family_composition?.mother?.last_name,
            first_name: body.family_composition?.mother?.first_name,
            middle_name: body.family_composition?.mother?.middle_name
          },
          children: Array.isArray(body.family_composition?.children)
            ? body.family_composition.children
                .map(child => ({
                  full_name: child?.full_name || undefined,
                  occupation: child?.occupation || undefined,
                  age: parseInt(child?.age) || undefined,
                  working_status: child?.working_status || undefined,
                  income: child?.income || undefined
                }))
                .filter(child => child.full_name)
            : []
        },
        education_hr_profile: {
          educational_attainment: Array.isArray(body.education_hr_profile?.educational_attainment)
            ? body.education_hr_profile.educational_attainment.filter(Boolean)
            : [body.education_hr_profile?.educational_attainment].filter(Boolean),
          skills: Array.isArray(body.education_hr_profile?.skills)
            ? body.education_hr_profile.skills.filter(Boolean)
            : [],
          skill_other_text: skillOtherText || undefined
        }
      };
  
      const newResident = new SeniorCitizen(residentData);
      const savedResident = await newResident.save();
  
      res.status(201).json({
        success: true,
        alert: {
          title: 'Success!',
          text: 'Senior citizen record created successfully',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000
        },
        data: savedResident,
        reference_code: savedResident.reference_code
      });
  
    } catch (error) {
      console.error('Error creating resident:', error);
  
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          alert: {
            title: 'Validation Error',
            text: 'Please check your input fields',
            icon: 'error',
            showConfirmButton: true
          },
          errors
        });
      }
  
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          alert: {
            title: 'Duplicate Entry',
            text: `The ${field} already exists in our records`,
            icon: 'error',
            showConfirmButton: true
          },
          field,
          value: error.keyValue[field]
        });
      }
  
      res.status(500).json({
        success: false,
        alert: {
          title: 'Error',
          text: 'An unexpected error occurred',
          icon: 'error',
          showConfirmButton: true
        },
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    }
  };


exports.registerPwd = async (req, res) => {
  try {
    console.log('Raw body:', req.body);

    // Transform the raw data to match your schema
    const pwdData = {
      first_name: req.body.first_name,
      middle_name: req.body.middle_name,
      last_name: req.body.last_name,
      barangay: req.body.barangay,
      purok: req.body.purok,
      birthday: new Date(req.body.birthday), // Convert string to Date
      age: parseInt(req.body.age), // Ensure age is a number
      gender: req.body.gender,
      place_of_birth: req.body.place_of_birth,
      civil_status: req.body.civil_status,
      spouse_name: req.body.spouse_name,
      contacts: req.body.contacts,
      fatherLastName: req.body.fatherLastName,
      fatherFirstName: req.body.fatherFirstName,
      fatherMiddleName: req.body.fatherMiddleName,
      fatherExtension: req.body.fatherExtension,
      motherLastName: req.body.motherLastName,
      motherFirstName: req.body.motherFirstName,
      motherMiddleName: req.body.motherMiddleName,
      sss_id: req.body.sss_id,
      gsis_sss_no: req.body.gsis_sss_no,
      psn_no: req.body.psn_no,
      philhealth_no: req.body.philhealth_no,
      education_level: req.body.education_level,
      employment_status: req.body.employment_status,
      employment_category: req.body.employment_category,
      employment_type: req.body.employment_type,
      disability: req.body.disability,
      disability_other_text: req.body.disability_other_text,
      cause_disability: req.body.cause_disability,
      cause_other_text: req.body.cause_other_text
    };

    // Create new PWD document
    const newPwd = new PWD(pwdData);
    
    // Save to database
    const savedPwd = await newPwd.save();

    // Return success response
    res.status(201).json({
      success: true,
      message: 'PWD registration successful',
      data: savedPwd
    });

  } catch (err) {
    console.error('Registration error:', err);

    // Handle validation errors specifically
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(el => el.message);
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    // Handle duplicate key errors (if you added unique constraints)
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate key error',
        field: Object.keys(err.keyPattern)[0],
        error: `This ${Object.keys(err.keyPattern)[0]} is already registered`
      });
    }

    // Generic error handler
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: err.message
    });
  }
};
  
// Fetch barangays and their puroks from the database
async function fetchBarangays() {
  const barangayList = await Barangay.find({});

  if (!barangayList || barangayList.length === 0) {
    return null;
  }

  const puroks = {};
  barangayList.forEach(({ barangay, puroks: purokList }) => {
    puroks[barangay] = purokList;
  });

  return puroks;
}

exports.renderSeniorForm = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    const seniorCitizens = await SeniorCitizen.find({});

    if (!seniorCitizens) {
      return res.status(404).send('No barangays found');
    }

    if (!barangays) {
      return res.status(404).send('No barangays found');
    }

    // Pass the barangays data to the EJS template
    res.render('staff/staff_senior', {
      barangays: barangays || {},
      seniorCitizens: seniorCitizens || {}
    });
  } catch (err) {
    console.error('Error fetching barangays:', err);
    res.status(500).send('Internal Server Error');
  }
  };

  exports.renderPWDForm = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    const pwd = await PWD.find({});

 
    // Pass the barangays data to the EJS template
    res.render('staff/staff_pwd', {
      barangays: barangays || {},
      pwds: pwd || {}
    });
  } catch (err) {
    console.error('Error fetching barangays:', err);
    res.status(500).send('Internal Server Error');
  }
  };

  exports.renderAddSenior = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    
    if (!barangays) {
      return res.status(404).send('No barangays found');
    }
  
    // Pass the barangays data to the EJS template
    
    res.render('staff/staff_addSenior', {
      barangays: barangays || {},
    });
  } catch (err) {
    console.error('Error fetching barangays:', err);
    res.status(500).send('Internal Server Error');
  }
  };

   exports.renderAddPWD = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    // if (!barangays) {
    //   return res.status(404).send('No barangays found');
    // }
  
    // Pass the barangays data to the EJS template
   
    res.render('staff/staff_addPwd', {
      barangays: barangays || {}
    });
  } catch (err) {
    console.error('Error fetching barangays:', err);
    res.status(500).send('Internal Server Error');
  }
  };

   exports.renderSuperAdminUser = async (req, res) => {
 try {
   const users = await User.find({});
    if (!users) {
      //to change
      console.log('No users found');
    }
  
    // Pass the barangays data to the EJS template
   
    res.render('superadmin/superadmin_users', {
      users: users || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  };

   exports.renderSuperAdminIndex = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    
    // if (!barangays) {
    //   return res.status(404).send('No barangays found');
    // }
  
    // Pass the barangays data to the EJS template
   
    res.render('superadmin/admin_super_admin', {
      barangays: barangays || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  };

    exports.renderYouthForm = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    
    // if (!barangays) {
    //   return res.status(404).send('No barangays found');
    // }
  
    // Pass the barangays data to the EJS template
   
    res.render('youth/staff_youth_add', {
      barangays: barangays || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  };
  
exports.renderSuperAdminIndex = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    
    if (!barangays) {
      return res.status(404).send('No barangays found');
    }
  
    // Pass the barangays data to the EJS template
   
    res.render('superadmin/admin_super_admin', {
      barangays: barangays || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  };

exports.renderYouth = async (req, res) => {
 try {
    const barangays = await fetchBarangays();
    const youthData = await Youth.find({});

    console.log(youthData);
    // if (!barangays) {
    //   return res.status(404).send('No barangays found');
    // }
  
    // Pass the barangays data to the EJS template
   
    res.render('youth/staff_youth', {
      barangays: barangays || {},
      youths: youthData || {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
  };



exports.createYouth = async (req, res) => {
  try {
    console.log('Raw body:', req.body);

    // Destructure req.body
    const {
      first_name,
      middle_name,
      last_name,
      barangay,
      purok,
      contact,
      birthday,
      age,
      gender,
      place_of_birth,
      education_level,
      registered_sk,
      voted_sk,
      registered_national,
      employment_status,
      employment_category,
      employment_type,
      Assembly,
      sk_times,
      reason,
      youth_classification,
      youth_other_text,
      youth_age_group,
      age_other_text
    } = req.body;

    // Create new Youth document
    const newYouth = new Youth({
      first_name,
      middle_name,
      last_name,
      barangay,
      purok,
      contact,
      birthday: new Date(birthday), // ensure Date type
      age: parseInt(age, 10), // ensure Number type
      gender,
      place_of_birth,
      education_level,
      registered_sk,
      voted_sk,
      registered_national,
      employment_status,
      employment_category: employment_category || null,
      employment_type: employment_type || null,
      Assembly,
      sk_times: sk_times || null,
      reason: reason || null,
      youth_classification,
      youth_classification_other: youth_other_text || null,
      youth_age_group,
      youth_age_group_other: age_other_text || null,
    });

    // Save to database
    const savedYouth = await newYouth.save();

    res.status(201).json({
      message: 'Youth record created successfully',
      data: savedYouth
    });
  } catch (err) {
    console.error(err);

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation Error',
        errors: err.errors
      });
    }

    res.status(500).send('Internal Server Error');
  }
};



