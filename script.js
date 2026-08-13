 /* =========================================================
   NEXUS COMMAND AI — V8.1
   Enterprise Autonomous Decision Intelligence Engine

   FIXES:
   - Full initialization
   - Live signal calculations
   - Dynamic risk status
   - Dynamic exposure breakdown
   - AI action center
   - What-If simulator
   - AI Analyst
   - Navigation + scroll spy
   - Toast notifications
   - Keyboard shortcut
   - HTML-safe analyst output
   - Compatible with existing V8 HTML
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
const fulfillmentExposure = $("fulfillmentExposure");
const cancellationExposure = $("cancellationExposure");
const responseExposure = $("responseExposure");

const healthScore = $("healthScore");
const healthStatus = $("healthStatus");
const healthText = $("healthText");
const healthBadge = $("healthBadge");

const revenueRisk = $("revenueRisk");
const recoverableRevenue = $("recoverableRevenue");
const customersRisk = $("customersRisk");

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


/* =========================================================
   UTILITY FUNCTIONS
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


/* =========================================================
   SIGNAL STATUS HELPERS
========================================================= */

function setStatus(element, text, level) {

  if (!element) return;

  element.textContent = text;

  element.dataset.level = level;
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


  /* =======================================================
     INDIVIDUAL RISK
  ======================================================= */

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


  /* =======================================================
     TOTAL RISK
  ======================================================= */

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


  /* =======================================================
     REVENUE EXPOSURE
  ======================================================= */

  const exposureMultiplier =
    0.55 +
    (risk / 100) * 0.75;

  const exposure =
    CONFIG.baseRevenue *
    exposureMultiplier;


  /* =======================================================
     RECOVERY
  ======================================================= */

  const recoveryRate =
    CONFIG.baseRecoveryRate +
    (risk / 100) * 0.12;

  const recovery =
    exposure *
    recoveryRate;


  /* =======================================================
     HEALTH
  ======================================================= */

  const health = Math.round(
    clamp(
      100 - risk,
      CONFIG.minHealth,
      CONFIG.maxHealth
    )
  );


  /* =======================================================
     CUSTOMER RISK
  ======================================================= */

  const customers = Math.round(
    CONFIG.baseCustomers *
    (
      0.55 +
      (risk / 100) * 0.45
    )
  );


  /* =======================================================
     AI CONFIDENCE
  ======================================================= */

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

  if (conversionValue) {
    conversionValue.textContent =
      result.conversion.toFixed(2) + "%";
  }

  if (cancellationValue) {
    cancellationValue.textContent =
      result.cancellation.toFixed(1) + "%";
  }

  if (fulfillmentValue) {
    fulfillmentValue.textContent =
      result.fulfillment.toFixed(1) + "%";
  }

  if (responseValue) {
    responseValue.textContent =
      "+" + Math.round(result.response) + "%";
  }
}


/* =========================================================
   DYNAMIC SIGNAL STATUS
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
      conversionStatus,
      "WATCH",
      "watch"
    );

  } else {

    setStatus(
      conversionStatus,
      "HEALTHY",
      "healthy"
    );
  }


  /* CANCELLATION */

  if (result.cancellation >= 12) {

    setStatus(
      cancellationStatus,
      "CRITICAL",
      "critical"
    );

  } else if (result.cancellation >= 8) {

    setStatus(
      cancellationStatus,
      "HIGH",
      "high"
    );

  } else if (result.cancellation >= 5) {

    setStatus(
      cancellationStatus,
      "WATCH",
      "watch"
    );

  } else {

    setStatus(
      cancellationStatus,
      "HEALTHY",
      "healthy"
    );
  }


  /* FULFILLMENT */

  if (result.fulfillment >= 18) {

    setStatus(
      fulfillmentStatus,
      "CRITICAL",
      "critical"
    );

  } else if (result.fulfillment >= 10) {

    setStatus(
      fulfillmentStatus,
      "HIGH",
      "high"
    );

  } else if (result.fulfillment >= 5) {

    setStatus(
      fulfillmentStatus,
      "WATCH",
      "watch"
    );

  } else {

    setStatus(
      fulfillmentStatus,
      "HEALTHY",
      "healthy"
    );
  }


  /* RESPONSE */

  if (result.response >= 50) {

    setStatus(
      responseStatus,
      "CRITICAL",
      "critical"
    );

  } else if (result.response >= 30) {

    setStatus(
      responseStatus,
      "HIGH",
      "high"
    );

  } else if (result.response >= 15) {

    setStatus(
      responseStatus,
      "WATCH",
      "watch"
    );

  } else {

    setStatus(
      responseStatus,
      "HEALTHY",
      "healthy"
    );
  }
}


