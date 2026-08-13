/* =========================================================
   NEXUS COMMAND AI — V5
   Enterprise Signal Intelligence Engine
========================================================= */

"use strict";

/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
  baseRevenue: 2400000,
  baseCustomers: 18420,
  baseRecoveryRate: 0.30,
  maxRisk: 100
};


/* =========================================================
   HELPERS
========================================================= */

const $ = (id) => document.getElementById(id);

function numberValue(element, fallback = 0) {
  if (!element) return fallback;

  const value = parseFloat(element.value);

  return Number.isFinite(value) ? value : fallback;
}


function money(value) {
  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
}


function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}


/* =========================================================
   SIGNAL INPUTS
========================================================= */

const conversionInput = $("conversionInput");
const cancellationInput = $("cancellationInput");
const fulfillmentInput = $("fulfillmentInput");
const responseInput = $("responseInput");


/* =========================================================
   SIGNAL OUTPUTS
========================================================= */

const conversionValue = $("conversionValue");
const cancellationValue = $("cancellationValue");
const fulfillmentValue = $("fulfillmentValue");
const responseValue = $("responseValue");

const liveRiskScore = $("liveRiskScore");
const liveExposure = $("liveExposure");
const liveRecovery = $("liveRecovery");

const revenueRisk = $("revenueRisk");
const recoverableRevenue = $("recoverableRevenue");
const customersRisk = $("customersRisk");

const healthScore = $("healthScore");
const healthText = $("healthText");
const healthBadge = $("healthBadge");

const confidenceValue = $("confidenceValue");

const decisionRecovery = $("decisionRecovery");
const decisionConfidence = $("decisionConfidence");

const roiNumber = $("roiNumber");
const recoveryPercent = $("recoveryPercent");
const recoveryProgress = $("recoveryProgress");

const forecastNumber = $("forecastNumber");


/* =========================================================
   CORE ENGINE
========================================================= */

