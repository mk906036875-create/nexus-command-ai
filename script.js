 /* =========================================================
   NEXUS COMMAND AI — V2
   Enterprise Signal Intelligence Engine
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
  baseRevenue: 2400000,
  baseRecovery: 730000,
  baseCustomers: 18420,
  minHealth: 0,
  maxHealth: 100
};


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const formatMoney = (value) => {
  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
};


/* =========================================================
   DOM ELEMENTS
========================================================= */

const conversionInput = $("conversionInput");
const cancellationInput = $("cancellationInput");
const fulfillmentInput = $("fulfillmentInput");
const responseInput = $("responseInput");

const conversionValue = $("conversionValue");
const cancellationValue = $("cancellationValue");
const fulfillmentValue = $("fulfillmentValue");
const responseValue = $("responseValue");

const liveRiskScore = $("liveRiskScore");
const liveExposure = $("liveExposure");
const liveRecovery = $("liveRecovery");

const healthScore = $("healthScore");
const healthText = $("healthText");
const healthBadge = $("healthBadge");

const revenueRisk = $("revenueRisk");
const recoverableRevenue = $("recoverableRevenue");
const customersRisk = $("customersRisk");

const graphResponse = $("graphResponse");
const graphRisk = $("graphRisk");
const graphRecovery = $("graphRecovery");

const roiNumber = $("roiNumber");
const recoveryPercent = $("recoveryPercent");
const recoveryProgress = $("recoveryProgress");

const forecastNumber = $("forecastNumber");

const decisionRecovery = $("decisionRecovery");
const decisionConfidence = $("decisionConfidence");

const confidenceValue = $("confidenceValue");


/* =========================================================
   SAFE NUMBER
========================================================= */

function numberValue(element, fallback = 0) {

  if (!element) {
    return fallback;
  }

  const value = parseFloat(element.value);

  return Number.isFinite(value) ? value : fallback;
}


/* =========================================================
   SIGNAL ENGINE
========================================================= */

function calculateSignals() {

  const conversion = numberValue(conversionInput, 2.84);
  const cancellation = numberValue(cancellationInput, 8.7);
  const fulfillment = numberValue(fulfillmentInput, 12.4);
  const response = numberValue(responseInput, 31);


  /* -----------------------------------------
     SIGNAL SCORES
  ----------------------------------------- */

  const conversionRisk =
    Math.max(0, (3.8 - conversion) / 3.3) * 35;

  const cancellationRisk =
    (cancellation / 20) * 25;

  const fulfillmentRisk =
    (fulfillment / 30) * 20;

  const responseRisk =
    (response / 100) * 20;


  let risk =
    conversionRisk +
    cancellationRisk +
    fulfillmentRisk +
    responseRisk;


  risk = Math.round(
    Math.max(0, Math.min(100, risk))
  );


  /* -----------------------------------------
     EXPOSURE
  ----------------------------------------- */

  const exposureMultiplier =
    0.65 + (risk / 100) * 0.65;

  const exposure =
    CONFIG.baseRevenue * exposureMultiplier;


  /* -----------------------------------------
     RECOVERY
  ----------------------------------------- */

  const recoveryRate =
    0.18 + (risk / 100) * 0.14;

  const recovery =
    exposure * recoveryRate;


  /* -----------------------------------------
     HEALTH
  ----------------------------------------- */

  const health =
    Math.round(
      Math.max(
        CONFIG.minHealth,
        CONFIG.maxHealth - risk
      )
    );


  /* -----------------------------------------
     CUSTOMERS
  ----------------------------------------- */

  const customers =
    Math.round(
      CONFIG.baseCustomers *
      (0.65 + risk / 100 * 0.35)
    );


  /* -----------------------------------------
     CONFIDENCE
  ----------------------------------------- */

  const confidence =
    Math.round(
      Math.min(
        98,
        78 +
        Math.abs(risk - 50) * 0.35
      )
    );


  /* -----------------------------------------
     UPDATE UI
  ----------------------------------------- */

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
    confidence
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
    confidence
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

  if (conversionValue) {
    conversionValue.textContent =
      conversion.toFixed(2) + "%";
  }

  if (cancellationValue) {
    cancellationValue.textContent =
      cancellation.toFixed(1) + "%";
  }

  if (fulfillmentValue) {
    fulfillmentValue.textContent =
      fulfillment.toFixed(1) + "%";
  }

  if (responseValue) {
    responseValue.textContent =
      "+" + Math.round(response) + "%";
  }

  if (graphResponse) {
    graphResponse.textContent =
      "+" + Math.round(response) + "%";
  }
}


/* =========================================================
   UPDATE RESULTS
========================================================= */

function updateResults(
  risk,
  exposure,
  recovery,
  health,
  customers,
  confidence
) {

  if (liveRiskScore) {
    liveRiskScore.textContent =
      risk + "/100";
  }

  if (liveExposure) {
    liveExposure.textContent =
      formatMoney(exposure);
  }

  if (liveRecovery) {
    liveRecovery.textContent =
      formatMoney(recovery);
  }

  if (revenueRisk) {
    revenueRisk.textContent =
      formatMoney(exposure);
  }

  if (recoverableRevenue) {
    recoverableRevenue.textContent =
      formatMoney(recovery);
  }

  if (customersRisk) {
    customersRisk.textContent =
