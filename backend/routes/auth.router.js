import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Presentation from '../models/Presentation.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import express from 'express';
import isAdmin from '../middleware/authMiddleware.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ username, email, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            console.error('User not found with email:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.error('Incorrect password for email:', email);
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id, role: user.role } };
        console.log('Login successful for user:', user.email);

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) {
                console.error('JWT signing error:', err.message);
                throw err;
            }
            res.json({ token, role: user.role });
        });
    } catch (err) {
        console.error('Server error during login:', err.message);
        res.status(500).send('Server error');
    }
});

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000;

        await user.save();

        const resetUrl = `http://localhost:3000/reset-password/${resetToken}`;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset',
            text: `You are receiving this email because you requested a password reset.\n\n
            Please click on the following link to reset your password:\n\n
            ${resetUrl}\n\n
            If you did not request this, please ignore this email.\n`
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ msg: 'Email sent with password reset instructions' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.post('/reset-password/:token', async (req, res) => {
    const { password } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ msg: 'Password has been reset successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

router.get('/admin/presentations', auth, async (req, res) => {
    try {
        const presentations = await Presentation.find(); // Find all presentations in the database
        res.json(presentations); // Send them as the response
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/admin/presentation/edit', auth, async (req, res) => {
    try {
        const { title, newTitle, newPresenter, newTimeSlot, newStatus } = req.body;

        // Find the presentation by title
        const presentation = await Presentation.findOne({ title });

        if (!presentation) {
            return res.status(404).json({ msg: 'Presentation not found' });
        }

        // Update the presentation details
        if (newTitle) presentation.title = newTitle;
        if (newPresenter) presentation.presenter = newPresenter;
        if (newTimeSlot) presentation.timeSlot = newTimeSlot;
        if (newStatus) presentation.status = newStatus;

        // Save the updated presentation
        await presentation.save();
        res.json({ msg: 'Presentation updated successfully', presentation });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/admin/presentation/status', auth, async (req, res) => {
    try {
        const { title, status } = req.body;

        const presentation = await Presentation.findOne({ title });

        if (!presentation) {
            return res.status(404).json({ msg: 'Presentation not found' });
        }

        presentation.status = status; // Update status to "Accepted" or "Rejected"
        await presentation.save();

        res.json({ msg: 'Presentation status updated', presentation });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

router.put('/admin/presentation/status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const updatedPresentation = await Presentation.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(updatedPresentation);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
});

// Read all scheduled presentations
router.get('/presentations', auth, async (req, res) => {
    try {
        const presentations = await Presentation.find({ user: req.user.id }); // Fetch presentations for the logged-in user
        res.json(presentations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get a single presentation by ID
router.get('/presentation/:id', auth, async (req, res) => {
    try {
        const presentation = await Presentation.findById(req.params.id);

        if (!presentation) {
            return res.status(404).json({ msg: 'Presentation not found' });
        }

        // Ensure the user owns the presentation request
        if (presentation.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        res.json(presentation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Update a presentation request
router.put('/presentation/:id', auth, async (req, res) => {
    const { title, presenter, timeSlot, status } = req.body;

    try {
        let presentation = await Presentation.findById(req.params.id);

        if (!presentation) {
            return res.status(404).json({ msg: 'Presentation not found' });
        }

        // Ensure the user owns the presentation request
        if (presentation.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        presentation = await Presentation.findByIdAndUpdate(
            req.params.id,
            { title, presenter, timeSlot, status }, 
            { new: true }
        );

        res.json(presentation);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Delete a presentation request
router.delete('/presentation/:id', auth, async (req, res) => {
    try {
        const presentation = await Presentation.findById(req.params.id);

        if (!presentation) {
            return res.status(404).json({ msg: 'Presentation not found' });
        }

        // Ensure the user owns the presentation request
        if (presentation.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Presentation.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Presentation deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ msg: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.user.id;
        console.log(decoded)
        next();
    } catch (err) {
        res.status(403).json({ msg: 'Invalid token' });
    }
}

router.post('/create', verifyToken, async (req, res) => {
    try {
        const { title, presenter, timeSlot } = req.body;
        const userId = req.userId;
        const presentation = new Presentation({ title, presenter, timeSlot, user: userId });
        await presentation.save();
        res.json({ msg: 'Presentation created successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
