package com.diagnostic;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class DiagnosticControllerIntegrationTest {

    @Autowired MockMvc mvc;

    private static final String VALID_PAYLOAD = """
        {
          "fluidProperties": { "rho": 1000, "mu": 0.001, "k": 0.6, "Cp": 4182 },
          "geometry":        { "diameter": 0.05, "length": 10, "roughness": 0.00015 },
          "operatingConditions": { "velocity": 1.5, "massFlowRate": 2.94,
                                   "inletTemperature": 20, "outletTemperature": 60 }
        }
        """;

    @Test
    void run_validPayload_returns200WithAllLayers() throws Exception {
        mvc.perform(post("/compute/run")
                .contentType(MediaType.APPLICATION_JSON)
                .content(VALID_PAYLOAD))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.flowRegime").isString())
            .andExpect(jsonPath("$.layers.integral.deltaP").isNumber())
            .andExpect(jsonPath("$.layers.scaling.Re").isNumber())
            .andExpect(jsonPath("$.inferredCauses").isArray())
            .andExpect(jsonPath("$.validation.checksPassed").isBoolean());
    }

    @Test
    void run_zeroDiameter_returns400() throws Exception {
        String bad = """
            {
              "fluidProperties": { "rho": 1000, "mu": 0.001 },
              "geometry": { "diameter": 0, "length": 10 },
              "operatingConditions": { "velocity": 1.5 }
            }
            """;
        mvc.perform(post("/compute/run")
                .contentType(MediaType.APPLICATION_JSON)
                .content(bad))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").isString());
    }
}
