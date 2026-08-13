 /* =========================================================
   NEXUS COMMAND AI — V8
   Enterprise Autonomous Decision Intelligence Engine
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

  simulationDelay: 900
};


/* =========================================================
   DOM HELPER
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


function animateNumber(element, target, duration = 500) {

  if (!element) return;

  const start = parseFloat(
    element.textContent.replace(/[^0-9.-]/g, "")
  ) || 0;

  const startTime = performance.now();

  function update(currentTime) {

    const progress = clamp(
      (currentTime - startTime) / duration,
      0,
      1
    );

    const eased =
      1 - Math.pow(1 - progress, 3);

    const value =
      start + (target - start) * eased;

    element.textContent =
      Math.round(value);

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
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


const decisionRecovery =
  $("decisionRecovery");

const decisionConfidence =
  $("decisionConfidence");


const confidence =
  $("confidence");

const confidenceValue =
  $("confidenceValue");


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
   SIGNAL VALUES
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


  /* -----------------------------------------
     HEALTH
  ----------------------------------------- */

  if (healthScore) {
    healthScore.textContent =
      health;
  }

  if (healthText) {

    if (health >= 80) {
      healthText.textContent =
        "Strong";
    }

    else if (health >= 60) {
      healthText.textContent =
        "Good";
    }

    else if (health >= 40) {
      healthText.textContent =
        "Attention";
    }

    else {
      healthText.textContent =
        "Critical";
    }
  }


  if (healthBadge) {

    if (health >= 80) {
      healthBadge.textContent =
        "STRONG";
    }

    else if (health >= 60) {
      healthBadge.textContent =
        "ATTENTION";
    }

    else {
      healthBadge.textContent =
        "HIGH RISK";
    }
  }


  /* -----------------------------------------
     CONFIDENCE
  ----------------------------------------- */

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
     FORECAST
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


  if (recoveryProgress) {

    recoveryProgress.style.width =
      recoveryPct + "%";
  }


  /* -----------------------------------------
     ROI
  ----------------------------------------- */

  const estimatedROI =
    Math.round(
      (recovery / Math.max(exposure, 1)) * 100
    );


  if (roiNumber) {
    roiNumber.textContent =
      estimatedROI + "%";
  }


  /* -----------------------------------------
     FORECAST VALUE
  ----------------------------------------- */

  const forecast =
    CONFIG.baseRevenue +
    recovery;

  if (forecastNumber) {
    forecastNumber.textContent =
      money(forecast);
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
    "/100. " +
    "Estimated exposure: " +
    money(result.exposure) +
    ". " +
    "Potential recovery: " +
    money(result.recovery) +
    ".";

  showToast(
    message,
    "risk"
  );


  const riskSection =
    document.getElementById("risk");

  if (riskSection) {

    riskSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}


/* =========================================================
   AI ACTION
========================================================= */

function executeAction() {

  const result =
    calculateSignals();

  const recovery =
    money(result.recovery * 0.20);

  const action =
    "AI ACTION READY — Prioritize conversion recovery, " +
    "reduce cancellation friction, and investigate " +
    "fulfillment SLA failures. Immediate recovery " +
    "opportunity: " +
    recovery + ".";

  if (aiResponse) {
    aiResponse.textContent =
      action;
  }

  showToast(
    "AI Action Plan generated successfully.",
    "success"
  );


  const actionSection =
    document.getElementById("actions");

  if (actionSection) {

    actionSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
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


  let response =
    "NEXUS ANALYST: ";


  const query =
    input.toLowerCase();


  if (
    query.includes("risk") ||
    query.includes("danger")
  ) {

    response +=
      "Current business risk is " +
      result.risk +
      "/100 with estimated exposure of " +
      money(result.exposure) +
      ". Focus first on the highest-impact signal.";

  }

  else if (
    query.includes("revenue") ||
    query.includes("money")
  ) {

    response +=
      "Estimated recoverable revenue is " +
      money(result.recovery) +
      ". The strongest opportunity is to address the conversion and fulfillment signals.";

  }

  else if (
    query.includes("customer") ||
    query.includes("customers")
  ) {

    response +=
      result.customers.toLocaleString() +
      " customers are currently classified within the elevated-risk model.";

  }

  else if (
    query.includes("action") ||
    query.includes("what should")
  ) {

    response +=
      "Recommended action: investigate conversion decline, " +
      "reduce cancellation friction, and resolve fulfillment delays.";

  }

  else {

    response +=
      "Based on the current signal profile, prioritize " +
      "the highest-risk operational driver and measure " +
      "recovery impact after intervention.";
  }


  if (aiResponse) {
    aiResponse.textContent =
      response;
  }


  showToast(
    "AI Analyst response generated.",
    "success"
  );
}


/* =========================================================
   ENTERPRISE SIMULATOR
========================================================= */

function runSimulation() {

  const result =
    calculateSignals();


  const improvedConversion =
    clamp(
      result.conversion + 1,
      0.5,
      6
    );


  const improvedCancellation =
    clamp(
      result.cancellation - 2,
      0,
      20
    );


  const improvedFulfillment =
    clamp(
      result.fulfillment - 3,
      0,
      30
    );


  const improvedResponse =
    clamp(
      result.response - 10,
      0,
      100
    );


  const original = {
    conversion: result.conversion,
    cancellation: result.cancellation,
    fulfillment: result.fulfillment,
    response: result.response
  };


  const simulatedRisk =
    calculateSimulation(
      improvedConversion,
      improvedCancellation,
      improvedFulfillment,
      improvedResponse
    );


  const recoveryGain =
    simulatedRisk.recovery -
    result.recovery;


  const healthGain =
    simulatedRisk.health -
    result.health;


  showToast(
    "Simulation complete: +" +
    healthGain +
    " health points and " +
    money(recoveryGain) +
    " additional recovery potential.",
    "success"
  );


  setTimeout(() => {

    if (conversionInput)
      conversionInput.value =
        original.conversion;

    if (cancellationInput)
      cancellationInput.value =
        original.cancellation;

    if (fulfillmentInput)
      fulfillmentInput.value =
        original.fulfillment;

    if (responseInput)
      responseInput.value =
        original.response;

    calculateSignals();

  }, CONFIG.simulationDelay);
}


/* =========================================================
   SIMULATION CALCULATOR
========================================================= */

function calculateSimulation(
  conversion,
  cancellation,
  fulfillment,
  response
) {

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


  const exposure =
    CONFIG.baseRevenue *
    (
      0.55 +
      (risk / 100) * 0.75
    );


  const recoveryRate =
    CONFIG.baseRecoveryRate +
    (risk / 100) * 0.12;


  const recovery =
    exposure *
    recoveryRate;


  const health =
    100 - risk;


  return {
    risk,
    exposure,
    recovery,
    health
  };
}


/* =========================================================
   TOAST SYSTEM
========================================================= */

function showToast(
  message,
  type = "success"
) {

  let container =
    document.querySelector(
      ".toast-container"
    );


  if (!container) {

    container =
      document.createElement("div");

    container.className =
      "toast-container";

    document.body.appendChild(
      container
    );
  }


  const toast =
    document.createElement("div");

  toast.className =
    "nexus-toast " +
    type;


  toast.innerHTML =
    `
      <span class="toast-dot"></span>
      <span>${escapeHTML(message)}</span>
    `;


  container.appendChild(
    toast
  );


  requestAnimationFrame(() => {

    toast.classList.add(
      "show"
    );

  });


  setTimeout(() => {

    toast.classList.remove(
      "show"
    );

    setTimeout(() => {

      toast.remove();

    }, 300);

  }, 3500);
}


/* =========================================================
   SECURITY
========================================================= */

function escapeHTML(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

  const navItems =
    qsa(".nav-item");


  navItems.forEach((item) => {

    item.addEventListener(
      "click",
      () => {

        navItems.forEach(
          (nav) =>
            nav.classList.remove(
              "active"
            )
        );

        item.classList.add(
          "active"
        );
      }
    );

  });
}


/* =========================================================
   SCROLL INTELLIGENCE
========================================================= */

function setupScrollSpy() {

  const sections =
    qsa("section[id]");

  const navItems =
    qsa(".nav-item");


  if (!sections.length) return;


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (!entry.isIntersecting)
              return;


            const id =
              entry.target.id;


            navItems.forEach(
              (item) => {

                item.classList.toggle(
                  "active",
                  item.getAttribute(
                    "href"
                  ) === "#" + id
                );

              }
            );

          }
        );

      },
      {
        threshold: 0.25
      }
    );


  sections.forEach(
    (section) =>
      observer.observe(section)
  );
}


/* =========================================================
   KEYBOARD SHORTCUTS
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "k"
    ) {

      event.preventDefault();

      if (analystInput) {

        analystInput.focus();

        showToast(
          "AI Analyst ready.",
          "succ
