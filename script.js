 /* =========================================================
   NEXUS COMMAND AI — V8.1
   Enterprise Autonomous Decision Intelligence Engine
   Corrected + Stable Production Demo
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

  simulationDelay: 1400
};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const qs = (selector) =>
  document.querySelector(selector);

const qsa = (selector) =>
  [...document.querySelectorAll(selector)];


/* =========================================================
   UTILITIES
========================================================= */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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


function numberValue(element, fallback = 0) {

  if (!element) {
    return fallback;
  }

  const value = parseFloat(element.value);

  return Number.isFinite(value)
    ? value
    : fallback;
}


function setText(element, value) {

  if (element) {
    element.textContent = value;
  }
}


/* =========================================================
   DOM REFERENCES
========================================================= */

/* Inputs */

const conversionInput =
  $("conversionInput");

const cancellationInput =
  $("cancellationInput");

const fulfillmentInput =
  $("fulfillmentInput");

const responseInput =
  $("responseInput");


/* Signal values */

const conversionValue =
  $("conversionValue");

const cancellationValue =
  $("cancellationValue");

const fulfillmentValue =
  $("fulfillmentValue");

const responseValue =
  $("responseValue");


/* Signal status */

const conversionStatus =
  $("conversionStatus");

const cancellationStatus =
  $("cancellationStatus");

const fulfillmentStatus =
  $("fulfillmentStatus");

const responseStatus =
  $("responseStatus");


/* Main health */

const healthScore =
  $("healthScore");

const healthStatus =
  $("healthStatus");

const healthText =
  $("healthText");

const healthBadge =
  $("healthBadge");


/* Revenue */

const revenueRisk =
  $("revenueRisk");

const recoverableRevenue =
  $("recoverableRevenue");

const customersRisk =
  $("customersRisk");


/* AI confidence */

const confidenceValue =
  $("confidenceValue");

const decisionConfidence =
  $("decisionConfidence");


/* AI decision */

const decisionTitle =
  $("decisionTitle");

const decisionDescription =
  $("decisionDescription");

const decisionRecovery =
  $("decisionRecovery");


/* Risk exposure */

const conversionExposure =
  $("conversionExposure");

const fulfillmentExposure =
  $("fulfillmentExposure");

const cancellationExposure =
  $("cancellationExposure");

const responseExposure =
  $("responseExposure");


/* Executive alert */

const alertTitle =
  $("alertTitle");

const alertDescription =
  $("alertDescription");


/* Forecast */

const forecastNumber =
  $("forecastNumber");

const recoveryPercent =
  $("recoveryPercent");

const recoveryProgress =
  $("recoveryProgress");


/* Analyst */

const aiResponse =
  $("aiResponse");

const analystInput =
  $("analystInput");


/* Action result */

const actionResult =
  $("actionResult");


/* What-if simulator */

const targetConversion =
  $("targetConversion");

const targetCancellation =
  $("targetCancellation");

const targetConversionValue =
  $("targetConversionValue");

const targetCancellationValue =
  $("targetCancellationValue");

const simulatedHealth =
  $("simulatedHealth");


/* =========================================================
   SIGNAL STATUS ENGINE
========================================================= */

function getSignalStatus(
  type,
  value
) {

  if (type === "conversion") {

    if (value < 2.5)
      return "CRITICAL";

    if (value < 3.5)
      return "HIGH";

    if (value < 4.2)
      return "WATCH";

    return "HEALTHY";
  }


  if (type === "cancellation") {

    if (value >= 12)
      return "CRITICAL";

    if (value >= 8)
      return "HIGH";

    if (value >= 5)
      return "WATCH";

    return "HEALTHY";
  }


  if (type === "fulfillment") {

    if (value >= 20)
      return "CRITICAL";

    if (value >= 12)
      return "HIGH";

    if (value >= 7)
      return "WATCH";

    return "HEALTHY";
  }


  if (type === "response") {

    if (value >= 60)
      return "CRITICAL";

    if (value >= 30)
      return "HIGH";

    if (value >= 15)
      return "WATCH";

    return "HEALTHY";
  }


  return "WATCH";
}


