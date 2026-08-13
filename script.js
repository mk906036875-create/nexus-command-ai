 /* =========================================================
   NEXUS COMMAND AI — V7
   Enterprise Decision Intelligence Engine
   ========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
  baseRevenue: 2400000,
  baseCustomers: 18420,

  baseRecoveryRate: 0.30,

  minHealth: 0,
  maxHealth: 100,

  riskWeight: {
    conversion: 35,
    cancellation: 25,
    fulfillment: 20,
    response: 20
  }
};


/* =========================================================
   DOM HELPER
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   SAFE HELPERS
========================================================= */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


function numberValue(element, fallback = 0) {

  if (!element) {
    return fallback;
  }

  const value = parseFloat(element.value);

  return Number.isFinite(value)
    ? value
    : fallback;
}


function money(value) {

  if (!Number.isFinite(value)) {
    return "$0";
  }

  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
}


function percent(value) {

  return Math.round(value) + "%";
}


function setText(element, value) {

  if (element) {
    element.textContent = value;
  }
}


/* =========================================================
   DOM REFERENCES
========================================================= */

const conversionInput =
  $("conversionInput");

const cancellationInput =
  $("cancellationInput");

const fulfillmentInput =
  $("fulfillmentInput");

const responseInput =
  $("responseInput");


const conversionValue =
  $("conversionValue");

const cancellationValue =
  $("cancellationValue");

const fulfillmentValue =
  $("fulfillmentValue");

const responseValue =
  $("responseValue");


const liveRiskScore =
  $("liveRiskScore");

const liveExposure =
  $("liveExposure");

const liveRecovery =
  $("liveRecovery");


const healthScore =
  $("healthScore");

const healthText =
  $("healthText");

const healthBadge =
  $("healthBadge");


const revenueRisk =
  $("revenueRisk");

const recoverableRevenue =
  $("recoverableRevenue");

const customersRisk =
  $("customersRisk");


const confidence =
  $("confidence");

const confidenceValue =
  $("confidenceValue");


const decisionRecovery =
  $("decisionRecovery");

const decisionConfidence =
  $("decisionConfidence");


const forecastNumber =
  $("forecastNumber");

const recoveryPercent =
  $("recoveryPercent");

const recoveryProgress =
  $("recoveryProgress");

const roiNumber =
  $("roiNumber");


const aiResponse =
  $("aiResponse");

const analystInput =
  $("analystInput");


/* =========================================================
   ADDITIONAL OPTIONAL ELEMENTS
========================================================= */

const riskMessage =
  $("riskMessage");

const exposureValue =
  $("exposureValue");

const recoveryValue =
  $("recoveryValue");

const forecastText =
  $("forecastText");

const actionStatus =
  $("actionStatus");

const simulatorResult =
  $("simulatorResult");

const simulatorRecovery =
  $("simulatorRecovery");

const simulatorHealth =
  $("simulatorHealth");

const simulatorRisk =
  $("simulatorRisk");

const analystOutput =
  $("analystOutput");

const lastUpdated =
  $("lastUpdated");

const resetButton =
  $("resetButton");


/* =========================================================
   DEFAULT SIGNALS
========================================================= */

const DEFAULTS = {
  conversion: 2.84,
  cancellation: 8.7,
  fulfillment: 12.4,
  response: 31
};


/* =========================================================
   SIGNAL ENGINE
========================================================= */

