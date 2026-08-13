 /* =========================================================
   NEXUS COMMAND AI — V8.1
   Enterprise Autonomous Decision Intelligence Engine
   Corrected Production Demo Script
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

  simulationDelay: 1200,
  toastDuration: 3500
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
   SAFE UTILITIES
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


function safeText(element, value) {

  if (element) {
    element.textContent = value;
  }
}


function formatNumber(value) {

  return Number(value || 0).toLocaleString("en-US");
}


/* =========================================================
   DOM REFERENCES
========================================================= */

/* Signal Inputs */

const conversionInput =
  $("conversionInput");

const cancellationInput =
  $("cancellationInput");

const fulfillmentInput =
  $("fulfillmentInput");

const responseInput =
  $("responseInput");


/* Signal Values */

const conversionValue =
  $("conversionValue");

const cancellationValue =
  $("cancellationValue");

const fulfillmentValue =
  $("fulfillmentValue");

const responseValue =
  $("responseValue");


/* Signal Status */

const conversionStatus =
  $("conversionStatus");

const cancellationStatus =
  $("cancellationStatus");

const fulfillmentStatus =
  $("fulfillmentStatus");

const responseStatus =
  $("responseStatus");


/* Health */

const healthScore =
  $("healthScore");

const healthStatus =
  $("healthStatus");

const healthText =
  $("healthText");

const healthBadge =
  $("healthBadge");


/* KPI */

const revenueRisk =
  $("revenueRisk");

const recoverableRevenue =
  $("recoverableRevenue");

const customersRisk =
  $("customersRisk");


/* Alert */

const alertTitle =
  $("alertTitle");

const alertDescription =
  $("alertDescription");

const confidenceValue =
  $("confidenceValue");

const confidence =
  $("confidence");


/* Risk Exposure */

const conversionExposure =
  $("conversionExposure");

const fulfillmentExposure =
  $("fulfillmentExposure");

const cancellationExposure =
  $("cancellationExposure");

const responseExposure =
  $("responseExposure");


/* AI Decision */

const decisionTitle =
  $("decisionTitle");

const decisionDescription =
  $("decisionDescription");

const decisionRecovery =
  $("decisionRecovery");

const decisionConfidence =
  $("decisionConfidence");


/* Forecast */

const forecastNumber =
  $("forecastNumber");

const recoveryPercent =
  $("recoveryPercent");

const recoveryProgress =
  $("recoveryProgress");

const roiNumber =
  $("roiNumber");


/* Action */

const actionResult =
  $("actionResult");


/* Analyst */

const aiResponse =
  $("aiResponse");

const analystInput =
  $("analystInput");


/* Simulator */

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


  /* -------------------------------------------------------
     INDIVIDUAL RISK
  ------------------------------------------------------- */

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
     HEALTH
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
     CUSTOMERS AT RISK
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
    conversionRisk,
    cancellationRisk,
    fulfillmentRisk,
    responseRisk
  );


  updateDecision(
    conversionRisk,
    cancellationRisk,
    fulfillmentRisk,
    responseRisk,
    recovery,
    confidenceScore
  );


  updateAlert(
    risk,
    health,
    conversion,
    cancellation,
    fulfillment,
    response
  );


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
   SIGNAL VALUES
========================================================= */

function updateSignalValues(
  conversion,
  cancellation,
  fulfillment,
  response
) {

  safeText(
    conversionValue,
    conversion.toFixed(2) + "%"
  );


  safeText(
    cancellationValue,
    cancellation.toFixed(1) + "%"
  );


  safeText(
    fulfillmentValue,
    fulfillment.toFixed(1) + "%"
  );


  safeText(
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

  /* Conversion */

  if (conversion <= 2.5) {

    safeText(
      conversionStatus,
      "CRITICAL"
    );

  } else if (conversion <= 3.5) {

    safeText(
      conversionStatus,
      "HIGH"
    );

  } else if (conversion <= 4.2) {

    safeText(
      conversionStatus,
      "WATCH"
    );

  } else {

    safeText(
      conversionStatus,
      "STRONG"
    );
  }


  /* Cancellation */

  if (cancellation >= 12) {

    safeText(
      cancellationStatus,
      "CRITICAL"
    );

  } else
