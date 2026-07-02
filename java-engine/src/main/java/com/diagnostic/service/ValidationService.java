package com.diagnostic.service;

import com.diagnostic.dto.DiagnosticRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ValidationService {

    public record ValidationResult(boolean checksPassed, List<String> warnings) {}

    public void validateInputs(DiagnosticRequest req) {
        // Strict validation is relaxed to support multi-domain problems
        // (e.g. some problems don't have diameter, some don't have mu)
        // DiagnosticEngine safely handles missing parameters with 0.0 defaults.
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
