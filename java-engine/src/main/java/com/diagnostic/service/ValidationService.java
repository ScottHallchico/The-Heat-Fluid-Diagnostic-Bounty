package com.diagnostic.service;

import com.diagnostic.dto.DiagnosticRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ValidationService {

    public record ValidationResult(boolean checksPassed, List<String> warnings) {}

    public void validateInputs(DiagnosticRequest req) {
        DiagnosticRequest.Geometry g = req.geometry;
        DiagnosticRequest.FluidProperties f = req.fluidProperties;
        DiagnosticRequest.OperatingConditions op = req.operatingConditions;

        if (g == null || g.diameter == null || g.diameter <= 0)
            throw new IllegalArgumentException("geometry.diameter must be positive");
        if (g.length == null || g.length <= 0)
            throw new IllegalArgumentException("geometry.length must be positive");
        if (f == null || f.rho == null || f.rho <= 0)
            throw new IllegalArgumentException("fluidProperties.rho must be positive");
        if (f.mu == null || f.mu <= 0)
            throw new IllegalArgumentException("fluidProperties.mu must be positive");
        boolean noVelocity = op == null || (isNullOrZero(op.velocity) && isNullOrZero(op.flowRate));
        if (noVelocity)
            throw new IllegalArgumentException("Either operatingConditions.velocity or flowRate must be provided");
    }

    public ValidationResult sanityCheck(double Re, double deltaP, double Nu, double h) {
        List<String> warnings = new ArrayList<>();
        if (deltaP > 1e6) warnings.add("Unrealistic pressure drop (>1 MPa)");
        if (Re > 1e7)     warnings.add("Extremely high Reynolds number — verify inputs");
        if (Nu < 1)       warnings.add("Nusselt number below physical minimum");
        if (h <= 0)       warnings.add("Non-positive heat transfer coefficient");
        return new ValidationResult(warnings.isEmpty(), warnings);
    }

    private boolean isNullOrZero(Double v) {
        return v == null || v == 0.0;
    }
}