function calculateNexus() {

  const conversion =
    numberValue(conversionInput, 2.84);

  const cancellation =
    numberValue(cancellationInput, 8.7);

  const fulfillment =
    numberValue(fulfillmentInput, 12.4);

  const response =
    numberValue(responseInput, 31);


  /* -----------------------------------------
     NORMALIZED SIGNALS
  ----------------------------------------- */

  const conversionRisk =
    clamp(
      ((3.8 - conversion) / 3.8) * 100,
      0,
      100
    );

  const cancellationRisk =
    clamp(
      (cancellation / 20) * 100,
      0,
      100
    );

  const fulfillmentRisk =
    clamp(
      (fulfillment / 30) * 100,
      0,
      100
    );

  const responseRisk =
    clamp(
      (response / 100) * 100,
      0,
      100
    );


  /* -----------------------------------------
     WEIGHTED RISK
  ----------------------------------------- */

  let risk =
    conversionRisk * 0.35 +
    cancellationRisk * 0.25 +
    fulfillmentRisk * 0.20 +
    responseRisk * 0.20;

  risk = Math.round(
    clamp(risk, 0, CONFIG.maxRisk)
  );


  /* -----------------------------------------
     FINANCIAL EXPOSURE
  ----------------------------------------- */

  const exposureMultiplier =
    0.55 + risk / 100 * 0.75;

  const exposure =
    CONFIG.baseRevenue *
    exposureMultiplier;


  /* -----------------------------------------
     RECOVERY OPPORTUNITY
  ----------------------------------------- */

  const recoveryRate =
    CONFIG.baseRecoveryRate -
    (risk < 25 ? 0.05 : 0) +
    (risk > 70 ? 0.04 : 0);

  const recovery =
    exposure *
    clamp(recoveryRate, 0.15, 0.40);


  /* -----------------------------------------
     CUSTOMERS
  ----------------------------------------- */

  const customers =
    Math.round(
      CONFIG.baseCustomers *
      (0.60 + risk / 100 * 0.40)
    );


  /* -----------------------------------------
     HEALTH
  ----------------------------------------- */

  const health =
    Math.round(
      100 - risk
    );


  /* -----------------------------------------
     CONFIDENCE
  ----------------------------------------- */

  const confidence =
    Math.round(
      clamp(
        78 +
        Math.abs(risk - 50) * 0.35 +
        (risk > 70 ? 4 : 0),
        78,
        98
      )
    );


  /* -----------------------------------------
     ROI MODEL
  ----------------------------------------- */

  const estimatedInvestment =
    Math.max(
      25000,
      recovery * 0.08
    );

  const roi =
    Math.round(
      ((recovery - estimatedInvestment) /
      estimatedInvestment) * 100
    );


  /* -----------------------------------------
     FORECAST
  ----------------------------------------- */

  const forecast =
    Math.round(
      recovery * 12
    );


  /* -----------------------------------------
     UPDATE
  ----------------------------------------- */

  updateUI({
    conversion,
    cancellation,
    fulfillment,
    response,
    risk,
    exposure,
    recovery,
    customers,
    health,
    confidence,
    roi,
    forecast
  });


  return {
    risk,
    exposure,
    recovery,
    customers,
    health,
    confidence,
    roi,
    forecast
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
    customers,
    health,
    confidence,
    roi,
    forecast
  } = data;


  /* SIGNAL VALUES */

  if (conversionValue)
    conversionValue.textContent =
      conversion.toFixed(2) + "%";

  if (cancellationValue)
    cancellationValue.textContent =
      cancellation.toFixed(1) + "%";

  if (fulfillmentValue)
    fulfillmentValue.textContent =
      fulfillment.toFixed(1) + "%";

  if (responseValue)
    responseValue.textContent =
      "+" + Math.round(response) + "%";


  /* LIVE ENGINE */

  if (liveRiskScore)
    liveRiskScore.textContent =
      risk + "/100";

  if (liveExposure)
    liveExposure.textContent =
      money(exposure);

  if (liveRecovery)
    liveRecovery.textContent =
      money(recovery);


  /* KPI */

  if (revenueRisk)
    revenueRisk.textContent =
      money(exposure);

  if (recoverableRevenue)
    recoverableRevenue.textContent =
      money(recovery);

  if (customersRisk)
    customersRisk.textContent =
      customers.toLocaleString();


  /* HEALTH */

  if (healthScore)
    healthScore.textContent =
      health;

  updateHealth(health);


  /* CONFIDENCE */

  if (confidenceValue)
    confidenceValue.textContent =
      confidence + "%";


  /* DECISION */

  if (decisionRecovery)
    decisionRecovery.textContent =
      money(recovery * 0.20);

  if (decisionConfidence)
    decisionConfidence.textContent =
      Math.max(82, confidence - 3) + "%";


  /* ROI */

  if (roiNumber)
    roiNumber.textContent =
      roi.toLocaleString() + "%";

  if (recoveryPercent)
    recoveryPercent.textContent =
      Math.round(
        clamp(
          recovery / exposure * 100,
          0,
          100
        )
      ) + "%";

  if (recoveryProgress)
    recoveryProgress.style.width =
      clamp(
        recovery / exposure * 100,
        0,
        100
      ) + "%";


  /* FORECAST */

  if (forecastNumber)
    forecastNumber.textContent =
      money(forecast);
}


/* =========================================================
   HEALTH STATE
========================================================= */

function updateHealth(score) {

  if (!healthText || !healthBadge)
    return;


  let text;
  let badge;


  if (score >= 80) {

    text = "Excellent";
    badge = "STABLE";

  } else if (score >= 65) {

    text = "Good";
    badge = "ATTENTION";

  } else if (score >= 45) {

    text = "At Risk";
    badge = "HIGH RISK";

  } else {

    text = "Critical";
    badge = "CRITICAL";
  }


  healthText.textContent =
    text;

  healthBadge.textContent =
    badge;
}


/* =========================================================
   LIVE SIGNAL LAB
========================================================= */

[
  conversionInput,
  cancellationInput,
  fulfillmentInput,
  responseInput
].forEach((input) => {

  if (!input) return;

  input.addEventListener(
    "input",
    calculateNexus
  );

});


/* =========================================================
   INVESTIGATE RISK
========================================================= */

