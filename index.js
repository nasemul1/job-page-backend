const express = require("express");
const cors = require("cors");
const fs = require('fs');
const jobsData = require("./db.json");
const app = express();
const { v4: uuidv4 } = require('uuid');

const PORT = 8000;

app.use(express.json());

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
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

    const newId = uuidv4();

    const newJob = { id: newId, ...body };

    jobsData.jobs.push(newJob);

    fs.writeFile('./db.json', JSON.stringify(jobsData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        return res.json({ status: 'success', job: newJob });
    });
});

app.put('/jobs/:id', (req, res) => {
    const jobId = req.params.id;
    const updatedJob = req.body;

    const jobIndex = jobsData.jobs.findIndex(job => job.id === jobId);

    if (jobIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Job not found' });
    }

    jobsData.jobs[jobIndex] = { ...jobsData.jobs[jobIndex], ...updatedJob };

    fs.writeFile('./db.json', JSON.stringify(jobsData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        return res.json({ status: 'success', job: jobsData.jobs[jobIndex] });
    });
});

app.delete('/jobs/:id', (req, res) => {
    const jobId = req.params.id;

    const jobIndex = jobsData.jobs.findIndex(job => job.id === jobId);

    if (jobIndex === -1) {
        return res.status(404).json({ status: 'error', message: 'Job not found' });
    }

    const deletedJob = jobsData.jobs.splice(jobIndex, 1);

    fs.writeFile('./db.json', JSON.stringify(jobsData, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ status: 'error', message: err.message });
        }
        return res.json({ status: 'success', message: 'Job deleted', job: deletedJob[0] });
    });
});

app.listen(PORT, () => console.log(`Server has started at port: ${PORT}`));
