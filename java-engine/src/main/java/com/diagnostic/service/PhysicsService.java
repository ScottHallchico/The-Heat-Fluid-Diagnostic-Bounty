package com.diagnostic.service;

import org.springframework.stereotype.Service;

import static java.lang.Math.*;

@Service
public class PhysicsService {

    // --- Momentum ---

    public double reynolds(double rho, double v, double D, double mu) {
        return (rho * v * D) / mu;
    }

    public String classifyFlow(double Re) {
        if (Re < 2300) return "laminar";
        if (Re < 4000) return "transition";
        return "turbulent";
    }

    public double colebrook(double Re, double epsilon, double D) {
        if (Re < 2300) return 64.0 / Re;
        double f = 0.02;
        for (int i = 0; i < 50; i++) {
            double rhs = -2.0 * log10((epsilon / (3.7 * D)) + (2.51 / (Re * sqrt(f))));
            f = 1.0 / (rhs * rhs);
        }
        return f;
    }

    public double computePressureDrop(double f, double L, double D, double rho, double v) {
        return f * (L / D) * (rho * v * v / 2.0);
    }

    /** Derives velocity from volumetric flow rate and pipe diameter if velocity not provided. */
    public double resolveVelocity(Double velocity, Double flowRate, double D) {
        if (velocity != null && velocity > 0) return velocity;
        if (flowRate != null && flowRate > 0) return flowRate / (PI * D * D / 4.0);
        throw new IllegalArgumentException("Either velocity or flowRate must be provided and positive");
    }

    // --- Heat Transfer ---

    public double prandtl(double mu, double Cp, double k) {
        return (mu * Cp) / k;
    }

    public double nusselt(double Re, double Pr) {
        if (Re < 2300) return 3.66;
        if (Re >= 4000) return 0.023 * pow(Re, 0.8) * pow(Pr, 0.4);
        // linear interpolation through transition zone
        double nuLam = 3.66;
        double nuTurb = 0.023 * pow(4000, 0.8) * pow(Pr, 0.4);
        double t = (Re - 2300) / (4000 - 2300);
        return nuLam + t * (nuTurb - nuLam);
    }

    public double convectiveH(double Nu, double k, double D) {
        return Nu * k / D;
    }

    public double heatDuty(double massFlowRate, double Cp, double Tin, double Tout) {
        return massFlowRate * Cp * abs(Tout - Tin);
    }
}
