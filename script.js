/* =========================================================
   NEXUS COMMAND AI — V10.3
   CEO INTELLIGENCE EDITION
   Dynamic Revenue Intelligence + CEO AI Insight
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  runSimulation(false);
});


/* =========================
   HELPERS
========================= */

function $(id) {
  return document.getElementById(id);
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


/* =========================
   DASHBOARD ENGINE
========================= */

function updateDashboard() {

  const conversion = parseFloat($("conversion").value);
  const cancellation = parseFloat($("cancellation").value);
  const fulfillment = parseFloat($("fulfillment").value);
  const response = parseFloat($("response").value);


  /* =========================
     BUSINESS HEALTH
  ========================= */

  let health = 100;

  health -= Math.max(0, (4 - conversion) * 8);
  health -= cancellation * 1.4;
  health -= fulfillment * 0.7;
  health -= response * 0.22;

  health = Math.round(
    Math.max(20, Math.min(98, health))
  );


  const risk = 100 - health;


  /* =========================
     REVENUE INTELLIGENCE
  ========================= */

  const baseRevenueRisk = 1800000;

  const revenueRisk = Math.round(
    baseRevenueRisk + risk * 18000
  );


  const recoveryRate = Math.min(
    0.48,
    0.20 + risk / 500
  );


  const recoverable = Math.round(
    revenueRisk * recoveryRate
  );


  const customers = Math.round(
    9000 + risk * 130
  );


  const recoveryPriority = Math.round(
    recoverable * 0.25
  );


  /* =========================
     KPI UPDATE
  ========================= */

  $("healthScore").textContent = health;

  $("healthBar").style.width =
    health + "%";


  $("revenueRisk").textContent =
    money(revenueRisk);


  $("recoverable").textContent =
    money(recoverable);


  $("customers").textContent =
    customers.toLocaleString();


  $("priorityRecovery").textContent =
    money(recoveryPriority);


  /* =========================
     HEALTH STATUS
  ========================= */

  if (health >= 80) {

    $("healthStatus").textContent =
      "SYSTEM STABLE";

  } else if (health >= 60) {

    $("healthStatus").textContent =
      "ATTENTION REQUIRED";

  } else {

    $("healthStatus").textContent =
      "HIGH RISK";
  }


  /* =========================
     SIGNAL VALUES
  ========================= */

  $("conversionValue").textContent =
    conversion.toFixed(2) + "%";


  $("cancelValue").textContent =
    cancellation.toFixed(1) + "%";


  $("fulfillValue").textContent =
    fulfillment.toFixed(1) + "%";


  $("responseValue").textContent =
    response.toFixed(0) + "%";


  /* =========================
     SIGNAL STATUS
  ========================= */

  $("conversionStatus").textContent =
    conversion < 2.5
      ? "CRITICAL"
      : conversion < 3.5
      ? "HIGH"
      : "STABLE";


  $("cancelStatus").textContent =
    cancellation > 10
      ? "CRITICAL"
      : cancellation > 7
      ? "HIGH"
      : cancellation > 4
      ? "WATCH"
      : "STABLE";


  $("fulfillStatus").textContent =
    fulfillment > 18
      ? "CRITICAL"
      : fulfillment > 10
      ? "HIGH"
      : fulfillment > 5
      ? "WATCH"
      : "STABLE";


  $("responseStatus").textContent =
    response > 50
      ? "CRITICAL"
      : response > 25
      ? "WATCH"
      : "STABLE";


  /* =========================
     AI DECISION ENGINE
  ========================= */

  let decision =
    "Optimize healthy revenue growth";

  let decisionText =
    "Signals are stable. Focus on conversion, retention and controlled growth.";

  let priority =
    "MEDIUM";

  let priorityText =
    "Growth optimization";


  if (conversion < 2.8) {

    decision =
      "Recover high-intent conversions";

    decisionText =
      "Checkout friction is creating revenue exposure. Prioritize conversion recovery before increasing acquisition spend.";

    priority =
      "HIGH";

    priorityText =
      "Conversion recovery";


  } else if (cancellation > 9) {

    decision =
      "Reduce cancellation leakage";

    decisionText =
      "Customer cancellations are creating avoidable revenue loss. Activate proactive retention actions.";

    priority =
      "HIGH";

    priorityText =
      "Retention recovery";


  } else if (fulfillment > 12) {

    decision =
      "Stabilize fulfillment performance";

    decisionText =
      "Fulfillment pressure may increase customer churn. Reduce SLA risk before scaling demand.";

    priority =
      "HIGH";

    priorityText =
      "Fulfillment recovery";


  } else if (response > 40) {

    decision =
      "Accelerate response operations";

    decisionText =
      "Slow response performance is creating potential customer and revenue leakage.";

    priority =
      "MEDIUM";

    priorityText =
      "Response optimization";
  }


  $("decision").textContent =
    decision;


  $("decisionText").textContent =
    decisionText;


  $("priority").textContent =
    priority;


  $("priorityText").textContent =
    priorityText;


  /* =========================
     AI CONFIDENCE
  ========================= */

  const confidence =
    Math.round(
      Math.max(
        72,
        Math.min(
          97,
          94 - risk * 0.08
        )
      )
    );


  if ($("confidence")) {
    $("confidence").textContent =
      confidence + "%";
  }


  /* =========================
     CEO AI INSIGHT
  ========================= */

  updateCEOInsight(
    conversion,
    cancellation,
    fulfillment,
    response,
    health,
    revenueRisk,
    recoverable
  );
}


/* =========================
   CEO AI INSIGHT ENGINE
========================= */

function updateCEOInsight(
  conversion,
  cancellation,
  fulfillment,
  response,
  health,
  revenueRisk,
  recoverable
) {

  if (!$("ceoInsight")) {
    return;
  }


  let title =
    "Business signals are within manageable range.";

  let text =
    "NEXUS recommends controlled optimization while monitoring revenue and customer behavior.";


  /* CONVERSION RISK */

  if (conversion < 2.5) {

    title =
      "Revenue leakage is being driven by conversion pressure.";

    text =
      "The highest-value move is to recover high-intent customers before increasing acquisition spend. Estimated exposure is " +
      money(revenueRisk) +
      " with approximately " +
      money(recoverable) +
      " in recoverable revenue potential.";
  }


  /* CANCELLATION RISK */

  else if (cancellation > 10) {

    title =
      "Customer cancellation is becoming a material revenue risk.";

    text =
      "NEXUS recommends immediate retention intervention. Reduce preventable cancellations before scaling new customer acquisition.";
  }


  /* FULFILLMENT RISK */

  else if (fulfillment > 18) {

    title =
      "Fulfillment pressure may become a customer-retention problem.";

    text =
      "Stabilize operational delivery and SLA performance before increasing demand. Operational recovery should be prioritized.";
  }


  /* RESPONSE RISK */

  else if (response > 50) {

    title =
      "Response latency is creating avoidable business exposure.";

    text =
      "Accelerate response workflows and prioritize high-value customer interactions to reduce potential revenue leakage.";
  }


  /* HEALTHY STATE */

  else if (health >= 85) {

    title =
      "Business operating conditions are strong.";

    text =
      "NEXUS recommends controlled growth optimization while protecting current conversion, retention and fulfillment performance.";
  }


  $("ceoInsight").textContent =
    title;


  $("ceoInsightText").textContent =
    text;
}


/* =========================
   WHAT-IF SIMULATION
========================= */

function runSimulation(showToast = true) {

  const target =
    parseFloat(
      $("targetConversion").value
    );


  $("targetValue").textContent =
    target.toFixed(2) + "%";


  let simulatedHealth =
    100 -
    Math.max(
      0,
      (4.5 - target) * 10
    );


  simulatedHealth =
    Math.round(
      Math.max(
        55,
        Math.min(
          98,
          simulatedHealth
        )
      )
    );


  $("simHealth").textContent =
    simulatedHealth;


  const currentConversion =
    parseFloat(
      $("conversion").value
    );


  const improvement =
    Math.max(
      0,
      target - currentConversion
    );


  const monthlyRevenueOpportunity =
    Math.round(
      improvement * 185000
    );


  let message;


  if (improvement >= 1) {

    message =
      "Strong recovery scenario — approximately " +
      money(monthlyRevenueOpportunity) +
      " monthly revenue upside may be available.";

  } else if (improvement >= 0.5) {

    message =
      "Positive recovery scenario — measurable revenue upside is available.";

  } else {

    message =
      "Limited improvement — focus on the highest-risk signal first.";
  }


  if (showToast) {

    showToastMessage(
      "NEXUS simulation complete — " +
      message
    );
  }
}


/* =========================
   EXECUTE STRATEGY
========================= */

function executeStrategy() {

  const button =
    document.querySelector(".execute");


  button.textContent =
    "✓ STRATEGY EXECUTED";


  button.style.background =
    "#75f5d5";


  showToastMessage(
    "AI strategy executed successfully in simulation mode."
  );


  setTimeout(() => {

    button.textContent =
      "EXECUTE RECOMMENDED STRATEGY →";


    button.style.background =
      "";

  }, 3500);
}


/* =========================
   MODAL
========================= */

function openLeadForm() {

  $("leadModal").classList.add("show");


  setTimeout(() => {

    $("leadName").focus();

  }, 100);
}


function closeLeadForm() {

  $("leadModal").classList.remove("show");
}


function closeOutside(event) {

  if (event.target === $("leadModal")) {

    closeLeadForm();

  }
}


/* =========================
   LEAD SUBMISSION
========================= */

function submitLead(event) {

  event.preventDefault();


  const name =
    $("leadName").value.trim();


  const company =
    $("leadCompany").value.trim();


  const email =
    $("leadEmail").value.trim();


  const interest =
    $("leadInterest").value;


  if (
    !name ||
    !company ||
    !email ||
    !interest
  ) {

    showToastMessage(
      "Please complete all executive request fields."
    );

    return;
  }


  /*
    IMPORTANT:
    Replace YOUR_EMAIL@example.com
    with your real business email.
  */

  const destination =
    "mailto:YOUR_EMAIL@example.com" +
    "?subject=" +
    encodeURIComponent(
      "NEXUS Executive Demo Request"
    ) +
    "&body=" +
    encodeURIComponent(
      "NEXUS COMMAND AI Executive Demo Request\n\n" +
      "Name: " + name +
      "\nCompany: " + company +
      "\nEmail: " + email +
      "\nInterest: " + interest
    );


  window.location.href =
    destination;


  showToastMessage(
    "Executive request prepared successfully."
  );


  closeLeadForm();
}


/* =========================
   TOAST
========================= */

function showToastMessage(message) {

  const container =
    $("toast");


  container.innerHTML =
    "";


  const toast =
    document.createElement("div");


  toast.className =
    "toast";


  toast.textContent =
    message;


  container.appendChild(toast);


  setTimeout(() => {

    toast.style.opacity =
      "0";

  }, 2800);


  setTimeout(() => {

    toast.remove();

  }, 3300);
}


/* =========================
   ESC KEY
========================= */

document.addEventListener(
  "keydown",
  event => {

    if (event.key === "Escape") {

      closeLeadForm();

    }
  }
);
