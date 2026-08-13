 /* =========================================================
   NEXUS COMMAND AI — V6
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
  maxHealth: 100
};


/* =========================================================
   HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const clamp = (value, min, max) =>
  Math.min(Math.max(value, min), max);

const money = (value) => {

  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
};

const numberValue = (element, fallback = 0) => {

  if (!element) return fallback;

  const value = parseFloat(element.value);

  return Number.isFinite(value)
    ? value
    : fallback;
};


/* =========================================================
   DOM
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

const decisionRecovery = $("decisionRecovery");
const decisionConfidence = $("decisionConfidence");

const confidence = $("confidence");
const confidenceValue = $("confidenceValue");

const forecastNumber = $("forecastNumber");
const recoveryPercent = $("recoveryPercent");
const recoveryProgress = $("recoveryProgress");

const roiNumber = $("roiNumber");

const aiResponse = $("aiResponse");
const analystInput = $("analystInput");


/* =========================================================
   SIGNAL ENGINE
========================================================= */

function calculateSignals() {

  const conversion =
    numberValue(conversionInput, 2.84);

  const cancellation =
    numberValue(cancellationInput, 8.7);

  const fulfillment =
    numberValue(fulfillmentInput, 12.4);

  const response =
    numberValue(responseInput, 31);


  /* -----------------------------------------
     RISK COMPONENTS
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
     BUSINESS HEALTH
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
     CUSTOMER RISK
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


  /* -----------------------------------------
     UPDATE
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
  confidenceScore
) {

  if (liveRiskScore) {
    liveRiskScore.textContent =
      risk + "/100";
  }

  if (liveExposure) {
    liveExposure.textContent =
      money(exposure);
  }

  if (liveRecovery) {
    liveRecovery.textContent =
      money(recovery);
  }

  if (revenueRisk) {
    revenueRisk.textContent =
      money(exposure);
  }

  if (recoverableRevenue) {
    recoverableRevenue.textContent =
      money(recovery);
  }

  if (customersRisk) {
    customersRisk.textContent =
      customers.toLocaleString();
  }

  if (healthScore) {
    healthScore.textContent =
      health;
  }

  if (healthText) {

    if (health >= 80) {
      healthText.textContent = "Strong";
    } else if (health >= 60) {
      healthText.textContent = "Good";
    } else if (health >= 40) {
      healthText.textContent = "Attention";
    } else {
      healthText.textContent = "Critical";
    }
  }

  if (healthBadge) {

    if (health >= 80) {
      healthBadge.textContent = "STRONG";
    } else if (health >= 60) {
      healthBadge.textContent = "ATTENTION";
    } else {
      healthBadge.textContent = "HIGH RISK";
    }
  }

  if (confidence) {
    confidence.textContent =
      confidenceScore + "%";
  }

  if (confidenceValue) {
    confidenceValue.textContent =
      confidenceScore + "%";
  }


  /* -----------------------------------------
     AI DECISION
  ----------------------------------------- */

  const priorityRecovery =
    recovery * 0.20;

  if (decisionRecovery) {
    decisionRecovery.textContent =
      money(priorityRecovery);
  }

  if (decisionConfidence) {
    decisionConfidence.textContent =
      Math.max(
        82,
        confidenceScore - 4
      ) + "%";
  }


  /* -----------------------------------------
     RECOVERY FORECAST
  ----------------------------------------- */

  const recoveryPct =
    Math.round(
      clamp(
        (recovery / exposure) * 100,
        0,
        100
      )
    );

  if (recoveryPercent) {
    recoveryPercent.textContent =
      recoveryPct + "%";
  }

  if (recoveryProgress
