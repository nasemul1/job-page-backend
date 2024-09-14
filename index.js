const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// MongoDB connection
const MONGODB_URI = 'mongodb+srv://nasemul1:VI11dIDcEe9AlTwM@testcluster.8jgda.mongodb.net/?retryWrites=true&w=majority&appName=TestCluster'; // Replace with your MongoDB URI

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Define the Job schema
const JobSchema = new mongoose.Schema({
    type: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String, required: true },
    company: {
        name: { type: String, required: true },
        description: { type: String },
        contactEmail: { type: String, required: true },
        contactPhone: { type: String }
    }
}, { timestamps: true });

// Create Job model
const Job = mongoose.model('Job', JobSchema);

// API Routes

// Get all jobs
app.get('/jobs', async (req, res) => {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching jobs', error: error.message });
    }
});

// Get job by ID
app.get('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching job', error: error.message });
    }
});

// Create a new job
app.post('/jobs', async (req, res) => {
    try {
        const jobData = req.body;
        const newJob = new Job(jobData);
        await newJob.save();
        res.status(201).json({ status: 'success', job: newJob });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Update an existing job
app.put('/jobs/:id', async (req, res) => {
    try {
        const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ status: 'success', job: updatedJob });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Delete a job
app.delete('/jobs/:id', async (req, res) => {
    try {
        const deletedJob = await Job.findByIdAndDelete(req.params.id);
        if (!deletedJob) {
            return res.status(404).json({ message: 'Job not found' });
        }
        res.json({ status: 'success', message: 'Job deleted', job: deletedJob });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
