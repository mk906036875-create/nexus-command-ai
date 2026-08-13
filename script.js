/* =========================================================
   NEXUS COMMAND AI — V8.1
   ENTERPRISE DECISION INTELLIGENCE ENGINE
   FULL CORRECTED COPY-PASTE VERSION
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
  simulationDelay: 1200
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
   DOM REFERENCES
========================================================= */

const conversionInput = $("conversionInput");
const cancellationInput = $("cancellationInput");
const fulfillmentInput = $("fulfillmentInput");
const responseInput = $("responseInput");

const conversionValue = $("conversionValue");
const cancellationValue = $("cancellationValue");
const fulfillmentValue = $("fulfillmentValue");
const responseValue = $("responseValue");

const conversionStatus = $("conversionStatus");
const cancellationStatus = $("cancellationStatus");
const fulfillmentStatus = $("fulfillmentStatus");
const responseStatus = $("responseStatus");

const conversionExposure = $("conversionExposure");
const cancellationExposure = $("cancellationExposure");
const fulfillmentExposure = $("fulfillmentExposure");
const responseExposure = $("responseExposure");

const liveRiskScore = $("liveRiskScore");
const liveExposure = $("liveExposure");
const liveRecovery = $("liveRecovery");

const healthScore = $("healthScore");
const healthStatus = $("healthStatus");
const healthText = $("healthText");
const healthBadge = $("healthBadge");

const revenueRisk = $("revenueRisk");
const recoverableRevenue = $("recoverableRevenue");
const customersRisk = $("customersRisk");

const confidence = $("confidence");
const confidenceValue = $("confidenceValue");

const decisionTitle = $("decisionTitle");
const decisionDescription = $("decisionDescription");
const decisionRecovery = $("decisionRecovery");
const decisionConfidence = $("decisionConfidence");

const forecastNumber = $("forecastNumber");
const recoveryPercent = $("recoveryPercent");
const recoveryProgress = $("recoveryProgress");

const alertTitle = $("alertTitle");
const alertDescription = $("alertDescription");

const aiResponse = $("aiResponse");
const analystInput = $("analystInput");

const actionResult = $("actionResult");

const targetConversion = $("targetConversion");
const targetCancellation = $("targetCancellation");

const targetConversionValue = $("targetConversionValue");
const targetCancellationValue = $("targetCancellationValue");
const simulatedHealth = $("simulatedHealth");

let lastResult = null;


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


function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function setText(element, value) {

  if (element) {
    element.textContent = value;
  }
}


/* =========================================================
   STATUS ENGINE
========================================================= */

function setStatus(element, text, level) {

  if (!element) {
    return;
  }

  element.textContent = text;
  element.dataset.level = level;

  element.classList.remove(
    "critical",
    "high",
    "watch",
    "healthy"
  );

  element.classList.add(level);
}


/* =========================================================
   SIGNAL ENGINE
========================================================= */

function calculateSignals() {

  const conversion = numberValue(
    conversionInput,
    2.84
  );

  const cancellation = numberValue(
    cancellationInput,
    8.7
  );

  const fulfillment = numberValue(
    fulfillmentInput,
    12.4
  );

  const response = numberValue(
    responseInput,
    31
  );


  /* -------------------------
     RISK COMPONENTS
  ------------------------- */

  const conversionRisk = clamp(
    ((3.8 - conversion) / 3.3) * 35,
    0,
    35
  );

  const cancellationRisk = clamp(
    (cancellation / 20) * 25,
    0,
    25
  );

  const fulfillmentRisk = clamp(
    (fulfillment / 30) * 20,
    0,
    20
  );

  const responseRisk = clamp(
    (response / 100) * 20,
    0,
    20
  );


  /* -------------------------
     TOTAL RISK
  ------------------------- */

  const risk = Math.round(
    clamp(
      conversionRisk +
      cancellationRisk +
      fulfillmentRisk +
      responseRisk,
      0,
      100
    )
  );


  /* -------------------------
     EXPOSURE
  ------------------------- */

  const exposureMultiplier =
    0.55 +
    (risk / 100) * 0.75;

  const exposure =
    CONFIG.baseRevenue *
    exposureMultiplier;


  /* -------------------------
     RECOVERY
  ------------------------- */

  const recoveryRate =
    CONFIG.baseRecoveryRate +
    (risk / 100) * 0.12;

  const recovery =
    exposure * recoveryRate;


  /* -------------------------
     HEALTH
  ------------------------- */

  const health = Math.round(
    clamp(
      100 - risk,
      CONFIG.minHealth,
      CONFIG.maxHealth
    )
  );


  /* -------------------------
     CUSTOMER RISK
  ------------------------- */

  const customers = Math.round(
    CONFIG.baseCustomers *
    (
      0.55 +
      (risk / 100) * 0.45
    )
  );


  /* -------------------------
     CONFIDENCE
  ------------------------- */

  const confidenceScore = Math.round(
    clamp(
      78 +
      Math.abs(risk - 50) * 0.42,
      78,
      98
    )
  );


  const result = {
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


  lastResult = result;

  updateSignalValues(result);
  updateStatuses(result);
  updateResults(result);
  updateRiskExposure(result);
  updateDecision(result);
  updateAlert(result);

  return result;
}


/* =========================================================
   SIGNAL VALUES
========================================================= */

function updateSignalValues(result) {

  setText(
    conversionValue,
    result.conversion.toFixed(2) + "%"
  );

  setText(
    cancellationValue,
    result.cancellation.toFixed(1) + "%"
  );

  setText(
    fulfillmentValue,
    result.fulfillment.toFixed(1) + "%"
  );

  setText(
    responseValue,
    "+" + Math.round(result.response) + "%"
  );
}


/* =========================================================
   SIGNAL STATUS
========================================================= */

function updateStatuses(result) {

  /* CONVERSION */

  if (result.conversion < 2.5) {

    setStatus(
      conversionStatus,
      "CRITICAL",
      "critical"
    );

  } else if (result.conversion < 3.5) {

    setStatus(
      conversionStatus,
      "HIGH",
      "high"
    );

  } else if (result.conversion < 4.2) {

    setStatus(
