const express = require("express");
const cors = require("cors");
const fs = require('fs');
const jobsData = require("./db.json");
const app = express();

const PORT = 8000;

// Middleware to parse JSON bodies
app.use(express.json());

app.use(cors({
    origin: 'https://nasemul1.github.io/job-page-backend/'
}));

app.get('/jobs', (req, res) => {
    return res.json(jobsData);
});

app.get('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    const job = jobsData.jobs.find(job => job.id === jobId);
  
    if (job) {
      res.json(job);
    } else {
      res.status(404).json({ message: 'Job not found' });
    }
});

app.post('/jobs', (req, res) => {
    const body = req.body;
    jobsData.jobs.push(body);
    fs.writeFile('./db.json', JSON.stringify(jobsData), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        return res.json({ status: 'success' });
    });
});

app.put('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    const updatedJob = req.body;

    // Find the index of the job to be updated
    const jobIndex = jobsData.jobs.findIndex(job => job.id === jobId);

    // Check if the job exists
    if (jobIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Job not found' });
    }

    // Update the job with new data
    jobsData.jobs[jobIndex] = { ...jobsData.jobs[jobIndex], ...updatedJob };

    // Write the updated jobs data back to the JSON file
    fs.writeFile('./db.json', JSON.stringify(jobsData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        return res.json({ status: 'success', job: jobsData.jobs[jobIndex] });
    });
});

app.delete('/jobs/:id', (req, res) => {
    const jobId = req.params.id;

    // Find the index of the job to be deleted
    const jobIndex = jobsData.jobs.findIndex(job => job.id === jobId);

    // Check if the job exists
    if (jobIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Job not found' });
    }

    // Remove the job from the jobs array
    const deletedJob = jobsData.jobs.splice(jobIndex, 1);

    // Write the updated jobs data back to the JSON file
    fs.writeFile('./db.json', JSON.stringify(jobsData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        return res.json({ status: 'success', message: 'Job deleted', job: deletedJob[0] });
    });
});

app.listen(PORT, () => console.log(`Server has started at port: ${PORT}`));