/* =========================================================
   MAIN RESULTS
========================================================= */

function updateResults(result) {

  if (revenueRisk) {

    revenueRisk.textContent =
      money(result.exposure);
  }


  if (recoverableRevenue) {

    recoverableRevenue.textContent =
      money(result.recovery);
  }


  if (customersRisk) {

    customersRisk.textContent =
      result.customers.toLocaleString();
  }


  /* HEALTH SCORE */

  if (healthScore) {

    healthScore.textContent =
      result.health;
  }


  /* HEALTH TEXT */

  if (healthText) {

    if (result.health >= 80) {

      healthText.textContent =
        "Strong";

    } else if (result.health >= 60) {

      healthText.textContent =
        "Good";

    } else if (result.health >= 40) {

      healthText.textContent =
        "Attention";

    } else {

      healthText.textContent =
        "Critical";
    }
  }


  /* HEALTH BADGE */

  if (healthBadge) {

    if (result.health >= 80) {

      healthBadge.textContent =
        "STRONG";

    } else if (result.health >= 60) {

      healthBadge.textContent =
        "ATTENTION";

    } else if (result.health >= 40) {

      healthBadge.textContent =
        "HIGH RISK";

    } else {

      healthBadge.textContent =
        "CRITICAL";
    }
  }


  /* HERO STATUS */

  if (healthStatus) {

    if (result.health >= 80) {

      healthStatus.textContent =
        "SYSTEM STRONG";

    } else if (result.health >= 60) {

      healthStatus.textContent =
        "SYSTEM STABLE";

    } else if (result.health >= 40) {

      healthStatus.textContent =
        "SYSTEM ATTENTION";

    } else {

      healthStatus.textContent =
        "SYSTEM CRITICAL";
    }
  }


  /* CONFIDENCE */

  if (confidenceValue) {

    confidenceValue.textContent =
      result.confidenceScore + "%";
  }


  /* FORECAST */

  const recoveryPct = Math.round(
    clamp(
      (result.recovery / result.exposure) * 100,
      0,
      100
    )
  );


  if (recoveryPercent) {

    recoveryPercent.textContent =
      recoveryPct + "%";
  }


  if (recoveryProgress) {

    recoveryProgress.style.width =
      recoveryPct + "%";
  }


  if (forecastNumber) {

    forecastNumber.textContent =
      money(
        CONFIG.baseRevenue +
        result.recovery
      );
  }
}


/* =========================================================
   RISK EXPOSURE BREAKDOWN
========================================================= */

function updateRiskExposure(result) {

  const totalRisk =
    Math.max(result.risk, 1);


  const conversionShare =
    result.conversionRisk / totalRisk;

  const cancellationShare =
    result.cancellationRisk / totalRisk;

  const fulfillmentShare =
    result.fulfillmentRisk / totalRisk;

  const responseShare =
    result.responseRisk / totalRisk;


  if (conversionExposure) {

    conversionExposure.textContent =
      money(
        result.exposure *
        conversionShare
      );
  }


  if (cancellationExposure) {

    cancellationExposure.textContent =
      money(
        result.exposure *
        cancellationShare
      );
  }


  if (fulfillmentExposure) {

    fulfillmentExposure.textContent =
      money(
        result.exposure *
        fulfillmentShare
      );
  }


  if (responseExposure) {

    responseExposure.textContent =
      money(
        result.exposure *
        responseShare
      );
  }
}


/* =========================================================
   AI DECISION ENGINE
========================================================= */

