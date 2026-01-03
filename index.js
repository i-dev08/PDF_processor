const cors = require("cors");
const express = require("express");
const multer = require("multer");
const upload = multer({dest:'uploads/'});
const app = express();
app.use(cors());
app.use(express.json());

const jobs= {};

//for processing the uploaded files and returning a job id
app.post("/process",upload.array('files'),(req,res) => {
    console.log("Recieved file:",req.files.length);
    const jobid = Date.now().toString();
    const MAX_SIZE = 5*1024*1024;

    jobs[jobid]={
        status:"PROCESSING...",
        files:req.files,
        result_url:null,
    };

    setTimeout(() => {
        if (jobs[jobid].files.some(file => file.size > MAX_SIZE|| (!file.mimetype || file.mimetype !== "application/pdf"))) {
            jobs[jobid].status="FAILED";
        } else {
            jobs[jobid].status="COMPLETED";
            jobs[jobid].result_url="http://example.com/result.pdf";
        }
    },5000);

    res.json({jobid});
});

//for checking the status of the job using job id
app.get("/status/:id",(req,res) => {
    const job = jobs[req.params.id];
    if (!job) {return res.status(404).json({ error:"Job not found"});}
    res.json(job);
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});