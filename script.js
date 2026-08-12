 "use strict";

/* =========================================================
   NEXUS COMMAND AI — V2
   Enterprise Signal Intelligence Engine
========================================================= */

const CONFIG = {
  baseRevenue: 2400000,
  baseCustomers: 18420
};


/* =========================
   HELPERS
========================= */

const $ = id => document.getElementById(id);

function money(value) {

  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
}


function num(element, fallback) {

  if (!element) return fallback;

  const n = parseFloat(element.value);

  return Number.isFinite(n) ? n : fallback;
}


/* =========================
   SIGNAL INPUTS
========================= */

const conversionInput = $("conversionInput");
const cancellationInput = $("cancellationInput");
const fulfillmentInput = $("fulfillmentInput");
const responseInput = $("responseInput");


/* =========================
   CALCULATE ENGINE
========================= */

function calculateSignals() {

  const conversion =
    num(conversionInput, 2.84);

  const cancellation =
    num(cancellationInput, 8.7);

  const fulfillment =
    num(fulfillmentInput, 12.4);

  const response =
    num(responseInput, 31);


  const conversionRisk =
    Math.max(
      0,
      (3.8 - conversion) / 3.3
    ) * 35;

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


  const exposure =
    CONFIG.baseRevenue *
    (0.65 + risk / 100 * 0.65);


  const recovery =
    exposure *
    (0.18 + risk / 100 * 0.14);


  const health =
    Math.max(0, 100 - risk);


  const customers =
    Math.round(
      CONFIG.baseCustomers *
      (0.65 + risk / 100 * 0.35)
    );


  const confidence =
    Math.round(
      Math.min(
        98,
        78 + Math.abs(risk - 50) * 0.35
      )
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


/* =========================
   UPDATE DASHBOARD
========================= */

function updateDashboard() {

  const data =
    calculateSignals();


  /* SIGNAL VALUES */

  if ($("conversionValue"))
    $("conversionValue").textContent =
      data.conversion.toFixed(2) + "%";


  if ($("cancellationValue"))
    $("cancellationValue").textContent =
      data.cancellation.toFixed(1) + "%";


  if ($("fulfillmentValue"))
    $("fulfillmentValue").textContent =
      data.fulfillment.toFixed(1) + "%";


  if ($("responseValue"))
    $("responseValue").textContent =
      "+" + Math.round(data.response) + "%";


  /* KPI */

  if ($("revenueRisk"))
    $("revenueRisk").textContent =
      money(data.exposure);


  if ($("recoverableRevenue"))
    $("recoverableRevenue").textContent =
      money(data.recovery);


  if ($("customersRisk"))
    $("customersRisk").textContent =
      data.customers.toLocaleString();


  /* HEALTH */

  if ($("healthScore"))
    $("healthScore").textContent =
      data.health;


  if ($("healthText")) {

    $("healthText").textContent =
      data.health >= 80
        ? "Healthy"
        : data.health >= 60
        ? "Good"
        : data.health >= 40
        ? "Attention"
        : "Critical";
  }


  if ($("healthBadge")) {

    $("healthBadge").textContent =
      data.health >= 80
        ? "HEALTHY"
        : data.health >= 60
        ? "ATTENTION"
        : data.health >= 40
        ? "HIGH RISK"
        : "CRITICAL";
  }


  /* CONFIDENCE */

  if ($("confidence"))
    $("confidence").textContent =
      data.confidence + "%";


  /* SIGNAL RESULT */

  if ($("liveRiskScore"))
    $("liveRiskScore").textContent =
      data.risk + "/100";


  if ($("liveExposure"))
    $("liveExposure").textContent =
      money(data.exposure);


  if ($("liveRecovery"))
    $("liveRecovery").textContent =
      money(data.recovery);


  /* SIGNAL RELATIONSHIP */

  if ($("graphResponse"))
    $("graphResponse").textContent =
      "+" + Math.round(data.response) + "%";


  if ($("graphRisk"))
    $("graphRisk").textContent =
      money(data.exposure);


  if ($("graphRecovery"))
    $("graphRecovery").textContent =
      money(data.recovery);


  /* AI DECISION */

  if ($("decisionRecovery"))
    $("decisionRecovery").textContent =
      money(data.recovery * 0.20);


  if ($("decisionConfidence"))
    $("decisionConfidence").textContent =
      data.confidence + "%";


  /* ROI */

  if ($("roiNumber"))
    $("roiNumber").textContent =
      "$" + Math.round(data.recovery).toLocaleString();


  const recoveryPercent =
    Math.round(
      Math.min(
        95,
        45 + data.risk * 0.35
      )
    );


  if ($("recoveryPercent"))
    $("recoveryPercent").textContent =
      recoveryPercent + "%";


  if ($("recoveryProgress"))
    $("recoveryProgress").style.width =
      recoveryPercent + "%";


  /* FORECAST */

  if ($("forecastNumber"))
    $("forecastNumber").textContent =
      "-" + money(data.exposure * 0.28);


  return data;
}


/* =========================
   SIGNAL SCAN
========================= */

function runSignalScan() {

  const button =
    document.querySelector(
      ".signal-result button"
    );


  if (!button) {
    updateDashboard();
    return;
  }


  button.disabled = true;

  button.textContent =
    "Scanning Signals...";


  setTimeout(() => {

    updateDashboard();

    button.textContent =
      "✓ Scan Complete";


    setTimeout(() => {

      button.disabled = false;

      button.textContent =
        "Run Signal Scan →";

    }, 1400);

  }, 700);
}


/* =========================
   INVESTIGATE RISK
========================= */

function investigateRisk() {

  const data =
    updateDashboard();


  showAI(
`NEXUS INVESTIGATION COMPLETE

Combined Risk: ${data.risk}/100

Revenue Exposure: ${money(data.exposure)}

Recovery Opportunity: ${money(data.recovery)}

Customers At Risk: ${data.customers.toLocaleString()}

AI Confidence: ${data.confidence}%

Priority:
Investigate the strongest connected signal first.`
  );
}


/* =========================
   AI ACTION
========================= */

function executeAction() {

  const data =
    updateDashboard();


  const button =
    document.querySelector(
      ".action-button"
    );


  if (!button) return;


  button.disabled = true;

  button.textContent =
    "Analyzing...";


  setTimeout(() => {

    button.disabled = false;

    button.textContent =
      "✓ AI Action Ready";


    showAI(
`AI ACTION PLAN

Priority:
Recover high-intent opportunities.

Estimated Recovery:
${money(data.recovery * 0.20)}

Confidence:
${data.confidence}%

Recommended Next Step:
Prioritize the highest-value affected segment.`
    );

  }, 800);
}


/* =========================
   ASK NEXUS
========================= */

function askCommander() {

  const input =
    $("aiQuestion");

  if (!input) return;


  const question =
    input.value.trim();


  if (!question) {

    showAI(
      "Please enter a business question."
    );

    return;
  }


  const data =
    updateDashboard();


  const q =
    question.toLowerCase();


  let answer;


  if (
    q.includes("risk") ||
    q.includes("danger")
  ) {

    answer =
`RISK ANALYSIS

Current Risk:
${data.risk}/100

Business Health:
${data.health}/100

Revenue Exposure:
${money(data.exposure)}

Priority:
Investigate the strongest connected signal first.`;

  }

  else if (
    q.includes("revenue") ||
    q.includes("sales")
  ) {

    answer =
`REVENUE ANALYSIS

Revenue Exposure:
${money(data.exposure)}

Recovery Opportunity:
${money(data.recovery)}

Priority:
Investigate conversion and response-time signals.`;

  }

  else if (
    q.includes("recover")
  ) {

    answer =
`RECOVERY ANALYSIS

Recovery Opportunity:
${money(data.recovery)}

Recommended Strategy:
Prioritize high-intent customers and leads showing negative signals.`;

  }

  else if (
    q.includes("customer") ||
    q.includes("churn")
  ) {

    answer =
`CUSTOMER ANALYSIS

Modeled Customers At Risk:
${data.customers.toLocaleString()}

Priority:
Identify high-value customers with declining engagement.`;

  }

  else {

    answer =
`NEXUS BUSINESS ANALYSIS

Risk:
${data.risk}/100

Health:
${data.health}/100

Revenue Exposure:
${money(data.exposure)}

Recovery Opportunity:
${money(data.recovery)}

Try asking:

"What is the biggest risk?"

"How much revenue is exposed?"

"What can we recover?"

"What should we do next?"`;

  }


  showAI(answer);
}


/* =========================
   SHOW AI RESPONSE
========================= */

function showAI(message) {

  const box =
    $("aiResponse");


  if (!box) return;


  box.style.display =
    "block";

  box.textContent =
    message;
}


/* =========================
   LIVE SLIDERS
========================= */

[
  conversionInput,
  cancellationInput,
  fulfillmentInput,
  responseInput
]
.forEach(input => {

  if (input) {

    input.addEventListener(
      "input",
      updateDashboard
    );

  }

});


/* =========================
   ENTER KEY
========================= */

const questionInput =
  $("aiQuestion");


if (questionInput) {

  questionInput.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        askCommander();
      }

    }
  );

}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateDashboard();

    console.log(
      "NEXUS COMMAND AI V2 — ONLINE"
    );

  }
);
