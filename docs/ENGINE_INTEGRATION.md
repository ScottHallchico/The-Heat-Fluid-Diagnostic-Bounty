# Java Engine Integration Guide

The React frontend does not call the Java engine directly.

It calls the Node backend:

```text
POST /api/diagnose/run
```

That route is implemented here:

```text
src/routes/diagnose.js
```

The Java/mock switch is implemented here:

```text
src/services/engineService.js
```

## Current Mode

The project currently uses a mock engine:

```text
USE_MOCK_ENGINE=true
```

This gives the frontend realistic diagnostic traces before the Java engine is ready.

## Switching To Java

In `.env`, change:

```text
USE_MOCK_ENGINE=false
JAVA_ENGINE_URL=http://localhost:8080
```

The Node backend will then call:

```text
POST http://localhost:8080/compute/run
```

## Payload Sent To Java

```json
{
  "submissionId": "MongoObjectId",
  "inputData": {
    "fluidProperties": {
      "rho": 997,
      "mu": 0.00089
    },
    "geometry": {
      "diameter": 0.05,
      "length": 25,
      "roughness": 0.000045
    },
    "operatingConditions": {
      "flowRate": 0.004,
      "temperature": 25
    }
  },
  "hypotheses": [
    "Fouling increased internal roughness"
  ],
  "rootCause": "Likely pipe fouling or restriction"
}
```

## Expected Java Response Shape

```json
{
  "layers": {
    "integral": {
      "deltaP": 9421.3,
      "energyBalance": {}
    },
    "differential": {
      "velocityProfile": {},
      "boundaryLayer": {}
    },
    "scaling": {
      "Re": 113900,
      "Pr": 6.2,
      "Nu": 180,
      "frictionFactor": 0.024
    }
  },
  "flowRegime": "turbulent",
  "intermediateCalculations": [
    {
      "step": "Reynolds number",
      "value": 113900,
      "equation": "Re = rho v D / mu"
    }
  ],
  "inferredCauses": [
    "Possible fouling layer"
  ],
  "validation": {
    "checksPassed": true,
    "warnings": [],
    "methods": ["scaling_analysis", "sanity_check"]
  },
  "rawEngineResponse": {}
}
```

The Node backend stores this response in MongoDB as a `diagnostic_traces` document and links it to the student submission.
