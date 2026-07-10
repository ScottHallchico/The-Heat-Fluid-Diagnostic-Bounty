import React, { useState } from 'react';
import { Activity, Search, Gauge, Database, GitBranch, ArrowRight, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DiagnosticWizard({ api }) {
  const [step, setStep] = useState(1);
  const [equipmentId, setEquipmentId] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [pilotData, setPilotData] = useState({ flowRate: 0.004, pressure: 100000, temperature: 25, velocity: 1.5, overallU: 500, conversion: 0 });
  const [industryData, setIndustryData] = useState({ flowRate: 0.003, pressure: 90000, temperature: 25, velocity: 1.1, overallU: 400, conversion: 0 });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    api('/equipment').then(setEquipmentList).catch(console.error);
  }, [api]);

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      const pilotRes = await api('/pilot-data', { method: 'POST', body: { equipmentId, ...pilotData } });
      const industryRes = await api('/industry-data', { method: 'POST', body: { equipmentId, ...industryData } });
      const res = await api('/run-diagnosis', { method: 'POST', body: { pilotDataId: pilotRes._id, industrialDataId: industryRes._id } });
      setReport(res.report);
      setStep(4);
    } catch (e) {
      console.error(e);
      alert('Error running diagnosis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wizard-container" style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>Diagnostic Wizard</h2>
      <div className="wizard-steps" style={{ display: 'flex', gap: 10, marginBottom: 30 }}>
        {[1, 2, 3, 4].map(s => (
          <div key={s} style={{ flex: 1, padding: 10, background: step >= s ? '#0b7285' : '#e9ecef', color: step >= s ? '#fff' : '#495057', borderRadius: 4, textAlign: 'center' }}>
            Step {s}: {s === 1 ? 'Equipment' : s === 2 ? 'Pilot Data' : s === 3 ? 'Industry Data' : 'Report'}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="wizard-step">
          <h3>Select Equipment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginTop: 20 }}>
            {equipmentList.map(eq => (
              <div key={eq._id} 
                   onClick={() => setEquipmentId(eq._id)}
                   style={{ padding: 20, border: '2px solid', borderColor: equipmentId === eq._id ? '#0b7285' : '#dee2e6', borderRadius: 8, cursor: 'pointer' }}>
                <h4>{eq.name}</h4>
              </div>
            ))}
            {equipmentList.length === 0 && <p>No equipment found in DB. Add via API.</p>}
          </div>
          <button onClick={handleNext} disabled={!equipmentId} className="primary-action wide" style={{ marginTop: 20 }}>Next <ArrowRight size={16} /></button>
        </div>
      )}

      {step === 2 && (
        <div className="wizard-step">
          <h3>Pilot Plant Data (Benchmark)</h3>
          <div className="form-grid" style={{ marginTop: 20 }}>
            {Object.keys(pilotData).map(k => (
              <label key={k}>{k}
                <input type="number" step="any" value={pilotData[k]} onChange={e => setPilotData({...pilotData, [k]: Number(e.target.value)})} />
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={handlePrev} className="secondary-action">Back</button>
            <button onClick={handleNext} className="primary-action wide">Next <ArrowRight size={16} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="wizard-step">
          <h3>Industrial Plant Data</h3>
          <div className="form-grid" style={{ marginTop: 20 }}>
            {Object.keys(industryData).map(k => (
              <label key={k}>{k}
                <input type="number" step="any" value={industryData[k]} onChange={e => setIndustryData({...industryData, [k]: Number(e.target.value)})} />
              </label>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
            <button onClick={handlePrev} className="secondary-action">Back</button>
            <button onClick={runDiagnosis} disabled={loading} className="primary-action wide">{loading ? 'Running...' : 'Run Diagnosis'}</button>
          </div>
        </div>
      )}

      {step === 4 && report && (
        <div className="wizard-step report-dashboard">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3>Diagnostic Report</h3>
            <button onClick={() => setStep(1)} className="secondary-action">Start Over</button>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h4>Comparison</h4>
            <table style={{ width: '100%', marginTop: 10 }}>
              <thead><tr><th>Parameter</th><th>Pilot</th><th>Industry</th><th>Diff %</th></tr></thead>
              <tbody>
                {Object.keys(report.comparison).map(k => (
                  <tr key={k} style={{ color: report.comparison[k].isAbnormal ? '#c92a2a' : 'inherit' }}>
                    <td>{k}</td>
                    <td>{report.comparison[k].pilot}</td>
                    <td>{report.comparison[k].industry}</td>
                    <td>{report.comparison[k].percentageDifference.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h4>Root Cause Ranking</h4>
            <ul>
              {report.rankedCauses.map((rc, idx) => (
                <li key={idx}><strong>{rc.cause}</strong> ({rc.confidence}% confidence) - {rc.reason}</li>
              ))}
            </ul>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h4>Explainable RCA (5 Why)</h4>
            <ol>
              {report.rca.fiveWhy.map((w, idx) => <li key={idx}>{w}</li>)}
            </ol>
          </div>

          <div className="panel" style={{ marginTop: 20 }}>
            <h4>Recommendations</h4>
            <ul>
              {report.recommendations.map((r, idx) => <li key={idx}>{r}</li>)}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