function calculateSignals() {

  const conversion =
    numberValue(
      conversionInput,
      DEFAULTS.conversion
    );

  const cancellation =
    numberValue(
      cancellationInput,
      DEFAULTS.cancellation
    );

  const fulfillment =
    numberValue(
      fulfillmentInput,
      DEFAULTS.fulfillment
    );

  const response =
    numberValue(
      responseInput,
      DEFAULTS.response
    );


  /* -------------------------------------------------------
     CONVERSION RISK
  ------------------------------------------------------- */

  const conversionRisk =
    clamp(
      ((3.8 - conversion) / 3.3) *
      CONFIG.riskWeight.conversion,
      0,
      CONFIG.riskWeight.conversion
    );


  /* -------------------------------------------------------
     CANCELLATION RISK
  ------------------------------------------------------- */

  const cancellationRisk =
    clamp(
      (cancellation / 20) *
      CONFIG.riskWeight.cancellation,
      0,
      CONFIG.riskWeight.cancellation
    );


  /* -------------------------------------------------------
     FULFILLMENT RISK
  ------------------------------------------------------- */

  const fulfillmentRisk =
    clamp(
      (fulfillment / 30) *
      CONFIG.riskWeight.fulfillment,
      0,
      CONFIG.riskWeight.fulfillment
    );


  /* -------------------------------------------------------
     RESPONSE RISK
  ------------------------------------------------------- */

  const responseRisk =
    clamp(
      (response / 100) *
      CONFIG.riskWeight.response,
      0,
      CONFIG.riskWeight.response
    );


  /* -------------------------------------------------------
     TOTAL RISK
  ------------------------------------------------------- */

  const risk =
    Math.round(
      clamp(
        conversionRisk +
        cancellationRisk +
        fulfillmentRisk +
        responseRisk,
        0,
        100
      )
    );


  /* -------------------------------------------------------
     REVENUE EXPOSURE
  ------------------------------------------------------- */

  const exposureMultiplier =
    0.55 +
    (risk / 100) * 0.75;

  const exposure =
    CONFIG.baseRevenue *
    exposureMultiplier;


  /* -------------------------------------------------------
     RECOVERY
  ------------------------------------------------------- */

  const recoveryRate =
    CONFIG.baseRecoveryRate +
    (risk / 100) * 0.12;

  const recovery =
    exposure *
    recoveryRate;


  /* -------------------------------------------------------
     BUSINESS HEALTH
  ------------------------------------------------------- */

  const health =
    Math.round(
      clamp(
        100 - risk,
        CONFIG.minHealth,
        CONFIG.maxHealth
      )
    );


  /* -------------------------------------------------------
     CUSTOMER RISK
  ------------------------------------------------------- */

  const customers =
    Math.round(
      CONFIG.baseCustomers *
      (
        0.55 +
        (risk / 100) * 0.45
      )
    );


  /* -------------------------------------------------------
     AI CONFIDENCE
  ------------------------------------------------------- */

  const confidenceScore =
    Math.round(
      clamp(
        78 +
        Math.abs(risk - 50) * 0.42,
        78,
        98
      )
    );


  /* -------------------------------------------------------
     UPDATE UI
  ------------------------------------------------------- */

  updateSignalValues(
    conversion,
    cancellation,
    fulfillment,
    response
  );


  updateResults(
    risk,
    exposure,
    recovery,
    health,
    customers,
    confidenceScore
  );


  updateRiskMessage(
    risk,
    exposure,
    recovery
  );


  updateForecast(
    risk,
    exposure,
    recovery
  );


  updateTimestamp();


  return {
    conversion,
    cancellation,
    fulfillment,
    response,

    conversionRisk,
    cancellationRisk,
    fulfillmentRisk,
    responseRisk,

    risk,
    exposure,
    recovery,
    health,
    customers,
    confidenceScore
  };
}


/* =========================================================
   UPDATE SIGNAL VALUES
========================================================= */

function updateSignalValues(
  conversion,
  cancellation,
  fulfillment,
  response
) {

  setText(
    conversionValue,
    conversion.toFixed(2) + "%"
  );

  setText(
    cancellationValue,
    cancellation.toFixed(1) + "%"
  );

  setText(
    fulfillmentValue,
    fulfillment.toFixed(1) + "%"
  );

  setText(
    responseValue,
    "+" + Math.round(response) + "%"
  );
}


/* =========================================================
   UPDATE MAIN RESULTS
========================================================= */

function updateResults(
  risk,
  exposure,
  recovery,
  health,
  customers,
  confidenceScore
) {

  setText(
    liveRiskScore,
    risk + "/100"
  );

  setText(
    liveExposure,
    money(exposure)
  );

  setText(
    liveRecovery,
    money(recovery)
  );


  setText(
    revenueRisk,
    money(exposure)
  );

  setText(
    recoverableRevenue,
    money(recovery)
  );

  setText(
    customersRisk,
    customers.toLocaleString()
  );


  /* -------------------------------------------------------
     HEALTH
  ------------------------------------------------------- */

  setText(
    healthScore,
    health
  );


  if (healthText) {

    if (health >= 80) {

      healthText.textContent =
        "Strong";

    } else if (health >= 60) {

      healthText.textContent =
        "Good";

    } else if (health >= 40) {

      healthText.textContent =
        "Attention";

    } else {

      healthText.textContent =
        "Critical";
    }
  }


  if (healthBadge) {

    if (health >= 80) {

      healthBadge.textContent =
        "STRONG";

    } else if (health >= 60) {

      healthBadge.textContent =
        "ATTENTION";

    } else {

      healthBadge.textContent =
        "HIGH RISK";
    }
  }


  /* -------------------------------------------------------
     CONFIDENCE
  ------------------------------------------------------- */

  setText(
    confidence,
    confidenceScore + "%"
  );

  setText(
    confidenceValue,
    confidenceScore + "%"
  );


  /* -------------------------------------------------------
     AI DECISION
  ------------------------------------------------------- */

  const priorityRecovery =
    recovery * 0.20;


  setText(
    decisionRecovery,
    money(priorityRecovery)
  );


  setText(
    decisionConfidence,
    Math.max(
      82,
      confidenceScore - 4
    ) + "%"
  );


  /* -------------------------------------------------------
     RECOVERY PERCENT
  ------------------------------------------------------- */

  const recoveryPct =
    Math.round(
      clamp(
        (recovery / exposure) * 100,
        0,
        100
      )
    );


  setText(
    recoveryPercent,
    recoveryPct + "%"
  );


  if (recoveryProgress) {

    recoveryProgress.style.width =
      recoveryPct + "%";
  }


  /* -------------------------------------------------------
     ROI
  ------------------------------------------------------- */

  const estimatedInvestment =
    Math.max(
      5000,
      recovery * 0.08
    );

  const roi =
    Math.round(
      ((recovery - estimatedInvestment) /
        estimatedInvestment) * 100
    );


  setText(
    roiNumber,
    roi + "%"
  );
}


