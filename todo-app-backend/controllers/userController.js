const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registration
const registerUser = async (req, res) => {
    try {
        const { userName, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [{ email }, { phone }] 
        });

        if (existingUser) {
            return res.status(400).json({ 
                message: 'User already exists with this email or phone' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            userName,
            email,
            password: hashedPassword,
            phone
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                userName: newUser.userName,
                email: newUser.email,
                phone: newUser.phone
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error registering user', 
            error: error.message 
        });
    }
};

// User Login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error logging in', 
            error: error.message 
        });
    }
};

// Get User Details
const getUserDetails = async (req, res) => {
    try {
        const userId = req.params.id || req.user.userId;

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            message: 'User details retrieved successfully',
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error getting user details', 
            error: error.message 
        });
    }
};

// Update User
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id || req.user.userId;
        const { userName, email, phone, password } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if email or phone already exists (excluding current user)
        if (email || phone) {
            const existingUser = await User.findOne({
                $and: [
                    { _id: { $ne: userId } },
                    { $or: [{ email }, { phone }] }
                ]
            });

            if (existingUser) {
                return res.status(400).json({ 
                    message: 'Email or phone already exists' 
                });
            }
        }

        // Update fields
        if (userName) user.userName = userName;
        if (email) user.email = email;
        if (phone) user.phone = phone;
        
        // Hash new password if provided
        if (password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        await user.save();

        res.json({
            message: 'User updated successfully',
            user: {
                id: user._id,
                userName: user.userName,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Error updating user', 
            error: error.message 
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserDetails,
    updateUser
};