// server.js
const express = require('express');
const { spawn } = require('child_process');
const cors = require('cors'); // Import the cors module
const app = express();
const port = 8000;

app.use(cors()); // Enable CORS for all routes

let pythonProcess;

app.get('/run-python-script', (req, res) => {
  if (!pythonProcess) {
    pythonProcess = spawn('python', ['send_jobseeker_response.py']);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
      if (data.toString().trim() === 'Question over') {
        pythonProcess.kill(); // Stop the Python process
        pythonProcess = null; // Reset the pythonProcess variable
        console.log('Python process stopped');
      }
      res.send({ message: 'Python script executed successfully' });
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
      res.status(500).send({ error: 'An error occurred while running the Python script' });
    });
  } else {
    pythonProcess.kill(); // Stop the running Python process
    pythonProcess = null; // Reset the pythonProcess variable
    res.send({ message: 'Python process stopped' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