/* =========================================================
   RISK MESSAGE
========================================================= */

function updateRiskMessage(
  risk,
  exposure,
  recovery
) {

  if (!riskMessage) {
    return;
  }


  let level =
    "LOW";

  let message =
    "Business signals are within a healthy range.";


  if (risk >= 75) {

    level =
      "CRITICAL";

    message =
      "Multiple high-impact signals indicate immediate revenue exposure.";

  } else if (risk >= 55) {

    level =
      "HIGH";

    message =
      "Revenue leakage is becoming material and should be investigated.";

  } else if (risk >= 35) {

    level =
      "MODERATE";

    message =
      "Early warning signals are developing across the business.";
  }


  riskMessage.textContent =
    level +
    " — " +
    message +
    " Estimated exposure: " +
    money(exposure) +
    ". Recovery potential: " +
    money(recovery) +
    ".";
}


/* =========================================================
   FORECAST ENGINE
========================================================= */

function updateForecast(
  risk,
  exposure,
  recovery
) {

  const forecast =
    CONFIG.baseRevenue +
    recovery -
    (exposure * 0.10);


  setText(
    forecastNumber,
    money(forecast)
  );


  if (forecastText) {

    if (risk >= 70) {

      forecastText.textContent =
        "High-risk trajectory. Immediate intervention recommended.";

    } else if (risk >= 45) {

      forecastText.textContent =
        "Moderate-risk trajectory. Corrective action recommended.";

    } else {

      forecastText.textContent =
        "Stable trajectory with manageable revenue exposure.";
    }
  }
}


/* =========================================================
   INVESTIGATE BUSINESS RISK
========================================================= */

function investigateRisk() {

  const data =
    calculateSignals();


  const target =
    document.getElementById("risk");


  if (target) {

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }


  showToast(
    "Risk investigation complete — " +
    data.risk +
    "/100 exposure detected."
  );
}


/* =========================================================
   EXECUTE AI ACTION
========================================================= */

function executeAction() {

  const data =
    calculateSignals();


  const action =
    getRecommendedAction(
      data.risk
    );


  if (actionStatus) {

    actionStatus.textContent =
      action;
  }


  if (aiResponse) {

    aiResponse.textContent =
      action;
  }


  showToast(
    "AI Action generated successfully."
  );
}


/* =========================================================
   RECOMMENDED ACTION
========================================================= */

function getRecommendedAction(risk) {

  if (risk >= 75) {

    return (
      "Priority Action: Launch immediate revenue-recovery " +
      "intervention. Review conversion friction, fulfillment " +
      "delays and customer-response bottlenecks."
    );

  }


  if (risk >= 55) {

    return (
      "Priority Action: Investigate the highest-risk signals " +
      "and deploy targeted recovery workflows within 24 hours."
    );

  }


  if (risk >= 35) {

    return (
      "Priority Action: Monitor emerging leakage and optimize " +
      "the weakest operational signal before exposure increases."
    );
  }


  return (
    "Priority Action: Maintain current operating conditions " +
    "while continuously monitoring business signals."
  );
}


/* =========================================================
   AI ANALYST
========================================================= */

