import { useState } from "react";
import axios from "axios";

const API_BASE = "YOUR_BACKEND_URL"; // https://resumatch-backend-1.onrender.com

export default function App() {
  const [resume, setResume] = useState("");
  const [job, setJob] = useState("");
  const [title, setTitle] = useState("Director of Continuous Improvement");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const { data } = await axios.post(`${API_BASE}/api/tailor`, {
        resume_text: resume,
        job_text: job,
        target_title: title,
        tone: "Professional",
        instructions: "Emphasize supplier maturity and cost savings",
        generate_cover_letter: true
      });
      setResult(data);
    } catch (err) {
      setResult({ error: err?.response?.data || err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{maxWidth: 900, margin: "40px auto", fontFamily: "system-ui"}}>
      <h1>ResuMatch.ai</h1>
      <p>Paste your resume and the job description. Get a tailored draft instantly.</p>

      <form onSubmit={submit} style={{display: "grid", gap: 12}}>
        <label>
          Target Title
          <input value={title} onChange={e=>setTitle(e.target.value)} style={{width:"100%", padding:8}} />
        </label>

        <label>
          Resume Text
          <textarea rows={8} value={resume} onChange={e=>setResume(e.target.value)} style={{width:"100%", padding:8}} />
        </label>

        <label>
          Job Description
          <textarea rows={8} value={job} onChange={e=>setJob(e.target.value)} style={{width:"100%", padding:8}} />
        </label>

        <button type="submit" disabled={loading} style={{padding:"10px 16px", cursor:"pointer"}}>
          {loading ? "Tailoring…" : "Tailor Resume"}
        </button>
      </form>

      {result && (
        <div style={{marginTop: 24}}>
          {result.error ? (
            <pre style={{color:"crimson"}}>{JSON.stringify(result.error, null, 2)}</pre>
          ) : (
            <>
              <h2>Summary</h2>
              <p>{result.summary}</p>
              <h2>Improved Resume (notes)</h2>
              <p>{result.improved_resume}</p>
              {result.cover_letter && (
                <>
                  <h2>Cover Letter</h2>
                  <pre style={{whiteSpace:"pre-wrap"}}>{result.cover_letter}</pre>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