/* =========================================================
   SIGNAL ENGINE
========================================================= */

function calculateSignals() {

  const conversion =
    numberValue(
      conversionInput,
      2.84
    );

  const cancellation =
    numberValue(
      cancellationInput,
      8.7
    );

  const fulfillment =
    numberValue(
      fulfillmentInput,
      12.4
    );

  const response =
    numberValue(
      responseInput,
      31
    );


  /* -----------------------------------------
     INDIVIDUAL RISK
  ----------------------------------------- */

  const conversionRisk =
    clamp(
      ((3.8 - conversion) / 3.3) * 35,
      0,
      35
    );

  const cancellationRisk =
    clamp(
      (cancellation / 20) * 25,
      0,
      25
    );

  const fulfillmentRisk =
    clamp(
      (fulfillment / 30) * 20,
      0,
      20
    );

  const responseRisk =
    clamp(
      (response / 100) * 20,
      0,
      20
    );


  /* -----------------------------------------
     TOTAL RISK
  ----------------------------------------- */

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


  /* -----------------------------------------
     REVENUE EXPOSURE
  ----------------------------------------- */

  const exposureMultiplier =
    0.55 +
    (risk / 100) * 0.75;

  const exposure =
    CONFIG.baseRevenue *
    exposureMultiplier;


  /* -----------------------------------------
     RECOVERY
  ----------------------------------------- */

  const recoveryRate =
    CONFIG.baseRecoveryRate +
    (risk / 100) * 0.12;

  const recovery =
    exposure *
    recoveryRate;


  /* -----------------------------------------
     HEALTH
  ----------------------------------------- */

  const health =
    Math.round(
      clamp(
        100 - risk,
        CONFIG.minHealth,
        CONFIG.maxHealth
      )
    );


  /* -----------------------------------------
     CUSTOMERS AT RISK
  ----------------------------------------- */

  const customers =
    Math.round(
      CONFIG.baseCustomers *
      (
        0.55 +
        (risk / 100) * 0.45
      )
    );


  /* -----------------------------------------
     AI CONFIDENCE
  ----------------------------------------- */

  const confidenceScore =
    Math.round(
      clamp(
        78 +
        Math.abs(risk - 50) * 0.42,
        78,
        98
      )
    );


  updateSignalValues(
    conversion,
    cancellation,
    fulfillment,
    response
  );


  updateSignalStatuses(
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


  updateRiskExposure(
    conversion,
    cancellation,
    fulfillment,
    response
  );


  updateExecutiveAlert(
    risk,
    health,
    exposure,
    recovery
  );


  updateDecision(
    risk,
    conversion,
    cancellation,
    fulfillment,
    response,
    recovery,
    confidenceScore
  );


  return {
    conversion,
    cancellation,
    fulfillment,
    response,
    risk,
    exposure,
    recovery,
    health,
    customers,
    confidenceScore
  };
}


/* =========================================================
   SIGNAL VALUES
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
   SIGNAL STATUS
========================================================= */

function updateSignalStatuses(
  conversion,
  cancellation,
  fulfillment,
  response
) {

  setText(
    conversionStatus,
    getSignalStatus(
      "conversion",
      conversion
    )
  );

  setText(
    cancellationStatus,
    getSignalStatus(
      "cancellation",
      cancellation
    )
  );

  setText(
    fulfillmentStatus,
    getSignalStatus(
      "fulfillment",
      fulfillment
    )
  );

  setText(
    responseStatus,
    getSignalStatus(
      "response",
      response
    )
  );
}


/* =========================================================
   RESULTS
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


  /* -----------------------------------------
     HEALTH TEXT
  ----------------------------------------- */

  let healthLabel =
    "Critical";

  let badgeLabel =
    "HIGH RISK";

  let statusLabel =
    "SYSTEM CRITICAL";


  if (health >= 80) {

    healthLabel =
      "Strong";

    badgeLabel =
      "STRONG";

    statusLabel =
      "SYSTEM STABLE";

  }

  else if (health >= 60) {

    healthLabel =
      "Good";

    badgeLabel =
      "ATTENTION";

    statusLabel =
      "SYSTEM WATCH";

  }

  else if (health >= 40) {

    healthLabel =
      "Attention";

    badgeLabel =
      "HIGH RISK";

    statusLabel =
      "SYSTEM AT RISK";
  }


  setText(
    healthScore,
    health
  );

  setText(
    healthText,
    healthLabel
  );

  setText(
    healthBadge,
    badgeLabel
  );

  setText(
    healthStatus,
    statusLabel
  );


  /* -----------------------------------------
     CONFIDENCE
  ----------------------------------------- */

  setText(
    confidenceValue,
    confidenceScore + "%"
  );

  setText(
    decisionConfidence,
    Math.max(
      82,
      confidenceScore - 4
    ) + "%"
  );


  /* -----------------------------------------
     PRIORITY RECOVERY
  ----------------------------------------- */

  setText(
    decisionRecovery,
    money(recovery * 0.20)
  );


  /* -----------------------------------------
     FORECAST
  ----------------------------------------- */

  const recoveryPct =
    Math.round(
      clamp(
        (recovery / Math.max(exposure, 1)) * 100,
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


  const forecast =
    CONFIG.baseRevenue +
    recovery;


  setText(
    forecastNumber,
    money(forecast)
  );
}


/* =========================================================
   RISK EXPOSURE BREAKDOWN
========================================================= */

function updateRiskExposure(
  conversion,
  cancellation,
  fulfillment,
  response
) {

  const conversionExposure =
    CONFIG.baseRevenue *
    clamp(
      ((3.8 - conversion) / 3.3),
      0,
      1
    ) *
    0.35;


  const fulfillmentExposure =
    CONFIG.baseRevenue *
    clamp(
      fulfillment / 30,
      0,
      1
    ) *
    0.20;


  const cancellationExposure =
    CONFIG.baseRevenue *
    clamp(
      cancellation / 20,
      0,
      1
    ) *
    0.25;


  const responseExposure =
    CONFIG.baseRevenue *
    clamp(
      response / 100,
      0,
      1
    ) *
    0.20;


  setText(
    conversionExposure,
    money(conversionExposure)
  );

  setText(
    fulfillmentExposure,
    money(fulfillmentExposure)
  );

  setText(
    cancellationExposure,
    money(cancellationExposure)
  );

  setText(
    responseExposure,
    money(responseExposure)
  );
}


/* =========================================================
   EXECUTIVE ALERT
========================================================= */

function updateExecutiveAlert(
  risk,
  health,
  exposure,
  recovery
) {

  if (!alertTitle) return;


  if (risk >= 70) {

    setText(
      alertTitle,
      "Critical revenue exposure detected."
    );

    setText(
      alertDescription,
      "Multiple business signals are creating significant financial risk. Immediate intervention is recommended."
    );

  }

  else if (risk >= 45) {

    setText(
      alertTitle,
      "Revenue exposure requires management attention."
    );

    setText(
      alertDescription,
      "Several operational signals are weakening performance. Recovery opportunities are available."
    );

  }

  else {

    setText(
      alertTitle,
      "Business signals are operating within a healthier range."
    );

    setText(
      alertDescription,
      "Current conditions indicate lower modeled exposure with measurable recovery potential."
    );
  }
}


/* =========================================================
   AI DECISION ENGINE
========================================================= */

function updateDecision(
  risk,
  conversion,
  cancellation,
  fulfillment,
  response,
  recovery,
  confidenceScore
) {

  if (!decisionTitle) return;


  let title =
    "Optimize the highest-impact revenue signal";

  let description =
    "Focus resources on the operational driver with the strongest financial impact.";


  /* Highest priority */

  if (
    conversion < 3.2 &&
    conversion <= cancellation / 3
  ) {

    title =
      "Recover high-intent lost conversions";

    description =
      "Prioritize checkout recovery, abandoned demand and high-intent customer follow-up before increasing acquisition spend.";
  }

  else if (
    fulfillment >= 15
  ) {

    title =
      "Stabilize fulfillment performance";

    description =
      "Resolve delivery SLA pressure and prioritize orders most likely to become cancellations or churn.";
  }

  else if (
    cancellation >= 10
  ) {

    title =
      "Reduce cancellation leakage";

    description =
      "Identify cancellation drivers and deploy retention interventions before customers exit the funnel.";
  }

  else if (
    response >= 40
  ) {

    title =
      "Accelerate customer response";

    description =
      "Prioritize high-intent conversations and reduce response delays with automated first-touch workflows.";
  }

  else if (risk < 30) {

    title =
      "Scale what is already working";

    description =
      "Business risk is relatively low. Focus on controlled growth while continuously monitoring revenue signals.";
  }


  setText(
    decisionTitle,
    title
  );

  setText(
    decisionDescription,
    description
  );
}


/* =========================================================
   INPUT EVENTS
========================================================= */

[
  conversionInput,
  cancellationInput,
  fulfillmentInput,
  responseInput
]
.forEach((input) => {

  if (!input) return;

  input.addEventListener(
    "input",
    calculateSignals
  );

});


/* =========================================================
   INVESTIGATE BUSINESS RISK
========================================================= */

function investigateRisk() {

  const result =
    calculateSignals();


  const message =
    "NEXUS investigation complete — Risk " +
    result.risk +
    "/100 · Exposure " +
    money(result.exposure) +
    " · Recovery " +
    money(result.recovery);


  showToast(
    message,
    "risk"
  );


  const riskSection =
    $("risk");

  if (riskSection) {

    riskSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}


/* =========================================================
   EXECUTE AI ACTION
========================================================= */

function executeAction() {

  const result =
    calculateSignals();


  const priorityRecovery =
    result.recovery * 0.20;


  const action =
    "AI ACTION READY — Prioritize conversion recovery, reduce cancellation friction and investigate fulfillment SLA failures. Immediate modeled recovery opportunity: " +
    money(priorityRecovery) +
    ".";


  setText(
    aiResponse,
    action
  );


  setText(
    actionResult,
    "✓ AI strategy generated successfully. Recommended priority: revenue recovery."
  );


  showToast(
    "AI Action Plan generated successfully.",
    "success"
  );


  const actionSection =
    $("actions");

  if (actionSection) {

    actionSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}


/* =========================================================
   ACTION CENTER
========================================================= */

function runAction(type) {

  const result =
    calculateSignals();


  let message = "";


  if (type === "recovery") {

    message =
      "Recovery workflow activated for high-intent prospects. Estimated opportunity: " +
      money(result.recovery * 0.20) +
      ".";

  }

  else if (type === "response") {

    message =
      "Response-leakage workflow activated. High-intent conversations should receive priority follow-up.";

  }

  else if (type === "fulfillment") {

    message =
      "Fulfillment stabilization workflow activated. SLA-risk orders should be prioritized.";

  }

  else {

    message =
      "AI operational workflow activated.";
  }


  setText(
    actionResult,
    "✓ " + message
  );


  showToast(
    message,
    "success"
  );
}


/* =========================================================
   AI ANALYST
========================================================= */

function askAnalyst() {

  const input =
    analystInput
      ? analystInput.value.trim()
      : "";


  if (!input) {

    showToast(
      "Enter a business question first.",
      "warning"
    );

    return;
  }


  const result =
    calculateSignals();


  const query =
    input.toLowerCase();


  let response =
    "NEXUS ANALYST: ";


  if (
    query.includes("risk") ||
    query.includes("danger")
  ) {

    response +=
      "Current modeled business risk is " +
      result.risk +
      "/100 with estimated revenue exposure of " +
      money(result.exposure) +
      ". Focus on the highest-impact operational signal first.";

  }


  else if (
    query.includes("revenue") ||
    query.includes("money") ||
    query.includes("recover")
  ) {

    response +=
      "Estimated recoverable revenue is " +
      money(result.recovery) +
      ". The strongest modeled opportunities are conversion recovery, fulfillment improvement and cancellation reduction.";

  }


  else if (
    query.includes("customer") ||
    query.includes("customers")
  ) {

    response +=
      result.customers.toLocaleString() +
      " customers are currently within the elevated-risk model.";

  }


  else if (
    query.includes("action") ||
    query.includes("what should") ||
    query.includes("focus")
  ) {

    response +=
      "Recommended next move: address the highest-impa
