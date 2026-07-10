package com.diagnostic.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import java.util.List;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class DiagnosticResponse {

    public Layers layers = new Layers();
    public String flowRegime;
    public List<String> inferredCauses;
    public Validation validation;
    public List<DataPoint> analyticsData;
    public List<CalculationStep> intermediateCalculations = new java.util.ArrayList<>();

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class CalculationStep {
        public String step;
        public Object value;
        public String unit;
        public String equation;
        
        public CalculationStep(String step, Object value, String unit, String equation) {
            this.step = step;
            this.value = value;
            this.unit = unit;
            this.equation = equation;
        }
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class DataPoint {
        public double velocity;
        public double deltaP;
        public double viscosity;
        public double Re;
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class Layers {
        public Integral integral = new Integral();
        public Differential differential = new Differential();
        public Scaling scaling = new Scaling();
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class Integral {
        public Double deltaP;
        public Double heatDuty;
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class Differential {}

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class Scaling {
        public Double Re;
        public Double Pr;
        public Double Nu;
        public Double frictionFactor;
    }

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
    public static class Validation {
        public boolean checksPassed;
        public List<String> warnings;
    }
}