window.investigateRisk = function () {

  const result =
    calculateNexus();


  const message =
`NEXUS RISK INVESTIGATION

Risk Score: ${result.risk}/100

Revenue Exposure:
${money(result.exposure)}

Recoverable Revenue:
${money(result.recovery)}

Customers At Risk:
${result.customers.toLocaleString()}

AI Confidence:
${result.confidence}%

Recommended Priority:
Recover high-intent opportunities first.`;


  showModal(
    "Risk Intelligence Report",
    message
  );
};


/* =========================================================
   EXECUTE AI ACTION
========================================================= */

window.executeAction = function () {

  const result =
    calculateNexus();


  const recovery =
    result.recovery * 0.20;


  showModal(
    "AI Action Ready",
`NEXUS ACTION PLAN

Priority:
Recover high-intent opportunities.

Estimated Recovery:
${money(recovery)}

Confidence:
${Math.max(82, result.confidence - 3)}%

Recommended execution:
1. Identify high-intent customers.
2. Prioritize highest-value opportunities.
3. Trigger recovery workflow.
4. Monitor conversion response.
5. Recalculate risk after intervention.

Status:
READY FOR HUMAN REVIEW`
  );
};


/* =========================================================
   AI ANALYST
========================================================= */

const aiInput =
  $("aiInput");

const aiResponse =
  $("aiResponse");

const aiButton =
  $("aiButton");


function runAIAnalyst() {

  const question =
    aiInput
      ? aiInput.value.trim()
      : "";


  const result =
    calculateNexus();


  if (!aiResponse)
    return;


  if (!question) {

    aiResponse.textContent =
`NEXUS ANALYST

Ask a business question such as:

• Where is my biggest revenue risk?
• What should I fix first?
• How much revenue can be recovered?
• Why is business health declining?`;

    return;
  }


  let answer = "";


  const q =
    question.toLowerCase();


  if (
    q.includes("revenue") ||
    q.includes("money") ||
    q.includes("risk")
  ) {

    answer =
`NEXUS ANALYSIS

Your current estimated exposure is ${money(result.exposure)}.

Estimated recoverable opportunity:
${money(result.recovery)}.

Priority should be placed on the signals producing the highest financial exposure.`;

  } else if (
    q.includes("health")
  ) {

    answer =
`BUSINESS HEALTH

Current score:
${result.health}/100.

Risk score:
${result.risk}/100.

AI confidence:
${result.confidence}%.

The fastest improvement path is to reduce the highest-weight signal first.`;

  } else if (
    q.includes("customer") ||
    q.includes("churn")
  ) {

    answer =
`CUSTOMER INTELLIGENCE

Estimated customers at risk:
${result.customers.toLocaleString()}.

Recommended action:
Prioritize high-value customers showing declining activity before broad campaigns.`;

  } else {

    answer =
`NEXUS RECOMMENDATION

Current risk:
${result.risk}/100

Exposure:
${money(result.exposure)}

Recovery opportunity:
${money(result.recovery)}

Next best action:
Investigate the highest-impact revenue signal and launch a targeted recovery workflow.`;
  }


  aiResponse.textContent =
    answer;
}


if (aiButton) {

  aiButton.addEventListener(
    "click",
    runAIAnalyst
  );

}


if (aiInput) {

  aiInput.addEventListener(
    "keydown",
    (event) => {

      if (event.key === "Enter") {
        runAIAnalyst();
      }

    }
  );

}


/* =========================================================
   MODAL
========================================================= */

function showModal(title, message) {

  const existing =
    document.getElementById(
      "nexusModal"
    );

  if (existing)
    existing.remove();


  const modal =
    document.createElement("div");

  modal.id =
    "nexusModal";


  modal.innerHTML = `
    <div class="nexus-modal-backdrop">

      <div class="nexus-modal">

        <button
          class="nexus-modal-close"
          aria-label="Close"
        >
          ×
        </button>

        <div class="nexus-modal-kicker">
          NEXUS COMMAND AI
        </div>

        <h3>${title}</h3>

        <pre>${message}</pre>

        <button
          class="nexus-modal-action"
        >
          Acknowledge
        </button>

      </div>

    </div>
  `;


  document.body.appendChild(modal);


  const close =
    modal.querySelector(
      ".nexus-modal-close"
    );

  const action =
    modal.querySelector(
      ".nexus-modal-action"
    );

  const backdrop =
    modal.querySelector(
      ".nexus-modal-backdrop"
    );


  close.onclick =
    () => modal.remove();

  action.onclick =
    () => modal.remove();

  backdrop.onclick =
    (event) => {

      if (
        event.target === backdrop
      ) {
        modal.remove();
      }

    };
}