function runAnalyst() {

  const question =
    analystInput
      ? analystInput.value.trim()
      : "";


  const data =
    calculateSignals();


  if (!question) {

    if (analystOutput) {

      analystOutput.textContent =
        "Ask NEXUS a business question such as: " +
        "\"Where should we focus first?\"";
    }

    return;
  }


  let answer =
    "";


  const q =
    question.toLowerCase();


  if (
    q.includes("risk") ||
    q.includes("danger")
  ) {

    answer =
      "Current business risk is " +
      data.risk +
      "/100. Estimated exposure is " +
      money(data.exposure) +
      ". The highest priority is to investigate the signals contributing most to this score.";

  } else if (
    q.includes("recover") ||
    q.includes("revenue")
  ) {

    answer =
      "Estimated recoverable revenue is " +
      money(data.recovery) +
      ". Recommended priority recovery allocation is " +
      money(data.recovery * 0.20) +
      ".";

  } else if (
    q.includes("customer")
  ) {

    answer =
      data.customers.toLocaleString() +
      " customers are currently classified within the elevated-risk model. Focus on retention and response-time improvements.";

  } else if (
    q.includes("conversion")
  ) {

    answer =
      "Conversion is currently " +
      data.conversion.toFixed(2) +
      "%. Improving conversion toward the modeled healthy range can materially reduce revenue exposure.";

  } else if (
    q.includes("action") ||
    q.includes("what should")
  ) {

    answer =
      getRecommendedAction(
        data.risk
      );

  } else {

    answer =
      "NEXUS analysis: current risk is " +
      data.risk +
      "/100, estimated exposure is " +
      money(data.exposure) +
      ", and recovery potential is " +
      money(data.recovery) +
      ". Prioritize the highest-risk signal first.";
  }


  if (analystOutput) {

    analystOutput.textContent =
      answer;
  }


  if (aiResponse) {

    aiResponse.textContent =
      answer;
  }


  showToast(
    "NEXUS Analyst completed analysis."
  );
}


/* =========================================================
   WHAT-IF SIMULATOR
========================================================= */

function runSimulator() {

  const data =
    calculateSignals();


  const improvedConversion =
    Math.min(
      6,
      data.conversion + 0.8
    );

  const improvedCancellation =
    Math.max(
      0,
      data.cancellation - 2
    );

  const improvedFulfillment =
    Math.max(
      0,
      data.fulfillment - 3
    );

  const improvedResponse =
    Math.max(
      0,
      data.response - 8
    );


  const simulatedConversionRisk =
    clamp(
      ((3.8 - improvedConversion) / 3.3) * 35,
      0,
      35
    );


  const simulatedCancellationRisk =
    clamp(
      (improvedCancellation / 20) * 25,
      0,
      25
    );


  const simulatedFulfillmentRisk =
    clamp(
      (improvedFulfillment / 30) * 20,
      0,
      20
    );


  const simulatedResponseRisk =
    clamp(
      (improvedResponse / 100) * 20,
      0,
      20
    );


  const simulatedRisk =
    Math.round(
      clamp(
        simulatedConversionRisk +
        simulatedCancellationRisk +
        simulatedFulfillmentRisk +
        simulatedResponseRisk,
        0,
        100
      )
    );


  const simulatedHealth =
    100 -
    simulatedRisk;


  const simulatedExposure =
    CONFIG.baseRevenue *
    (
      0.55 +
      (simulatedRisk / 100) * 0.75
    );


  const simulatedRecoveryRate =
    CONFIG.baseRecoveryRate +
    (simulatedRisk / 100) * 0.12;


  const simulatedRecovery =
    simulatedExposure *
    simulatedRecoveryRate;


  setText(
    simulatorRisk,
    simulatedRisk + "/100"
  );

  setText(
    simulatorHealth,
    simulatedHealth + "/100"
  );

  setText(
    simulatorRecovery,
    money(simulatedRecovery)
  );


  if (simulatorResult) {

    simulatorResult.textContent =
      "Scenario result: reducing cancellation, fulfillment " +
      "delay and response time while improving conversion " +
      "could reduce modeled risk from " +
      data.risk +
      "/100 to " +
      simulatedRisk +
      "/100 and produce estimated recovery potential of " +
      money(simulatedRecovery) +
      ".";
  }


  showToast(
    "What-If scenario simulated."
  );
}


/* =========================================================
   RESET SIGNALS
========================================================= */

function resetSignals() {

  if (conversionInput) {
    conversionInput.value =
      DEFAULTS.conversion;
  }

  if (cancellationInput) {
    cancellationInput.value =
      DEFAULTS.cancellation;
  }

  if (fulfillmentInput) {
    fulfillmentInput.value =
      DEFAULTS.fulfillment;
  }

  i
