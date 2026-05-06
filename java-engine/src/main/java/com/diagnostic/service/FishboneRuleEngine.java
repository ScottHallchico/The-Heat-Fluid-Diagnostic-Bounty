package com.diagnostic.service;

import com.diagnostic.dto.DiagnosticRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

@Service
public class FishboneRuleEngine {

    private record Rule(Supplier<Boolean> condition, String cause) {}

    public List<String> infer(DiagnosticRequest req, double Re, double deltaP, double h) {
        double roughness = safeVal(req.geometry != null ? req.geometry.roughness : null);
        Double foulingResistance = req.equipmentData != null ? req.equipmentData.foulingResistance : null;

        List<Rule> rules = List.of(
            new Rule(() -> roughness > 0.001 && deltaP > 5000,
                     "[Machine] Pipe fouling or roughness increase detected"),
            new Rule(() -> h > 0 && h < 500,
                     "[Machine] Heat transfer degradation — possible fouling on heat transfer surface"),
            new Rule(() -> Re >= 2300 && Re <= 4000,
                     "[Method] Unstable transition flow regime — check pump operation and flow control"),
            new Rule(() -> foulingResistance != null && foulingResistance > 0,
                     "[Material] Fouling resistance detected — schedule cleaning")
        );

        List<String> causes = new ArrayList<>();
        for (Rule rule : rules) {
            if (rule.condition().get()) causes.add(rule.cause());
        }
        if (causes.isEmpty()) {
            causes.add("[Milieu] No dominant root cause identified — review measurement data");
        }
        return causes;
    }

    private double safeVal(Double v) {
        return v != null ? v : 0.0;
    }
}
