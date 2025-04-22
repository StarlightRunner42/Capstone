require("dotenv").config(); 
const mongoose = require("mongoose");
const express = require('express');
const bcrypt = require('bcrypt');
const saltrounds = 10;
const session = require('express-session');
const { User,Resident } = require("../model/schema");

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
        return res.redirect("/index");
    }else if (user.role === "Encoder") {
        return res.redirect("/index-staff");
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
  try {
    // Transform form data to match schema
    const residentData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      middleName: req.body.middleName,
      birthdate: new Date(req.body.birthdate),
      age: parseInt(req.body.age),
      gender: req.body.gender,
      barangay: req.body.barangay, // This should be the ObjectId from your Barangay collection
      purok: req.body.purok,
      contactNumber: req.body.contactNumber,
      email: req.body.email,
      emergencyContact: req.body.emergencyContact,
      emergencyContactName: req.body.emergencyContactName,
      relationship: req.body.relationship,
      status: [],
      medicalConditions: req.body.disease,
      healthInsurance: req.body.healthInsurance,
      bloodType: req.body.bloodType,
      medications: req.body.medications
    };

    // Handle special categories
    if (req.body.pwd === 'on' || req.body.indigent === 'on') {
      residentData.status.push('pwd');
      residentData.pwdDetails = {
        idNumber: req.body.pwdIdNumber,
        disabilityType: req.body.disabilityType,
        accommodationNeeds: req.body.accommodationNeeds
      };
    }

    if (req.body.senior === 'on' || req.body.indigent === 'on') {
      residentData.status.push('senior');
      residentData.seniorDetails = {
        idNumber: req.body.seniorIdNumber,
        pensioner: req.body.pensioner,
        livingArrangement: req.body.livingArrangement
      };
    }

    if (req.body.indigent === 'on') {
      residentData.status.push('indigent');
    }

    const newResident = new Resident(residentData);
    await newResident.save();
    
    res.status(201).json({ 
      success: true,
      message: 'Resident registered successfully',
      data: newResident
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: 'Registration failed',
      error: error.message 
    });
  }
  };