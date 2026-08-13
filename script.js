 /* =========================================================
   NEXUS COMMAND AI — V8.2
   FULL WORKING INTERACTIVE ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  const state = {
    conversion: 2.84,
    cancellation: 8.7,
    fulfillment: 12.4,
    response: 31,
    actions: 0
  };

  const $ = id => document.getElementById(id);

  /* =========================
     TOAST
  ========================= */

  function toast(message) {

    const old = document.querySelector(".nexus-toast");
    if (old) old.remove();

    const box = document.createElement("div");

    box.className = "nexus-toast";
    box.textContent = message;

    box.style.cssText = `
      position:fixed;
      right:20px;
      bottom:20px;
      z-index:99999;
      background:#101827;
      color:white;
      padding:15px 20px;
      border:1px solid #00e6b8;
      border-radius:12px;
      font-weight:700;
      box-shadow:0 15px 40px rgba(0,0,0,.4);
      transition:.3s;
    `;

    document.body.appendChild(box);

    setTimeout(() => {
      box.style.opacity = "0";
    }, 2500);

    setTimeout(() => box.remove(), 3000);
  }

  /* =========================
     MONEY
  ========================= */

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
     CALCULATE
  ========================= */

  function calculate() {

    let health = 100;

    health -= Math.max(
      0,
      (4 - state.conversion) * 8
    );

    health -= state.cancellation * 1.4;

    health -= state.fulfillment * .7;

    health -= state.response * .22;

    health = Math.round(
      Math.max(
        20,
        Math.min(98, health)
      )
    );

    const risk = 100 - health;

    const revenueRisk =
      Math.round(
        1800000 + risk * 18000
      );

    const recoverable =
      Math.round(
        revenueRisk * (.20 + risk / 500)
      );

    const customers =
      Math.round(
        9000 + risk * 130
      );

    /* =========================
       MAIN KPI
    ========================= */

    if ($("healthScore"))
      $("healthScore").textContent = health;

    if ($("revenueRisk"))
      $("revenueRisk").textContent =
        money(revenueRisk);

    if ($("recoverableRevenue"))
      $("recoverableRevenue").textContent =
        money(recoverable);

    if ($("customersRisk"))
      $("customersRisk").textContent =
        customers.toLocaleString();

    if ($("forecastNumber"))
      $("forecastNumber").textContent =
        money(recoverable);

    /* =========================
       HEALTH STATUS
    ========================= */

    let status = "SYSTEM STABLE";
    let healthText = "Good";

    if (health < 70) {
      status = "ATTENTION REQUIRED";
      healthText = "Attention";
    }

    if (health < 50) {
      status = "HIGH RISK";
      healthText = "Critical";
    }

    if ($("healthStatus"))
      $("healthStatus").textContent = status;

    if ($("healthText"))
      $("healthText").textContent = healthText;

    if ($("healthBadge"))
      $("healthBadge").textContent =
        health >= 70 ? "STABLE" :
        health >= 50 ? "ATTENTION" :
        "CRITICAL";

    /* =========================
       SIGNAL VALUES
    ========================= */

    if ($("conversionValue"))
      $("conversionValue").textContent =
        state.conversion.toFixed(2) + "%";

    if ($("cancellationValue"))
      $("cancellationValue").textContent =
        state.cancellation.toFixed(1) + "%";

    if ($("fulfillmentValue"))
      $("fulfillmentValue").textContent =
        state.fulfillment.toFixed(1) + "%";

    if ($("responseValue"))
      $("responseValue").textContent =
        "+" + state.response + "%";

    /* =========================
       SIGNAL STATUS
    ========================= */

    if ($("conversionStatus"))
      $("conversionStatus").textContent =
        state.conversion < 2.5 ? "CRITICAL" :
        state.conversion < 3.5 ? "HIGH" :
        "STABLE";

    if ($("cancellationStatus"))
      $("cancellationStatus").textContent =
        state.cancellation > 10 ? "CRITICAL" :
        state.cancellation > 7 ? "HIGH" :
        state.cancellation > 4 ? "WATCH" :
        "STABLE";

    if ($("fulfillmentStatus"))
      $("fulfillmentStatus").textContent =
        state.fulfillment > 18 ? "CRITICAL" :
        state.fulfillment > 10 ? "HIGH" :
        state.fulfillment > 5 ? "WATCH" :
        "STABLE";

    if ($("responseStatus"))
      $("responseStatus").textContent =
        state.response > 50 ? "CRITICAL" :
        state.response > 25 ? "WATCH" :
        "STABLE";

    /* =========================
       RISK EXPOSURE
    ========================= */

    if ($("conversionExposure"))
      $("conversionExposure").textContent =
        money(revenueRisk * .30);

    if ($("fulfillmentExposure"))
      $("fulfillmentExposure").textContent =
        money(revenueRisk * .20);

    if ($("cancellationExposure"))
      $("cancellationExposure").textContent =
        money(revenueRisk * .15);

    if ($("responseExposure"))
      $("responseExposure").textContent =
        money(revenueRisk * .10);

    /* =========================
       RECOVERY
    ========================= */

    const recovery =
      Math.min(
        85,
        Math.round(20 + risk * .45)
      );

    if ($("recoveryPercent"))
      $("recoveryPercent").textContent =
        recovery + "%";

    if ($("recoveryProgress"))
      $("recoveryProgress").style.width =
        recovery + "%";

    /* =========================
       AI DECISION
    ========================= */

    updateDecision(recoverable);

    /* =========================
       ALERT
    ========================= */

    if ($("alertTitle")) {

      $("alertTitle").textContent =
        risk >= 50
        ? "High revenue exposure detected across multiple signals."
        : risk >= 30
        ? "Moderate revenue leakage is developing."
        : "Business signals are operating within a healthy range.";
    }

    if ($("alertDescription")) {

      $("alertDescription").textContent =
        risk >= 50
        ? "NEXUS recommends immediate intervention."
        : "Continue monitoring live business signals.";
    }
  }

  /* =========================
     AI DECISION
  ========================= */

  function updateDecision(recoverable) {

    let title;
    let description;

    if (state.conversion < 2.8) {

      title = "Recover high-intent lost conversions";

      description =
        "Prioritize checkout recovery and fast-response workflows.";

    } else if (state.cancellation > 9) {

      title = "Reduce cancellation leakage";

      description =
        "Focus on retention and proactive cancellation prevention.";

    } else if (state.fulfillment > 12) {

      title = "Stabilize fulfillment performance";

      description =
        "Reduce SLA pressure before it becomes customer churn.";

    } else {

      title = "Optimize healthy revenue growth";

      description =
        "Signals are stable. Focus on conversion and retention.";
    }

    if ($("decisionTitle"))
      $("decisionTitle").textContent = title;

    if ($("decisionDescription"))
      $("decisionDescription").textContent =
        description;

    if ($("decisionRecovery"))
      $("decisionRecovery").textContent =
        money(recoverable * .25);

    if ($("decisionConfidence"))
      $("decisionConfidence").textContent =
        "87%";
  }

  /* =========================
     RISK SCAN
  =================
