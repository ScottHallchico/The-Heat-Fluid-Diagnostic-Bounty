package com.diagnostic.controller;

import com.diagnostic.dto.DiagnosticRequest;
import com.diagnostic.dto.DiagnosticResponse;
import com.diagnostic.engine.DiagnosticEngine;
import com.diagnostic.service.ValidationService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/compute")
public class DiagnosticController {

    private final DiagnosticEngine engine;
    private final ValidationService validation;

    public DiagnosticController(DiagnosticEngine engine, ValidationService validation) {
        this.engine = engine;
        this.validation = validation;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "java-compute-engine");
    }

    @PostMapping("/run")
    public DiagnosticResponse run(@RequestBody DiagnosticRequest request) {
        return engine.execute(request);
    }

    @PostMapping("/validate")
    public Map<String, Boolean> validate(@RequestBody DiagnosticRequest request) {
        validation.validateInputs(request);
        return Map.of("valid", true);
    }
}
