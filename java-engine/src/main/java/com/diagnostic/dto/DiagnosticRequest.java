package com.diagnostic.dto;

public class DiagnosticRequest {

    public FluidProperties fluidProperties;
    public Geometry geometry;
    public OperatingConditions operatingConditions;
    public EquipmentData equipmentData;

    public static class FluidProperties {
        public Double rho;
        public Double mu;
        public Double k;
        public Double Cp;
    }

    public static class Geometry {
        public Double diameter;
        public Double length;
        public Double roughness;
        public Double area;
    }

    public static class OperatingConditions {
        public Double flowRate;
        public Double massFlowRate;
        public Double temperature;
        public Double inletTemperature;
        public Double outletTemperature;
        public Double velocity;
    }

    public static class EquipmentData {
        public Double foulingResistance;
    }
}
