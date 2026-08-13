 /* =========================================================
   NEXUS COMMAND AI — V8.1
   Enterprise Revenue Intelligence Engine
========================================================= */

"use strict";

/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
  baseRevenue: 2400000,
  baseCustomers: 18420,
  baseRecoveryRate: 0.30,
  simulationDelay: 900
};

/* =========================================================
   DOM HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

const qsa = (selector) =>
  [...document.querySelectorAll(selector)];

/* =========================================================
   UTILITIES
========================================================= */

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function money(value) {
  if (!Number.isFinite(value)) return "$0";

  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
}

function getNumber(id, fallback) {
  const el = $(id);

  if (!el) return fallback;

  const value = parseFloat(el.value);

  return Number.isFinite(value) ? value : fallback;
}

/* =========================================================
   MAIN SIGNAL ENGINE
========================================================= */

function calculateSignals() {

  const conversion =
    getNumber("conversionInput", 2.84);

  const cancellation =
    getNumber("cancellationInput", 8.7);

  const fulfillment =
    getNumber("fulfillmentInput", 12.4);

  const response =
    getNumber("responseInput", 31);

  /* Risk calculations */

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

  /* Revenue exposure */

  const exposure =
    CONFIG.baseRevenue *
    (
      0.55 +
      (risk / 100) * 0.75
    );

  /* Recovery */

  const recoveryRate =
    CONFIG.baseRecoveryRate +
    (risk / 100) * 0.12;

  const recovery =
    exposure * recoveryRate;

  /* Health */

  const health =
    Math.round(
      clamp(
        100 - risk,
        0,
        100
      )
    );

  /* Customers */

  const customers =
    Math.round(
      CONFIG.baseCustomers *
      (
        0.55 +
        (risk / 100) * 0.45
      )
    );

  /* Confidence */

  const confidence =
    Math.round(
      clamp(
        78 +
        Math.abs(risk - 50) * 0.42,
        78,
        98
      )
    );

  updateUI({
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
  });

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
   UPDATE UI
========================================================= */

function updateUI(data) {

  const {
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
  } = data;

  /* Signal values */

  if ($("conversionValue"))
    $("conversionValue").textContent =
      conversion.toFixed(2) + "%";

  if ($("cancellationValue"))
    $("cancellationValue").textContent =
      cancellation.toFixed(1) + "%";

  if ($("fulfillmentValue"))
    $("fulfillmentValue").textContent =
      fulfillment.toFixed(1) + "%";

  if ($("responseValue"))
    $("responseValue").textContent =
      "+" + Math.round(response) + "%";

  /* KPI */

  if ($("revenueRisk"))
    $("revenueRisk").textContent =
      money(exposure);

  if ($("recoverableRevenue"))
    $("recoverableRevenue").textContent =
      money(recovery);

  if ($("customersRisk"))
    $("customersRisk").textContent =
      customers.toLocaleString();

  /* Health */

  if ($("healthScore"))
    $("healthScore").textContent = health;

  let healthLabel = "Critical";

  if (health >= 80)
    healthLabel = "Strong";
  else if (health >= 60)
    healthLabel = "Good";
  else if (health >= 40)
    healthLabel = "Attention";

  if ($("healthText"))
    $("healthText").textContent =
      healthLabel;

  if ($("healthStatus"))
    $("healthStatus").textContent =
      health >= 70
        ? "SYSTEM STABLE"
        : "SYSTEM REQUIRES ATTENTION";

  if ($("healthBadge"))
    $("healthBadge").textContent =
      health >= 80
        ? "STRONG"
        : health >= 60
          ? "ATTENTION"
          : "HIGH RISK";

  /* Confidence */

  if ($("confidenceValue"))
    $("confidenceValue").textContent =
      confidence + "%";

  /* Recovery */

  const priorityRecovery =
    recovery * 0.20;

  if ($("decisionRecovery"))
    $("decisionRecovery").textContent =
      money(priorityRecovery);

  if ($("decisionConfidence"))
    $("decisionConfidence").textContent =
      Math.max(82, confidence - 4) + "%";

  /* Forecast */

  const recoveryPct =
    Math.round(
      clamp(
        (recovery / Math.max(exposure, 1)) * 100,
        0,
        100
      )
    );

  if ($("forecastNumber"))
    $("forecastNumber").textContent =
      money(CONFIG.baseRevenue + recovery);

  if ($("recoveryPercent"))
    $("recoveryPercent").textContent =
      recoveryPct + "%";

  if ($("recoveryProgress"))
    $("recoveryProgress").style.width =
      recoveryPct + "%";

  /* Risk exposure */

  const conversionExposure =
    CONFIG.baseRevenue *
    clamp(
      conversionRiskValue(conversion),
      0,
      1
    ) *
    0.35;

  const fulfillmentExposure =
    CONFIG.baseRevenue *
    (fulfillment / 30) *
    0.22;

  const cancellationExposure =
    CONFIG.baseRevenue *
    (cancellation / 20) *
    0.16;

  const responseExposure =
    CONFIG.baseRevenue *
    (response / 100) *
    0.10;

  if ($("conversionExposure"))
    $("conversionExposure").textContent =
      money(conversionExposure);

  if ($("fulfillmentExposure"))
    $("fulfillmentExposure").textContent =
      money(fulfillmentExposure);

  if ($("cancellationExposure"))
    $("cancellationExposure").textContent =
      money(cancellationExposure);

  if ($("responseExposure"))
    $("responseExposure").textContent =
      money(responseExposure);

  /* Dynamic statuses */

  setStatus(
    "conversionStatus",
    conversion < 2.5
      ? "CRITICAL"
      : conversion < 3.2
        ? "HIGH"
        : "STABLE"
  );

  setStatus(
    "cancellationStatus",
    cancellation > 10
      ? "CRITICAL"
      : cancellation > 6
        ? "HIGH"
        : "STABLE"
  );

  setStatus(
    "fulfillmentStatus",
    fulfillment > 15
      ? "CRITICAL"
      : fulfillment > 8
        ? "HIGH"
        : "STABLE"
  );

  setStatus(
    "responseStatus",
    response > 50
      ? "CRITICAL"
      : response > 25
        ? "WATCH"
        : "STABLE"
  );

  /* Executive alert */

  if ($("alertTitle")) {

    if (risk >= 70) {
      $("alertTitle").textContent =
        "Critical revenue exposure detected across multiple signals.";
    }

    else if (risk >= 45) {
      $("alertTitle").textContent =
        "Revenue leakage requires executive attention.";
    }

    else {
      $("alertTitle").textContent =
        "Business signals are currently within a stable range.";
    }
  }

  if ($("alertDescription")) {

    $("alertDescription").textContent =
      "Current modeled exposure is " +
      money(exposure) +
      " with approximately " +
      money(recovery) +
      " recovery potential.";
  }

  /* AI decision */

  updateDecision(
    conversion,
    cancellation,
    fulfillment,
    response
  );
}

/* =========================================================
   CONVERSION RISK HELPER
========================================================= */

function conversionRiskValue(conversion) {
  return clamp(
    ((3.8 - conversion) / 3.3),
    0,
    1
  );
}

/* =========================================================
   STATUS
========================================================= */

function setStatus(id, value) {

  const element = $(id);

  if (element) {
    element.textContent = value;
  }
}

/* =========================================================
   AI DECISION ENGINE
========================================================= */

function updateDecision(
  conversion,
  cancellation,
  fulfillment,
  response
) {

  let title =
    "Optimize highest-value revenue signal";

  let description =
    "Monitor current conditions and prioritize the largest measurable recovery opportunity.";

  if (
    conversion < 3.0 &&
    conversion <= cancellation / 3
  ) {

    title =
      "Recover high-intent lost conversions";

    description =
      "Prioritize checkout recovery, abandoned demand workflows and faster response before increasing acquisition spend.";

  }

  else if (cancellation > 10) {

    title =
      "Reduce cancellation leakage";

    description =
      "Investigate cancellation causes, friction points and retention opportunities before more revenue is lost.";

  }

  else if (fulfillment > 15) {

    title =
      "Stabilize fulfillment performance";

    description =
      "Resolve SLA pressure and delayed orders before fulfillment problems become customer churn.";

  }

  else if (response > 50) {

    title =
      "Accelerate customer response";

    description =
      "Prioritize high-intent conversations and automate first-touch engagement to reduce response leakage.";

  }

  if ($("decisionTitle"))
    $("decisionTitle").textContent =
      title;

  if ($("decisionDescription"))
    $("decisionDescription").textContent =
      description;
}

/* =========================================================
   INVESTIGATE RISK
========================================================= */

function investigateRisk() {

  const result =
    calculateSignals();

  showToast(
    "Risk investigation complete — " +
    result.risk +
    "/100 exposure with " +
    money(result.exposure) +
    " estimated at risk.",
    "risk"
  );

  const section = $("risk");

  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}

/* =========================================================
   EXECUTE AI STRATEGY
========================================================= */

function executeAction() {

  const result =
    calculateSignals();

  const recovery =
    result.recovery * 0.20;

  const message =
    "AI ACTION READY — Focus on the highest-risk signal, " +
    "launch recovery workflows and measure impact. " +
    "Priority recovery opportunity: " +
    money(recovery) +
    ".";

  if ($("aiResponse"))
    $("aiResponse").textContent =
      message;

  showToast(
    "AI Action Plan generated successfully.",
    "success"
  );

  const section = $("actions");

  if (section) {
    section.scrollIntoView({
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
      "RECOVERY ACTION ACTIVE — Target high-intent abandoned demand. Estimated opportunity: " +
      money(result.recovery * 0.20);

  }

  else if (type === "response") {

    message =
      "RESPONSE ACTION ACTIVE — Prioritize slow-response leads and automate first-touch engagement.";

  }

  else if (type === "fulfillment") {

    message =
      "FULFILLMENT ACTION ACTIVE — Investigate SLA pressure and prioritize delayed orders.";

  }

  else {

    message =
      "AI action initialized.";

  }

  if ($("actionResult"))
    $("actionResult").textContent =
      message;

  if ($("aiResponse"))
    $("aiResponse").textContent =
      "NEXUS ACTION CENTER: " + message;

  showToast(
    "Action executed successfully.",
    "success"
  );
}

/* =========================================================
   WHAT-IF SIMULATOR
========================================================= */

function updateSimulator() {

  const targetConversion =
    getNumber(
      "targetConversion",
      4.2
    );

  const targetCancellation =
    getNumber(
      "targetCancellation",
      5
    );

  if ($("targetConversionValue"))
    $("targetConversionValue").textContent =
      targetConversion.toFixed(2) + "%";

  if ($("targetCancellationValue"))
    $("targetCancellationValue").textContent =
      targetCancellation.toFixed(1) + "%";

  const current =
    calculateSignalsSilent();

  const simulated =
    calculateSimulation(
      targetConversion,
      targetCancellation,
      current.fulfillment - 3,
      current.response - 10
    );

  if ($("simulatedHealth"))
    $("simulatedHealth").textContent =
      simulated.health;

}

/* =========================================================
   SILENT SIGNAL CALCULATION
========================================================= */

function calculateSignalsSilent() {

  const conversion =
    getNumber("conversionInput", 2.84);

  const cancellation =
    getNumber("cancellationInput", 8.7);

  const fulfillment =
    getNumber("fulfillmentInput", 12.4);

  const response =
    getNumber("responseInput", 31);

  const risk =
    Math.round(
      clamp(
        clamp(((3.8 - conversion) / 3.3) * 35, 0, 35) +
        clamp((cancellation / 20) * 25, 0, 25) +
        clamp((fulfillment / 30) * 20, 0, 20) +
        clamp((response / 100) * 20, 0, 20),
        0,
        100
      )
    );

  const exposure =
    CONFIG.baseRevenue *
    (
      0.55 +
      (risk / 100) * 0.75
    );

  const recovery =
    exposure *
    (
      CONFIG.baseRecoveryRate +
      (risk / 100) * 0.12
    );

  return {
    conversion,
    cancellation,
    fulfillment,
    response,
    risk,
    exposure,
    recovery,
    health: 100 - risk
  };
}

/* =========================================================
   SIMULATION
========================================================= */

function calculateSimulation(
  conversion,
  cancellation,
  fulfillment,
  response
) {

  const risk =
    Math.round(
      clamp(
        clamp(((3.8 - conversion) / 3.3) * 35, 0, 35) +
        clamp((cancellation / 20) * 25, 0, 25) +
        clamp((fulfillment / 30) * 20, 0, 20) +
        clamp((response / 100) * 20, 0, 20),
        0,
        100
      )
    );

  const exposure =
    CONFIG.baseRevenue *
    (
      0.55 +
      (risk / 100) * 0.75
    );

  const recovery =
    exposure *
    (
      CONFIG.baseRecoveryRate +
      (risk / 100) * 0.12
    );

  return {
    risk,
    exposure,
    recovery,
    health: 100 - risk
  };
}

/* =========================================================
   AI ANALYST
========================================================= */

function askAnalyst() {

  const input =
    $("analystInput")
      ? $("analystInput").value.trim()
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
      "Current modeled risk is " +
      result.risk +
      "/100 with approximately " +
      money(result.exposure) +
      " in revenue exposure.";

  }

  else if (
    query.includes("revenue") ||
    query.includes("money") ||
    query.includes("recover")
  ) {

    response +=
      "Estimated recoverable revenue is " +
      money(result.recovery) +
      ". Start with the highest-impact operational signal.";

  }

  else if (
    query.includes("customer")
  ) {

    response +=
      result.customers.toLocaleString() +
      " customers are currently inside the elevated-risk model.";

  }

  else if (
    query.includes("action") ||
    query.includes("focus") ||
    query.includes("should")
  ) {

    response +=
      "Focus first on conversion recovery, then cancellation leakage and fulfillment performance.";

  }

  else {

    response +=
      "Based on the current signal profile, prioritize the highest-risk driver and measure recovery after intervention.";
  }

  if ($("aiResponse"))
    $("aiResponse").textContent =
      response;

  showToast(
    "AI Analyst response generated.",
    "success"
  );
}

/* =========================================================
   TOAST
========================================================= */

function showToast(
  message,
  type = "success"
) {

  let container =
    document.querySelector(
      ".toast-container"
    );

  if (!container)
