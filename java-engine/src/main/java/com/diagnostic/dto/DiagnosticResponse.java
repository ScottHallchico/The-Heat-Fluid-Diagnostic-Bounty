package com.diagnostic.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import java.util.List;

@JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.ANY)
public class DiagnosticResponse {

    public Layers layers = new Layers();
    public String flowRegime;
    public List<String> inferredCauses;
    public Validation validation;

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
