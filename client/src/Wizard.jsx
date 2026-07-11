import React, { useState } from 'react';
import { Activity, Search, Gauge, Database, GitBranch, ArrowRight, ArrowLeft } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DiagnosticWizard({ api, preselectedBounty, studentId }) {
  const [step, setStep] = useState(1);
  const [equipmentId, setEquipmentId] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  
  const [pilotData, setPilotData] = useState({});
  const [industryData, setIndustryData] = useState({});
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDefaultValue = (key) => {
    const k = key.toLowerCase();
    if (k.includes('pressure')) return 100000;
    if (k.includes('temperature')) return 25;
    if (k.includes('flowrate')) return 0.005;
    if (k.includes('density')) return 997;
    if (k.includes('viscosity')) return 0.00089;
    if (k.includes('diameter')) return 0.1;
    if (k.includes('length')) return 10;
    if (k.includes('duty')) return 50000;
    if (k.includes('efficiency') || k.includes('factor')) return 0.85;
    if (k.includes('speed') || k.includes('rpm')) return 1500;
    if (k.includes('power')) return 5000;
    if (k.includes('volume')) return 5;
    if (k.includes('time')) return 60;
    if (k.includes('ratio')) return 2.5;
    return 1;
  };

  React.useEffect(() => {
    api('/equipment').then(list => {
      setEquipmentList(list);
      // Auto-select equipment based on bounty tags
      if (preselectedBounty && list.length > 0) {
        const tags = preselectedBounty.tags || [];
        const title = preselectedBounty.title.toLowerCase();
        let matchedEq = null;
        if (tags.includes('heat_exchanger') || title.includes('heat')) {
          matchedEq = list.find(e => e.name.toLowerCase().includes('heat exchanger'));
        } else if (tags.includes('pump') || title.includes('pump')) {
          matchedEq = list.find(e => e.name.toLowerCase().includes('pump'));
        } else if (tags.includes('cstr') || title.includes('stirred')) {
          matchedEq = list.find(e => e.name.toLowerCase().includes('cstr'));
        } else if (tags.includes('pfr') || title.includes('plug')) {
          matchedEq = list.find(e => e.name.toLowerCase().includes('pfr'));
        } else if (tags.includes('distillation') || title.includes('column')) {
          matchedEq = list.find(e => e.name.toLowerCase().includes('distillation'));
        }
        
        let eqId = null;
        if (matchedEq) eqId = matchedEq._id;
        else eqId = list[0]._id;
        
        setEquipmentId(eqId);

        // Auto initialize and skip step 1
        const eq = list.find(e => e._id === eqId);
        if (eq) {
          let initData = {};
          eq.requiredInputs.forEach(input => initData[input] = getDefaultValue(input));
          
          // Modify initData to be completely unique per question
          if (title.includes('q1:')) {
            initData.hotFluidFlowRate = 0.008;
            initData.coldFluidFlowRate = 0.015;
            initData.foulingFactor = 0.001;
            initData.tubeDiameter = 0.025;
            initData.pressure = 110000;
          } else if (title.includes('q2:')) {
            initData.hotFluidFlowRate = 0.012;
            initData.coldFluidFlowRate = 0.010;
            initData.tubeLength = 8;
            initData.pressure = 95000;
          } else if (title.includes('q3:')) {
            initData.hotFluidFlowRate = 0.005;
            initData.coldOutletTemperature = 45;
            initData.tubeDiameter = 0.04;
            initData.numberOfTubes = 120;
          } else if (title.includes('q4:')) {
            initData.flowRate = 0.02;
            initData.motorPower = 6000;
            initData.suctionPressure = 150000;
          } else if (title.includes('q5:')) {
            initData.flowRate = 0.035;
            initData.dischargePressure = 350000;
            initData.pumpSpeed = 1750;
          } else if (title.includes('q6:')) {
            initData.flowRate = 0.015;
            initData.npshAvailable = 4.5;
            initData.suctionPressure = 80000;
            initData.density = 1010;
          } else if (title.includes('q7:')) {
            initData.reactorVolume = 8;
            initData.temperature = 65;
            initData.agitatorSpeed = 120;
          } else if (title.includes('q8:')) {
            initData.reactorVolume = 12;
            initData.temperature = 85;
            initData.feedConcentration = 1.2;
            initData.rateConstant = 0.045;
          } else if (title.includes('q9:')) {
            initData.feedFlowRate = 0.018;
            initData.catalystLoading = 45;
            initData.residenceTime = 45;
          } else if (title.includes('q10:')) {
            initData.reactorLength = 15;
            initData.feedFlowRate = 0.025;
            initData.temperature = 110;
          } else if (title.includes('q11:')) {
            initData.reactorLength = 22;
            initData.pressure = 220000;
            initData.catalystLoading = 80;
          } else if (title.includes('q12:')) {
            initData.reactorDiameter = 0.6;
            initData.feedFlowRate = 0.04;
            initData.residenceTime = 30;
          } else if (title.includes('q13:')) {
            initData.refluxRatio = 3.5;
            initData.feedFlowRate = 0.08;
            initData.numberOfTrays = 30;
          } else if (title.includes('q14:')) {
            initData.refluxRatio = 4.0;
            initData.reboilerDuty = 75000;
            initData.numberOfTrays = 40;
          } else if (title.includes('q15:')) {
            initData.trayEfficiency = 0.75;
            initData.pressure = 135000;
            initData.feedComposition = 0.6;
          }

          setPilotData({...initData});
          
          // Inject specific faults based on the exact Question (Q1-Q15)
          const faultyData = {...initData};
          if (title.includes('q1:')) {
            faultyData.foulingFactor = initData.foulingFactor * 1.5;
            faultyData.hotOutletTemperature = initData.hotOutletTemperature * 1.1;
            faultyData.coldOutletTemperature = initData.coldOutletTemperature * 0.8;
          } else if (title.includes('q2:')) {
            faultyData.pressure = initData.pressure * 1.4;
            faultyData.hotFluidFlowRate = initData.hotFluidFlowRate * 0.8;
          } else if (title.includes('q3:')) {
            faultyData.coldOutletTemperature = initData.coldOutletTemperature * 0.8;
            faultyData.foulingFactor = initData.foulingFactor * 1.2;
          } else if (title.includes('q4:')) {
            faultyData.motorPower = initData.motorPower * 1.25;
          } else if (title.includes('q5:')) {
            faultyData.dischargePressure = initData.dischargePressure * 0.7;
          } else if (title.includes('q6:')) {
            faultyData.npshAvailable = initData.npshAvailable * 0.7;
            faultyData.suctionPressure = initData.suctionPressure * 0.7;
          } else if (title.includes('q7:')) {
            faultyData.agitatorSpeed = initData.agitatorSpeed * 0.6;
          } else if (title.includes('q8:')) {
            faultyData.rateConstant = initData.rateConstant * 0.7;
          } else if (title.includes('q9:')) {
            faultyData.catalystLoading = initData.catalystLoading * 0.6;
          } else if (title.includes('q10:')) {
            faultyData.residenceTime = initData.residenceTime * 0.6;
            faultyData.feedFlowRate = initData.feedFlowRate * 1.4;
          } else if (title.includes('q11:')) {
            faultyData.pressure = initData.pressure * 1.5;
          } else if (title.includes('q12:')) {
            faultyData.residenceTime = initData.residenceTime * 0.6;
            faultyData.feedFlowRate = initData.feedFlowRate * 1.4;
          } else if (title.includes('q13:')) {
            faultyData.refluxRatio = initData.refluxRatio * 0.7;
          } else if (title.includes('q14:')) {
            faultyData.condenserDuty = initData.condenserDuty * 1.4;
            faultyData.reboilerDuty = initData.reboilerDuty * 1.4;
          } else if (title.includes('q15:')) {
            faultyData.pressure = initData.pressure * 1.3;
            faultyData.trayEfficiency = initData.trayEfficiency * 0.7;
          } else {
            // Generic degradation for testing without a specific bounty
            if (faultyData.pressure !== undefined) faultyData.pressure *= 1.25;
            if (faultyData.suctionPressure !== undefined) faultyData.suctionPressure *= 0.8;
            if (faultyData.flowRate !== undefined) faultyData.flowRate *= 0.75;
            if (faultyData.hotFluidFlowRate !== undefined) faultyData.hotFluidFlowRate *= 0.75;
            if (faultyData.feedFlowRate !== undefined) faultyData.feedFlowRate *= 0.75;
            if (faultyData.motorPower !== undefined) faultyData.motorPower *= 1.25;
            if (faultyData.agitatorSpeed !== undefined) faultyData.agitatorSpeed *= 0.7;
            if (faultyData.residenceTime !== undefined) faultyData.residenceTime *= 0.7;
            if (faultyData.refluxRatio !== undefined) faultyData.refluxRatio *= 0.7;
            if (faultyData.trayEfficiency !== undefined) faultyData.trayEfficiency *= 0.7;
          }
          setIndustryData(faultyData);
          setStep(2);
        }
      }
    }).catch(console.error);
  }, [api, preselectedBounty]);

  const handleNext = () => {
    if (step === 1 && equipmentId) {
      const eq = equipmentList.find(e => e._id === equipmentId);
      if (eq) {
        const initData = {};
        eq.requiredInputs.forEach(input => initData[input] = getDefaultValue(input));
        
        // Only reset if it's empty or switching equipment
        if (Object.keys(pilotData).length === 0 || !pilotData.hasOwnProperty(eq.requiredInputs[0])) {
          setPilotData({...initData});
          setIndustryData({...initData});
        }
      }
    }
    setStep(s => s + 1);
  };
  const handlePrev = () => setStep(s => s - 1);

  const runDiagnosis = async () => {
    setLoading(true);
    try {
      let submissionId = null;
      if (preselectedBounty && studentId) {
        const subRes = await api('/submissions', {
          method: 'POST',
          body: {
            bountyId: preselectedBounty._id,
            userId: studentId,
            inputData: industryData,
            hypotheses: [],
            rootCause: "Auto-diagnosed"
          }
        });
        submissionId = subRes._id;
      }

      const pilotRes = await api('/pilot-data', { method: 'POST', body: { equipmentId, ...pilotData } });
      const industryRes = await api('/industry-data', { method: 'POST', body: { equipmentId, ...industryData } });
      const res = await api('/run-diagnosis', { 
        method: 'POST', 
        body: { 
          pilotDataId: pilotRes._id, 
          industrialDataId: industryRes._id,
          submissionId: submissionId
        } 
      });
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
        {[1, 2, 3, 4].map(s => {
          const selectedEqName = equipmentList.find(e => e._id === equipmentId)?.name;
          return (
            <div key={s} style={{ flex: 1, padding: 10, background: step >= s ? '#0b7285' : '#e9ecef', color: step >= s ? '#fff' : '#495057', borderRadius: 4, textAlign: 'center' }}>
              {s === 1 ? `Equipment Used${selectedEqName ? `: ${selectedEqName}` : ''}` : `Step ${s}: ${s === 2 ? 'Pilot Data' : s === 3 ? 'Industry Data' : 'Report'}`}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <div className="wizard-step">
          {preselectedBounty && (
            <div style={{ marginBottom: 20, padding: 15, background: '#e3fafc', borderLeft: '4px solid #0b7285' }}>
              <strong>Solving Bounty:</strong> {preselectedBounty.title}
            </div>
          )}
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
              <label key={k} style={{textTransform: 'capitalize'}}>{k.replace(/([A-Z])/g, ' $1').trim()}
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
              <label key={k} style={{textTransform: 'capitalize'}}>{k.replace(/([A-Z])/g, ' $1').trim()}
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

          {report.physicsTrace && (
            <div className="panel" style={{ marginTop: 20, borderLeft: '4px solid #0b7285', background: '#e3fafc' }}>
              <h4>Java Physics Engine Validation</h4>
              <p style={{ fontSize: '13px', marginBottom: 10 }}>Mathematical proof computed via Navier-Stokes engine integration.</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div style={{ padding: 10, background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                  <small style={{ color: '#495057' }}>Reynolds Number (Re)</small><br/>
                  <strong>{report.physicsTrace.layers?.scaling?.Re ? Number(report.physicsTrace.layers.scaling.Re).toFixed(2) : "-"}</strong>
                </div>
                <div style={{ padding: 10, background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                  <small style={{ color: '#495057' }}>Friction Factor (f)</small><br/>
                  <strong>{report.physicsTrace.layers?.scaling?.frictionFactor ? Number(report.physicsTrace.layers.scaling.frictionFactor).toFixed(4) : "-"}</strong>
                </div>
                <div style={{ padding: 10, background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                  <small style={{ color: '#495057' }}>Pressure Drop (ΔP)</small><br/>
                  <strong>{report.physicsTrace.layers?.integral?.deltaP ? Number(report.physicsTrace.layers.integral.deltaP).toFixed(2) : "-"} Pa</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
                <div style={{ padding: 10, background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                  <small style={{ color: '#495057' }}>Navier-Stokes (Differential Momentum)</small><br/>
                  <strong style={{ fontSize: '13px' }}>{report.physicsTrace.layers?.differential?.velocityProfile?.dominantBehavior || "Solving N-S momentum bounds..."}</strong>
                </div>
                <div style={{ padding: 10, background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                  <small style={{ color: '#495057' }}>Thermodynamic Energy Balance</small><br/>
                  <strong style={{ fontSize: '13px' }}>{report.physicsTrace.layers?.integral?.energyBalance?.method || "First Law verification..."}</strong>
                </div>
              </div>

              <div style={{ marginTop: 10, padding: 10, background: '#fff', borderRadius: 4, border: '1px solid #dee2e6' }}>
                <small style={{ color: '#495057' }}>Flow Regime Evaluation</small><br/>
                <strong>{String(report.physicsTrace.flowRegime || "").toUpperCase()}</strong>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
