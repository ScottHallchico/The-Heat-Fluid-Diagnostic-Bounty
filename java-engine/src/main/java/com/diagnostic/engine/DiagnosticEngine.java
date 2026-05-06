package com.diagnostic.engine;

import com.diagnostic.dto.DiagnosticRequest;
import com.diagnostic.dto.DiagnosticResponse;
import com.diagnostic.service.FishboneRuleEngine;
import com.diagnostic.service.PhysicsService;
import com.diagnostic.service.ValidationService;
import org.springframework.stereotype.Service;

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

        DiagnosticRequest.FluidProperties f = req.fluidProperties;
        DiagnosticRequest.Geometry g = req.geometry;
        DiagnosticRequest.OperatingConditions op = req.operatingConditions;

        double D = g.diameter;
        double L = g.length;
        double epsilon = g.roughness != null ? g.roughness : 0.0;
        double rho = f.rho;
        double mu = f.mu;
        double k = f.k != null ? f.k : 0.0;
        double Cp = f.Cp != null ? f.Cp : 0.0;

        double v = physics.resolveVelocity(op.velocity, op.flowRate, D);
        double Re = physics.reynolds(rho, v, D, mu);
        String flowRegime = physics.classifyFlow(Re);
        double frictionFactor = physics.colebrook(Re, epsilon, D);
        double deltaP = physics.computePressureDrop(frictionFactor, L, D, rho, v);

        double Pr = (k > 0 && Cp > 0) ? physics.prandtl(mu, Cp, k) : 0.0;
        double Nu = (Pr > 0) ? physics.nusselt(Re, Pr) : 0.0;
        double h  = (Nu > 0 && k > 0) ? physics.convectiveH(Nu, k, D) : 0.0;

        Double heatDuty = null;
        if (op.massFlowRate != null && Cp > 0
                && op.inletTemperature != null && op.outletTemperature != null) {
            heatDuty = physics.heatDuty(op.massFlowRate, Cp, op.inletTemperature, op.outletTemperature);
        }

        ValidationService.ValidationResult vr = validation.sanityCheck(Re, deltaP, Nu, h);

        DiagnosticResponse resp = new DiagnosticResponse();
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

        return resp;
    }
}