function updateDecision(result) {

  const risks = [

    {
      name: "conversion",
      value: result.conversionRisk
    },

    {
      name: "cancellation",
      value: result.cancellationRisk
    },

    {
      name: "fulfillment",
      value: result.fulfillmentRisk
    },

    {
      name: "response",
      value: result.responseRisk
    }

  ];


  risks.sort(
    (a, b) =>
      b.value - a.value
  );


  const highest =
    risks[0];


  const priorityRecovery =
    result.recovery * 0.20;


  if (decisionRecovery) {

    decisionRecovery.textContent =
      money(priorityRecovery);
  }


  if (decisionConfidence) {

    decisionConfidence.textContent =
      Math.max(
        82,
        result.confidenceScore - 4
      ) + "%";
  }


  if (!decisionTitle ||
      !decisionDescription) {

    return;
  }


  switch (highest.name) {

    case "conversion":

      decisionTitle.textContent =
        "Recover high-intent lost conversions";

      decisionDescription.textContent =
        "Prioritize checkout recovery, abandoned-demand workflows and faster response before increasing acquisition spend.";

      break;


    case "cancellation":

      decisionTitle.textContent =
        "Reduce cancellation leakage";

      decisionDescription.textContent =
        "Identify the strongest cancellation drivers and deploy retention interventions before customers leave.";

      break;


    case "fulfillment":

      decisionTitle.textContent =
        "Stabilize fulfillment performance";

      decisionDescription.textContent =
        "Investigate delivery SLA pressure, prioritize delayed orders and prevent fulfillment failures from becoming churn.";

      break;


    case "response":

      decisionTitle.textContent =
        "Accelerate customer response";

      decisionDescription.textContent =
        "Prioritize slow-response conversations and automate high-intent first-touch engagement.";

      break;
  }
}


/* =========================================================
   EARLY WARNING SYSTEM
========================================================= */

function updateAlert(result) {

  if (!alertTitle ||
      !alertDescription) {

    return;
  }


  if (result.risk >= 70) {

    alertTitle.textContent =
      "Critical revenue exposure detected.";

    alertDescription.textContent =
      "Multiple high-risk signals are combining. Immediate intervention is recommended.";

  } else if (result.risk >= 50) {

    alertTitle.textContent =
      "Elevated revenue exposure detected.";

    alertDescription.textContent =
      "Several business signals require executive attention.";

  } else if (result.risk >= 30) {

    alertTitle.textContent =
      "Moderate revenue risk detected.";

    alertDescription.textContent =
      "NEXUS recommends monitoring the highest-impact operating signal.";

  } else {

    alertTitle.textContent =
      "Business signals are operating within healthy ranges.";

    alertDescription.textContent =
      "Continue monitoring for changes in conversion, cancellation, fulfillment and response.";
  }
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
    "NEXUS investigation complete. " +
    "Risk score: " +
    result.risk +
    "/100. Estimated exposure: " +
    money(result.exposure) +
    ". Potential recovery: " +
    money(result.recovery) +
    ".";


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


  const recovery =
    money(
      result.recovery * 0.20
    );


  const action =
    "AI ACTION READY — Prioritize " +
    "the highest-risk revenue driver, " +
    "deploy targeted recovery workflows, " +
    "and measure intervention impact. " +
    "Immediate recovery opportunity: " +
    recovery +
    ".";


  if (aiResponse) {

    aiResponse.textContent =
      action;
  }


  if (actionResult) {

    actionResult.textContent =
      "AI Action Plan generated. " +
      "Priority recovery opportunity: " +
      recovery +
      ".";
  }


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


  let title = "";
  let message = "";
  let opportunity = 0;


  switch (type) {

    case "recovery":

      title =
        "ABANDONED DEMAND RECOVERY";

      opportunity =
        result.recovery * 0.35;

      message =
        "Target high-intent prospects with personalized recovery workflows, checkout reminders and fast follow-up.";

      break;


    case "response":

      title =
        "RESPONSE LEAKAGE REDUCTION";

      opportunity =
        result.recovery * 0.20;

      message =
        "Prioritize slow-response conversations and automate first-touch engagement for high-value leads.";

      break;


    case "fulfillment":

      title =
        "FULFILLMENT STABILIZATION";

      opportunity =
        result.recovery * 0.25;

      message =
        "Identify SLA pressure, prioritize delayed orders and trigger proactive customer communication.";

      break;


    default:

      title =
        "AI ACTION";

      opportunity =
        result.recovery * 0.20;

   
