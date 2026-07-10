package com.diagnostic.engine;

import com.diagnostic.dto.DiagnosticRequest;
import com.diagnostic.dto.DiagnosticResponse;
import com.diagnostic.service.FishboneRuleEngine;
import com.diagnostic.service.PhysicsService;
import com.diagnostic.service.ValidationService;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DiagnosticEngine {

    private final PhysicsService physics;
    private final ValidationService validation;
    private final FishboneRuleEngine fishbone;

    public DiagnosticEngine(PhysicsService physics, ValidationService validation, FishboneRuleEngine fishbone) {
        this.physics = physics;
        this.validation = validation;
        this.fishbone = fishbone;
    }

    public DiagnosticResponse execute(DiagnosticRequest req) {
        validation.validateInputs(req);

        DiagnosticRequest.FluidProperties f = req.fluidProperties != null ? req.fluidProperties : new DiagnosticRequest.FluidProperties();
        DiagnosticRequest.Geometry g = req.geometry != null ? req.geometry : new DiagnosticRequest.Geometry();
        DiagnosticRequest.OperatingConditions op = req.operatingConditions != null ? req.operatingConditions : new DiagnosticRequest.OperatingConditions();

        double D = g.diameter != null ? g.diameter : 0.0;
        double L = g.length != null ? g.length : 0.0;
        double epsilon = g.roughness != null ? g.roughness : 0.0;
        double rho = f.rho != null ? f.rho : 0.0;
        double mu = f.mu != null ? f.mu : 0.0;
        double k = f.k != null ? f.k : 0.0;
        double Cp = f.Cp != null ? f.Cp : 0.0;

        double v = physics.resolveVelocity(op.velocity, op.flowRate, D);

        if (f.consistencyIndexK != null && f.flowBehaviorIndexN != null) {
            mu = physics.effectiveViscosity(f.consistencyIndexK, f.flowBehaviorIndexN, v, D);
        }

        double Re = physics.reynolds(rho, v, D, mu);
        String flowRegime = physics.classifyFlow(Re);
        double frictionFactor = physics.colebrook(Re, epsilon, D);
        double deltaP = physics.computePressureDrop(frictionFactor, L, D, rho, v);

        double Pr = (k > 0 && Cp > 0) ? physics.prandtl(mu, Cp, k) : 0.0;
        double Nu = (Pr > 0) ? physics.nusselt(Re, Pr) : 0.0;
        double h  = (Nu > 0 && k > 0) ? physics.convectiveH(Nu, k, D) : 0.0;

        Double heatDuty = null;
        double massFlowRate = op.massFlowRate != null ? op.massFlowRate : (op.flowRate != null ? op.flowRate * rho : 0.0);
        if (massFlowRate > 0 && Cp > 0
                && op.inletTemperature != null && op.outletTemperature != null) {
            heatDuty = physics.heatDuty(massFlowRate, Cp, op.inletTemperature, op.outletTemperature);
        }

        ValidationService.ValidationResult vr = validation.sanityCheck(Re, deltaP, Nu, h);

        DiagnosticResponse resp = new DiagnosticResponse();
        
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Velocity", v, "m/s", "v = resolve(velocity, flowRate, D)"));
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Reynolds Number", Re, "", "Re = (rho * v * D) / mu"));
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Flow Regime", flowRegime, "", "classifyFlow(Re)"));
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Friction Factor", frictionFactor, "", "colebrook(Re, epsilon, D)"));
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Pressure Drop", deltaP, "Pa", "dP = f * (L/D) * (rho*v^2/2)"));
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Prandtl Number", Pr, "", "Pr = (mu * Cp) / k"));
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Nusselt Number", Nu, "", "Nu = nusselt(Re, Pr)"));
        resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Convective H", h, "W/m^2K", "h = Nu * k / D"));
        if (heatDuty != null) {
            resp.intermediateCalculations.add(new DiagnosticResponse.CalculationStep("Heat Duty", heatDuty, "W", "Q = m_dot * Cp * deltaT"));
        }
        resp.layers.integral.deltaP = deltaP;
        resp.layers.integral.heatDuty = heatDuty;
        resp.layers.scaling.Re = Re;
        resp.layers.scaling.Pr = Pr > 0 ? Pr : null;
        resp.layers.scaling.Nu = Nu > 0 ? Nu : null;
        resp.layers.scaling.frictionFactor = frictionFactor;
        resp.flowRegime = flowRegime;
        resp.inferredCauses = fishbone.infer(req, Re, deltaP, h);
        resp.validation = new DiagnosticResponse.Validation();
        resp.validation.checksPassed = vr.checksPassed();
        resp.validation.warnings = vr.warnings();

        List<DiagnosticResponse.DataPoint> analytics = new java.util.ArrayList<>();
        double baseV = v > 0 ? v : 1.0;
        for (double factor = 0.5; factor <= 2.0; factor += 0.25) {
            double testV = baseV * factor;
            double testMu = f.mu != null ? f.mu : 0.0;
            if (f.consistencyIndexK != null && f.flowBehaviorIndexN != null) {
                testMu = physics.effectiveViscosity(f.consistencyIndexK, f.flowBehaviorIndexN, testV, D);
            }
            double testRe = physics.reynolds(rho, testV, D, testMu);
            double testF = physics.colebrook(testRe, epsilon, D);
            double testDP = physics.computePressureDrop(testF, L, D, rho, testV);

            DiagnosticResponse.DataPoint dp = new DiagnosticResponse.DataPoint();
            dp.velocity = testV;
            dp.deltaP = testDP;
            dp.viscosity = testMu;
            dp.Re = testRe;
            analytics.add(dp);
        }
        resp.analyticsData = analytics;

        return resp;
    }
}
