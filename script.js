/* =========================================================
   NEXUS COMMAND AI
   Enterprise Intelligence Platform
   script.js — V1 Demo Intelligence Engine
========================================================= */

"use strict";

/* =========================================================
   DEMO BUSINESS DATA
   Clearly marked as DEMO data
========================================================= */

const DEMO_DATA = {
  revenue: 12800000,
  previousRevenue: 13900000,

  conversionRate: 2.84,
  previousConversionRate: 3.33,

  cancellations: 8.7,
  previousCancellations: 6.9,

  fulfillmentDelay: 12.4,
  previousFulfillmentDelay: 9.4,

  customersAtRisk: 18420,

  recoverableRevenue: 730000,

  abandonedHighIntentLeads: 3820,

  responseDelayIncrease: 31,

  estimatedRisk: 2400000
};


/* =========================================================
   GLOBAL STATE
========================================================= */

const state = {
  scanRunning: false,
  investigated: false,
  actionReviewed: false,
  lastQuestion: ""
};


/* =========================================================
   DOM HELPERS
========================================================= */

function getElement(selector) {
  return document.querySelector(selector);
}

function getAll(selector) {
  return document.querySelectorAll(selector);
}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  initializeNavigation();

  initializeCards();

  initializeQuery();

  calculateBusinessHealth();

  console.log(
    "NEXUS COMMAND AI initialized in DEMO MODE."
  );
});


/* =========================================================
   NAVIGATION
========================================================= */

function initializeNavigation() {

  const navItems = getAll(".nav-item");

  navItems.forEach(item => {

    item.addEventListener("click", () => {

      navItems.forEach(nav => {
        nav.classList.remove("active");
      });

      item.classList.add("active");

    });

  });

}


/* =========================================================
   CARD INTERACTION
========================================================= */

function initializeCards() {

  const cards = getAll(".kpi-card");

  cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

      card.style.transform = "translateY(-3px)";

    });

    card.addEventListener("mouseleave", () => {

      card.style.transform = "";

    });

  });

}


/* =========================================================
   BUSINESS HEALTH SCORE
========================================================= */

function calculateBusinessHealth() {

  const conversionRisk =
    Math.min(
      (DEMO_DATA.previousConversionRate -
        DEMO_DATA.conversionRate) * 20,
      25
    );

  const cancellationRisk =
    Math.min(
      (DEMO_DATA.cancellations -
        DEMO_DATA.previousCancellations) * 3,
      20
    );

  const fulfillmentRisk =
    Math.min(
      (DEMO_DATA.fulfillmentDelay -
        DEMO_DATA.previousFulfillmentDelay) * 2,
      20
    );

  let score =
    100 -
    conversionRisk -
    cancellationRisk -
    fulfillmentRisk;

  score = Math.max(
    0,
    Math.min(100, Math.round(score))
  );

  const scoreElement =
    document.querySelector(".score-ring strong");

  if (scoreElement) {
    scoreElement.textContent = score;
  }

  const scoreInfo =
    document.querySelector(".score-info strong");

  if (scoreInfo) {

    if (score >= 80) {
      scoreInfo.textContent = "Healthy";
    } else if (score >= 65) {
      scoreInfo.textContent = "Good";
    } else if (score >= 50) {
      scoreInfo.textContent = "Attention";
    } else {
      scoreInfo.textContent = "Critical";
    }

  }

  return score;
}


/* =========================================================
   CRITICAL RISK INVESTIGATION
========================================================= */

function investigateRisk() {

  if (state.scanRunning) return;

  state.scanRunning = true;
  state.investigated = true;

  const button =
    document.querySelector(".primary-btn");

  if (button) {

    button.disabled = true;
    button.textContent = "Analyzing signals...";

  }

  showToast(
    "AI Signal Engine started analysis..."
  );

  setTimeout(() => {

    const result = generateRiskAnalysis();

    showInvestigationResult(result);

    if (button) {

      button.disabled = false;
      button.textContent = "Analysis Complete ✓";

    }

    state.scanRunning = false;

  }, 1500);

}


