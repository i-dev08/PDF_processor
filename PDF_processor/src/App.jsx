import { useState, useEffect } from 'react'

function App() {
  const [task, setTask] = useState("");
  const [files, setFiles] = useState([]);
  const [jobid, setJobid] = useState("");
  const [status,setStatus] = useState("");
  const [result_url,setResultUrl] = useState("");

 
  async function submitJob() {
    const formData = new FormData();
    formData.append("jobType",task);
    
    for (let i=0;i<files.length;i++) {
      formData.append("files",files[i]);
    }

    try {
      const res = await fetch("http://localhost:3000/process",{
        method:"POST",
        body:formData,
      });
      const data = await res.json();

      setJobid(data.jobid);
      setStatus("JOB SUBMITTED");
      console.log("Job submitted:",data.jobid);
    } catch (err) {
      console.log("Submission error:",err);
    }
  }

  function newJob() {
    setTask("");
    setFiles([]);
    setJobid("");
    setStatus("");
  }

  function checkFile(e) {
    const upFiles = Array.from(e.target.files);

    const pdf = upFiles.filter(file => file.type === "application/pdf");

    if (pdf.length !== upFiles.length) {
      alert("Only PDF files are allowed");
      return;
    }
    setFiles(prev => [...prev,...pdf]);
  }

  function removeFile(i) {
    setFiles((prevFiles) =>
    prevFiles.filter((_,index) => index!==i));
  }

  useEffect(() => {
    if (!jobid) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost:3000/status/${jobid}`);
        const data = await res.json();

        setStatus(data.status);

        if (data.status === "COMPLETED"||data.status === "FAILED") {
          if (data.status === "COMPLETED") {
            console.log("Joc Completed",jobid);
            setResultUrl(data.result_url);
          }
          clearInterval(interval);
        }
      } catch (err) {
        console.log("Error while polling");
        clearInterval(interval);
      }
    },2000)

    return () => clearInterval(interval);
  }, [jobid]);
  
  const pageStyle = {
    minHeight:"100vh",
    width:"100vw",
    display:"flex",
    justifyContent:"center",
    alignItems:"center",
    background:"#c1dffbc6",
  };

  const cardStyle = {
    width:"420px",
    background:"white",
    padding:"24px",
    borderRadius:"8px",
    boxShadow:"0 2px 25px rgba(0,0,0,0.08)",
    cursor:"arrow",
  };
  
  const radioLabel = {
    display:"flex",
    alignItems:"center",
    gap:"0px",
    color:"#222",
    cursor:"pointer",
  }

  const inputStyle = {
    width:"100%",
    padding:"8px",
    marginBottom:"12px",
  };

  const fileChip={
    display:"flex",
    justifyContent:"space-between",
    alignItems:"center",
    padding:"6px 10px",
    background:"#d0d5f3ff",
    borderRadius:"16px",
    marginBottom:"6px",
    fontSize:"14px",
    color:"#111",
  }

  const removeBtn = {
    background:"transparent",
    border:"none",
    color:"#d00",
    cursor:"pointer",
    fontSize:"14px",
  }

  const mainBtn = {
    width:"100%",
    padding:"10px",
    border:"none",
    borderRadius:"6px",
    background:"#2563eb",
    color:"#fff",
    cursor:"pointer",
    marginBottom:"4px",
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h2 style={{marginBottom:"2px",fontFamily:"Verdana",textAlign:"center",color:"#24033fff"}}>Async PDF Processor</h2>

        <div style={{marginBottom:"10px",marginTop:"5px"}}>
          <p style={{marginBottom:"5px",color:"#000000ff"}}>Select the action</p>
          
          <label style={radioLabel}>
            <input
              type="radio"
              name="do"
              value="merge"
              onChange={(e) => setTask(e.target.value)}
            />
            Merge PDFs
          </label>

          <label style={radioLabel}>
            <input
              type="radio"
              name="do"
              value="compress"
              onChange={(e) => setTask(e.target.value)}
            />
            Compress PDFs
          </label>

          <label style={radioLabel}>
            <input
              type="radio"
              name="do"
              value="split"
              onChange={(e) => setTask(e.target.value)}
            />
            Split PDF
          </label>
          </div>

        <input
          type='file'
          accept="application/pdf"
          multiple
          placeholder="upload files"
          onChange={checkFile}
          style={{marginBottom:"12px"}}
        />

        {(files.length>0) && (
          <div style={{marginBottom:"12px"}}>
          {files.map((file,i) => (
            <div key={i} style={fileChip}>
              <span>{file.name}</span>
              <button
                onClick={() => removeFile(i)}
                style={removeBtn}
              >
                X
              </button>
            </div>
          ))}
          </div>
        )}

        <button 
          onClick={submitJob}
          style={{...mainBtn,opacity:!task || files.length === 0 ? 0.6 : 1}}
          disabled={(!task||files.length===0)||(task==="merge"&&files.length<2)}
        >
          Submit Job
        </button>

        {(status) && (
          <p style={{ color: "#111" }}>
            Status: {
              status === "PROCESSING..." ? (
                <span style={{ color: "#c05c05ff" }}>{status}</span>
              ) : status === "COMPLETED" ? (
                <span style={{ color: "#04db16" }}>{status}</span>
              ) : (
                <span style={{ color:"#fe0000ff"}}>{status}</span>
              )
            }
          </p>)}
                  
        {jobid && <p style={{color:"#111"}}>Job ID: {jobid}</p>}
        {((!task||files.length===0)||(task==="merge"&&files.length<2)) && (
          <p style={{color:"red"}}>Please select a task and atleast one pdf file for split and compress and two for merge. Max file size is 5MB</p>
        )}
        {status === "COMPLETED" && result_url && (
          <a href={result_url} target="_blank" rel="noopener noreferrer"><button style={mainBtn}>Download PDF</button></a>
        )}
        {jobid && (
          <button
            onClick={newJob}
            style={mainBtn}
          >
            New Job
          </button>
        )}
      </div>
    </div>
  )

} 
export default App;