/* =========================================================
   MODAL STYLE INJECTION
========================================================= */

function injectModalStyles() {

  if (
    document.getElementById(
      "nexusModalStyles"
    )
  ) return;


  const style =
    document.createElement("style");

  style.id =
    "nexusModalStyles";


  style.textContent = `
    .nexus-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 9999;

      display: grid;
      place-items: center;

      padding: 20px;

      background:
        rgba(0,0,0,.72);

      backdrop-filter:
        blur(10px);
    }

    .nexus-modal {
      position: relative;

      width: min(560px, 100%);

      padding: 26px;

      border:
        1px solid
        rgba(94,231,255,.18);

      border-radius: 16px;

      background:
        #0b1119;

      box-shadow:
        0 30px 100px
        rgba(0,0,0,.6);
    }

    .nexus-modal-kicker {
      color:
        #5ee7ff;

      font-size: 8px;
      font-weight: 900;

      letter-spacing:
        1.3px;
    }

    .nexus-modal h3 {
      margin-top: 7px;

      color:
        #f4f8fc;

      font-size: 19px;
    }

    .nexus-modal pre {
      white-space:
        pre-wrap;

      margin-top: 18px;

      padding: 15px;

      border:
        1px solid
        rgba(255,255,255,.07);

      border-radius: 10px;

      color:
        #aeb9c6;

      background:
        rgba(0,0,0,.22);

      font-family:
        Inter,
        Arial,
        sans-serif;

      font-size: 10px;

      line-height: 1.7;
    }

    .nexus-modal-close {
      position: absolute;

      top: 13px;
      right: 13px;

      width: 30px;
      height: 30px;

      border: 0;

      border-radius: 8px;

      color:
        #8b98a8;

      background:
        rgba(255,255,255,.04);

      font-size: 20px;
    }

    .nexus-modal-action {
      width: 100%;

      margin-top: 14px;

      padding: 11px;

      border: 0;

      border-radius: 8px;

      color:
        #041016;

      background:
        #5ee7ff;

      font-weight: 900;

      font-size: 10px;
    }
  `;


  document.head.appendChild(style);
}


/* =========================================================
   NAVIGATION
========================================================= */

function setupNavigation() {

  const links =
    document.querySelectorAll(
      ".nav-item"
    );


  links.forEach((link) => {

    link.addEventListener(
      "click",
      () => {

        links.forEach(
          (item) =>
            item.classList.remove(
              "active"
            )
        );

        link.classList.add(
          "active"
        );

      }
    );

  });
}


/* =========================================================
   SCROLL REVEAL
========================================================= */

function setupReveal() {

  const elements =
    document.querySelectorAll(
      ".panel, .kpi-card, .command-hero, .executive-alert"
    );


  elements.forEach(
    (element) => {

      element.style.opacity = "0";

      element.style.transform =
        "translateY(10px)";

      element.style.transition =
        "opacity .5s ease, transform .5s ease";
    }
  );


  if (
    !("IntersectionObserver" in window)
  ) {

    elements.forEach(
      (element) => {

        element.style.opacity = "1";

        element.style.transform =
          "translateY(0)";
      }
    );

    return;
  }


  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach(
          (entry) => {

            if (
              entry.isIntersecting
            ) {

              entry.target.style.opacity =
                "1";

              entry.target.style.transform =
                "translateY(0)";

              observer.unobserve(
                entry.target
              );
            }

          }
        );

      },
      {
        threshold: 0.08
      }
    );


  elements.forEach(
    (element) =>
      observer.observe(element)
  );
}


/* =========================================================
   KEYBOARD SHORTCUT
========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.ctrlKey &&
      event.key.toLowerCase() === "k"
    ) {

      event.preventDefault();

      if (aiInput) {

        aiInput.focus();

      }
    }

  }
);


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    injectModalStyles();

    setupNavigation();

    setupReveal();

    calculateNexus();

  }
);
