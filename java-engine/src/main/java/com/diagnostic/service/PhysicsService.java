package com.diagnostic.service;

import org.springframework.stereotype.Service;

import static java.lang.Math.*;

@Service
public class PhysicsService {

    // --- Momentum ---

    public double reynolds(double rho, double v, double D, double mu) {
        return mu > 0 ? (rho * v * D) / mu : 0.0;
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
        return D > 0 ? f * (L / D) * (rho * v * v / 2.0) : 0.0;
    }

    public double effectiveViscosity(double K, double n, double v, double D) {
        if (v == 0 || D == 0) return 0.0;
        double shearRate = (8.0 * v) / D;
        return K * Math.pow(shearRate, n - 1.0);
    }

    /** Derives velocity from volumetric flow rate and pipe diameter if velocity not provided. */
    public double resolveVelocity(Double velocity, Double flowRate, double D) {
        if (velocity != null && velocity > 0) return velocity;
        if (flowRate != null && flowRate > 0 && D > 0) return flowRate / (PI * D * D / 4.0);
        return 0.0;
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
        return D > 0 ? Nu * k / D : 0.0;
    }

    public double heatDuty(double massFlowRate, double Cp, double Tin, double Tout) {
        return massFlowRate * Cp * abs(Tout - Tin);
    }

    // --- Mass Transfer ---
    public double sherwood(double Re, double Sc) {
        if (Re < 2300) return 3.66;
        return 0.023 * pow(Re, 0.83) * pow(Sc, 0.33); // Example correlation
    }

    public double schmidt(double mu, double rho, double D_AB) {
        return (rho > 0 && D_AB > 0) ? mu / (rho * D_AB) : 0.0;
    }

    public double massTransferCoefficient(double Sh, double D_AB, double L) {
        return L > 0 ? (Sh * D_AB) / L : 0.0;
    }

    public double oxygenTransferRate(double kla, double C_star, double C) {
        return kla * (C_star - C);
    }

    // --- Reaction Engineering ---
    public double conversion(double initialMoles, double finalMoles) {
        return initialMoles > 0 ? (initialMoles - finalMoles) / initialMoles : 0.0;
    }

    public double residenceTime(double volume, double volumetricFlowRate) {
        return volumetricFlowRate > 0 ? volume / volumetricFlowRate : 0.0;
    }

    public double spaceVelocity(double volumetricFlowRate, double volume) {
        return volume > 0 ? volumetricFlowRate / volume : 0.0;
    }

    public double yield(double actualProduct, double theoreticalProduct) {
        return theoreticalProduct > 0 ? actualProduct / theoreticalProduct : 0.0;
    }
}