/* =========================================================
   RISK ANALYSIS ENGINE
========================================================= */

function generateRiskAnalysis() {

  const conversionDrop =
    (
      (
        DEMO_DATA.previousConversionRate -
        DEMO_DATA.conversionRate
      ) /
      DEMO_DATA.previousConversionRate
    ) * 100;


  const cancellationIncrease =
    (
      (
        DEMO_DATA.cancellations -
        DEMO_DATA.previousCancellations
      ) /
      DEMO_DATA.previousCancellations
    ) * 100;


  const fulfillmentIncrease =
    (
      (
        DEMO_DATA.fulfillmentDelay -
        DEMO_DATA.previousFulfillmentDelay
      ) /
      DEMO_DATA.previousFulfillmentDelay
    ) * 100;


  let confidence = 82;

  if (conversionDrop > 10) {
    confidence += 3;
  }

  if (cancellationIncrease > 15) {
    confidence += 2;
  }

  if (fulfillmentIncrease > 15) {
    confidence += 2;
  }

  confidence =
    Math.min(97, confidence);


  return {

    conversionDrop:
      conversionDrop.toFixed(1),

    cancellationIncrease:
      cancellationIncrease.toFixed(1),

    fulfillmentIncrease:
      fulfillmentIncrease.toFixed(1),

    confidence,

    risk:
      DEMO_DATA.estimatedRisk,

    recovery:
      DEMO_DATA.recoverableRevenue

  };

}


/* =========================================================
   SHOW INVESTIGATION RESULT
========================================================= */

function showInvestigationResult(result) {

  const panel =
    document.querySelector(".critical-alert");

  if (!panel) return;


  const content =
    panel.querySelector(".alert-content");

  if (content) {

    content.innerHTML = `

      <div class="alert-label">
        AI INVESTIGATION COMPLETE
      </div>

      <h2>
        Multiple connected signals are contributing
        to revenue exposure.
      </h2>

      <p>
        Conversion declined ${result.conversionDrop}%,
        cancellations increased ${result.cancellationIncrease}%,
        and fulfillment delays increased
        ${result.fulfillmentIncrease}%.
      </p>

    `;

  }


  const confidence =
    panel.querySelector(".confidence strong");

  if (confidence) {
    confidence.textContent =
      result.confidence + "%";
  }


  showToast(
    "Root-cause analysis completed."
  );

}


/* =========================================================
   AI ACTION ENGINE
========================================================= */

function executeAction() {

  if (state.actionReviewed) {

    showToast(
      "Action already reviewed."
    );

    return;
  }


  state.actionReviewed = true;


  const button =
    document.querySelector(".action-btn");


  if (button) {

    button.textContent =
      "Preparing Action Plan...";

    button.disabled = true;

  }


  showToast(
    "AI is generating an action plan..."
  );


  setTimeout(() => {

    const recovery =
      calculateRecoveryOpportunity();


    showActionModal(recovery);


    if (button) {

      button.disabled = false;

      button.textContent =
        "Action Plan Ready ✓";

    }

  }, 1200);

}


/* =========================================================
   RECOVERY CALCULATION
========================================================= */

function calculateRecoveryOpportunity() {

  const leads =
    DEMO_DATA.abandonedHighIntentLeads;


  const estimatedConversion =
    0.18;


  const averageOrderValue =
    211;


  const estimatedRecovered =
    leads *
    estimatedConversion *
    averageOrderValue;


  return {

    leads,

    conversion:
      estimatedConversion * 100,

    averageOrderValue,

    estimatedRecovered:
      Math.round(estimatedRecovered)

  };

}


/* =========================================================
   ACTION MODAL
========================================================= */

function showActionModal(data) {

  const existing =
    document.querySelector(".action-modal");

  if (existing) {
    existing.remove();
  }


  const modal =
    document.createElement("div");

  modal.className =
    "action-modal";


  modal.innerHTML = `

    <div class="action-modal-overlay"></div>

    <div class="action-modal-box">

      <div
