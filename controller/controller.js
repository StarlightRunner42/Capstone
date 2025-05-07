require("dotenv").config(); 
const mongoose = require("mongoose");
const express = require('express');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const session = require('express-session');
const { User,SeniorCitizen  } = require("../model/schema");

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
            role 
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
        return res.redirect("/index-staff");
    }else if (user.role === "Super Admin") {
        return res.redirect("/index-superadmin");
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


  exports.createResident = async (req, res) => {
    console.log('Raw body:', req.body);
    
    try {
      // Process skill_other_text to handle array case
      const skillOtherText = Array.isArray(req.body.skill_other_text) 
        ? req.body.skill_other_text.find(text => text && text.trim() !== '') // Get first non-empty
        : req.body.skill_other_text;

      // Transform the form data to match the schema structure
      const residentData = {
        identifying_information: {
          name: {
            first_name: req.body.first_name,
            middle_name: req.body.middle_name,
            last_name: req.body.last_name
          },
          address: {
            barangay: req.body.barangay,
            purok: req.body.purok
          },
          date_of_birth: req.body.birthday, // Will be converted to Date by middleware
          age: parseInt(req.body.age) || 0,
          place_of_birth: Array.isArray(req.body.place_of_birth) 
            ? req.body.place_of_birth.filter(Boolean) // Remove empty values
            : [req.body.place_of_birth].filter(Boolean),
          marital_status: req.body.civil_status,
          gender: req.body.gender,
          contacts: Array.isArray(req.body.contacts) 
            ? req.body.contacts.filter(contact => contact && contact.name) // Filter empty contacts
            : req.body.contacts 
              ? [req.body.contacts] 
              : [],
          osca_id_number: req.body.osca_id,
          gsis_sss: req.body.gsis_sss_no,
          philhealth: req.body.philhealth_no,
          sc_association_org_id_no: req.body.sc_association_id,
          tin: req.body.tin_no,
          other_govt_id: req.body.other_govt_id,
          service_business_employment: req.body.service,
          current_pension: req.body.pension,
          capability_to_travel: req.body.education_level === 'Yes' ? 'Yes' : 'No'
        },
        family_composition: {
          spouse: {
            name: req.body.spouse_name || undefined
          },
          father: {
            last_name: req.body.fatherLastName,
            first_name: req.body.fatherFirstName,
            middle_name: req.body.fatherMiddleName,
            extension: req.body.fatherExtension || undefined
          },
          mother: {
            last_name: req.body.motherLastName,
            first_name: req.body.motherFirstName,
            middle_name: req.body.motherMiddleName
          },
          children: req.body.childFullName?.map((name, index) => ({
            full_name: name || undefined,
            occupation: req.body.childOccupation?.[index] || undefined,
            age: parseInt(req.body.childAge?.[index]) || undefined,
            working_status: req.body.childWorkingStatus?.[index] || undefined,
            income: req.body.childIncome?.[index] || undefined
          })).filter(child => child.full_name) || [] // Remove children with no name
        },
        education_hr_profile: {
          educational_attainment: Array.isArray(req.body.education_level)
            ? req.body.education_level.filter(Boolean) // Remove empty values
            : [req.body.education_level].filter(Boolean),
          skills: Array.isArray(req.body.skills) 
            ? req.body.skills.filter(Boolean) 
            : [],
          skill_other_text: skillOtherText || undefined
        }
      };
  
      // Create new resident
      const newResident = new SeniorCitizen(residentData);
      
      // Save to database
      const savedResident = await newResident.save();
  
      // Send response
      res.status(201).json({
        success: true,
        message: 'Senior citizen record created successfully',
        data: savedResident,
        reference_code: savedResident.reference_code
      });
  
    } catch (error) {
      console.error('Error creating resident:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }));
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: errors
        });
      }
      
      // Handle duplicate key errors
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        return res.status(400).json({
          success: false,
          message: `Duplicate value for ${field}`,
          field: field,
          value: error.keyValue[field]
        });
      }
  
      // Generic error handler
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack
        } : undefined
      });
    }
  };

