// backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path'); // Added: Node.js path module for handling file paths

const app = express();
const PORT = 5000;

// --- Multer Configuration ---
// This tells Multer where to save the uploaded files
const storage = multer.diskStorage({
  destination: './uploads/', // You must create this 'uploads' folder
  filename: function(req, file, cb) {
    // Creates a unique filename to avoid conflicts
    cb(null, 'IMAGE-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// --- Middleware ---
app.use(cors());
app.use(express.json());
// Added: Serve uploaded images statically
// This makes files in the 'uploads' folder accessible via URLs like http://localhost:5000/uploads/filename.jpg
app.use('/uploads', express.static('uploads'));

// --- Database Connection ---
const mongoURI = 'mongodb+srv://r4-rahul123:r4rahul123@cluster05.fawchhh.mongodb.net/sih';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- Mongoose Schema & Model ---
const studentSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  university: String,
  major: String,
  gpa: Number,
  graduationYear: Number,
  location: String,
  skills: [String],
  interests: [String],
  experience: String,
  portfolio: String,
  resume: String,
  profilePictureUrl: String, // Added: Field to store the image path
});

const StudentModel = mongoose.model('Student', studentSchema);

// --- API Endpoint to Update Profile ---
// Updated: Added `upload.single('profileImage')` middleware
// 'profileImage' must match the key used in the FormData on your frontend.
app.put('/api/students/:email', upload.single('profileImage'), async (req, res) => {
  try {
    const studentEmail = req.params.email;
    const updatedData = req.body; // Text fields are in req.body

    // Updated: Check if a new file was uploaded
    if (req.file) {
      // If a file was uploaded, its path is available in req.file.path
      // We store the URL path, not the system path
      updatedData.profilePictureUrl = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    const updatedStudent = await StudentModel.findOneAndUpdate(
      { email: studentEmail },
      updatedData,
      { new: true, upsert: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    res.json({ message: 'Profile updated successfully!', student: updatedStudent });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
});

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`Backend server is running on http://localhost:${PORT}`);
});