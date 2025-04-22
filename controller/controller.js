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
  try {
    const formData = req.body;
    
    // Transform the form data to match our schema
    const residentData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName || undefined,
      birthdate: new Date(formData.birthdate),
      age: parseInt(formData.age),
      gender: formData.gender,
      barangay: formData.barangay,
      purok: formData.purok,
      
      // Contact Information
      contactNumber: formData.contactNumber || undefined,
      email: formData.email || undefined,
      emergencyContact: formData.emergencyContact || undefined,
      emergencyContactName: formData.emergencyContactName || undefined,
      relationship: formData.relationship || undefined,
      
      // Special Categories
      status: getStatus(formData),
      pwdInfo: formData.pwd ? {
        idNumber: formData.pwdIdNumber || undefined,
        disabilityType: formData.disabilityType || undefined,
        accommodationNeeds: formData.accommodationNeeds || undefined
      } : undefined,
      seniorInfo: formData.senior ? {
        idNumber: formData.seniorIdNumber || undefined,
        pensioner: formData.pensioner || undefined,
        livingArrangement: formData.livingArrangement || undefined
      } : undefined,
      
      // Medical Information
      medicalConditions: formData.disease || undefined,
      healthInsurance: formData.healthInsurance || undefined,
      bloodType: formData.bloodType || undefined,
      medications: formData.medications || undefined
    };

    // Create new resident
    const newResident = new Resident(residentData);
    await newResident.save();

    res.status(201).json({
      success: true,
      message: 'Resident registered successfully',
      data: newResident
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering resident',
      error: error.message
    });
  }
  };

  function getStatus(formData) {
    if (formData.indigent) return 'indigent';
    if (formData.pwd && formData.senior) return 'indigent';
    if (formData.pwd) return 'pwd';
    if (formData.senior) return 'senior';
    return null;
  }