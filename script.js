 /* =========================================================
   NEXUS COMMAND AI V10
   CEO ONE-SCREEN DECISION ENGINE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     STATE
  ========================== */

  const state = {

    conversion: 2.84,

    cancellation: 8.7,

    fulfillment: 12.4,

    response: 31,

    actionsExecuted: 0,

    approved: false

  };


  /* =========================
     HELPER
  ========================== */

  const $ = id =>
    document.getElementById(id);


  /* =========================
     TOAST
  ========================== */

  function toast(message) {

    const old =
      document.querySelector(".nexus-toast");

    if (old) old.remove();

    const box =
      document.createElement("div");

    box.className =
      "nexus-toast";

    box.textContent =
      message;

    document.body.appendChild(box);

    setTimeout(() => {

      box.style.opacity = "0";

    }, 2300);

    setTimeout(() => {

      box.remove();

    }, 2800);

  }


  /* =========================
     MONEY FORMAT
  ========================== */

  function money(value) {

    if (value >= 1000000) {

      return "$" +
        (value / 1000000)
          .toFixed(2) +
        "M";

    }

    if (value >= 1000) {

      return "$" +
        Math.round(value / 1000) +
        "K";

    }

    return "$" +
      Math.round(value);

  }


  /* =========================
     BUSINESS HEALTH
  ========================== */

  function calculateHealth() {

    let health = 100;


    /*
      Conversion
    */

    health -=
      Math.max(
        0,
        (4.2 - state.conversion) * 7
      );


    /*
      Cancellation
    */

    health -=
      state.cancellation * 1.35;


    /*
      Fulfillment
    */

    health -=
      state.fulfillment * .65;


    /*
      Response
    */

    health -=
      state.response * .20;


    return Math.round(

      Math.max(
        20,
        Math.min(
          98,
          health
        )
      )

    );

  }


  /* =========================
     MAIN ENGINE
  ========================== */

  function updateDashboard() {

    const health =
      calculateHealth();

    const risk =
      100 - health;


    /*
      Revenue exposure
    */

    const revenueRisk =
      Math.round(
        1500000 +
        risk * 22000
      );


    /*
      Recovery
    */

    const recovery =
      Math.round(
        revenueRisk *
        (
          .20 +
          risk / 500
        )
      );


    /*
      Customers
    */

    const customers =
      Math.round(
        8500 +
        risk * 145
      );


    /* =====================
       KPI
    ===================== */

    $("healthScore").textContent =
      health;

    $("revenueRisk").textContent =
      money(revenueRisk);

    $("recoverableRevenue").textContent =
      money(recovery);

    $("customersRisk").textContent =
      customers.toLocaleString();


    /* =====================
       HEALTH
    ===================== */

    if (health >= 75) {

      $("healthStatus").textContent =
        "STABLE";

    } else if (health >= 55) {

      $("healthStatus").textContent =
        "ATTENTION";

    } else {

      $("healthStatus").textContent =
        "CRITICAL";

    }


    /* =====================
       CONFIDENCE
    ===================== */

    const confidence =
      Math.max(
        78,
        Math.min(
          96,
          Math.round(
            91 -
            Math.abs(
              health - 70
            ) * .15
          )
        )
      );

    $("aiConfidence").textContent =
      confidence + "%";


    /* =====================
       SIGNAL STATUS
    ===================== */

    $("conversionValue").textContent =
      state.conversion.toFixed(2) +
      "%";

    $("cancellationValue").textContent =
      state.cancellation.toFixed(1) +
      "%";

    $("fulfillmentValue").textContent =
      state.fulfillment.toFixed(1) +
      "%";

    $("responseValue").textContent =
      "+" +
      state.response +
      "%";


    $("conversionStatus").textContent =
      state.conversion < 2.5
        ? "CRITICAL"
        : state.conversion < 3.5
        ? "HIGH"
        : "STABLE";


    $("cancellationStatus").textContent =
      state.cancellation > 10
        ? "CRITICAL"
        : state.cancellation > 7
        ? "HIGH"
        : state.cancellation > 4
        ? "WATCH"
        : "STABLE";


    $("fulfillmentStatus").textContent =
      state.fulfillment > 18
        ? "CRITICAL"
        : state.fulfillment > 10
        ? "HIGH"
        : state.fulfillment > 5
        ? "WATCH"
        : "STABLE";


    $("responseStatus").textContent =
      state.response > 50
        ? "CRITICAL"
        : state.response > 25
        ? "WATCH"
        : "STABLE";


    /* =====================
       PRIORITY
    ===================== */

    let priority =
      "MEDIUM";

    if (risk >= 50) {

      priority =
        "CRITICAL";

    } else if (risk >= 30) {

      priority =
        "HIGH";

    }


    $("priorityLevel").textContent =
      priority;


    /* =====================
       CEO ALERT
    ===================== */

    if (risk >= 50) {

      $("alertTitle").textContent =
        "High revenue exposure detected across multiple signals.";

      $("alertDescription").textContent =
        "NEXUS recommends immediate intervention before increasing acquisition spend.";

    } else if (risk >= 30) {

      $("alertTitle").textContent =
        "Revenue leakage is developing.";

      $("alertDescription").textContent =
        "NEXUS recommends correcting the highest-impact operational signal.";

    } else {

      $("alertTitle").textContent =
        "Business signals are operating within a healthy range.";

      $("alertDescription").textContent =
        "NEXUS recommends focusing on controlled revenue growth.";

    }


    /* =====================
       AI DECISION
    ===================== */

    updateDecision(
      recovery
    );

  }


  /* =========================
     AI DECISION
  ========================== */

  function updateDecision(
    recoverable
  ) {

    let title;
    let description;


    if (
      state.conversion <
      2.8
    ) {

      title =
        "Recover high-intent lost conversions";

      description =
        "Conversion is the strongest revenue signal. Prioritize checkout recovery and fast-response workflows.";

    }

    else if (
      state.cancellation >
      9
    ) {

      title =
        "Reduce cancellation leakage";

      description =
        "High cancellation activity is exposing existing revenue. Focus on retention before acquisition.";

    }

    else if (
      state.fulfillment >
      12
    ) {

      title =
        "Stabilize fulfillment performance";

      description =
        "Fulfillment pressure is creating customer risk. Reduce SLA exposure before it becomes churn.";

    }

    else {

      title =
        "Optimize controlled revenue growth";

      description =
        "Core signals are stable. Focus on conversion improvement and customer retention.";

    }


    $("decisionTitle").textContent =
      title;

    $("decisionDescription").textContent =
      description;


    $("decisionRecovery").textContent =
      money(
        recoverable * .25
      );


    $("decisionConfidence").textContent =
      "87%";

  }


  /* =========================
     LIVE SLIDERS
  ========================== */

  $("conversionInput")
    .addEventListener(
      "input",
      event => {

        state.conversion =
          Number(
            event.target.value
          );

        updateDashboard();

      }
    );


  $("cancellationInput")
    .addEventListener(
      "input",
      event => {

        state.cancellation =
          Number(
            event.target.value
          );

        updateDashboard();

      }
    );


  $("fulfillmentInput")
    .addEventListener(
      "input",
      event => {

        state.fulfillment =
          Number(
            event.target.value
          );

        updateDashboard();

      }
    );


  $("responseInput")
    .addEventListener(
      "input",
      event => {

        state.response =
          Number(
            event.target.value
          );

        updateDashboard();

      }
    );


  /* =========================
     CEO APPROVAL
  ========================== */

  window.approveStrategy =
    function () {

      state.approved =
        true;

      $("executionStatus").textContent =
        "✓ Strategy approved by CEO. AI execution is ready.";

      $("approveButton").textContent =
        "✓ STRATEGY APPROVED";

      toast(
        "AI strategy approved successfully."
      );

    };


  /* =========================
     RECOVERY ACTION
  ========================== */

  window.runRecoveryAction =
    function () {

      state.actionsExecuted++;

      $("actionResult").textContent =
        "✓ Recovery workflow activated. High-intent demand has been prioritized.";

      toast(
        "Recovery action executed."
      );

    };


  /* =========================
     WHAT-IF
  ========================== */

  function runSimulation() {

    const targetConversion =
      Number(
        $("targetConversion").value
      );

    const targetCancellation =
      Number(
        $("targetCancellation").value
      );


    $("targetConversionValue")
      .textContent =
      targetConversion.toFixed(2) +
      "%";


    $("targetCancellationValue")
      .textContent =
      targetCancellation.toFixed(1) +
      "%";


    let simulated =
      100;


    simulated -=
      Math.max(
        0,
        (4.5 -
          targetConversion) * 7
      );


    simulated -=
      targetCancellation * 1.1;


    simulated -=
      state.fulfillment * .35;


    simulated -=
      state.response * .12;


    simulated =
      Math.round(
        Math.max(
          20,
          Math.min(
            99,
            simulated
          )
        )
      );


    $("simulatedHealth")
      .textContent =
      simulated;


    /*
      Potential upside
    */

    const currentHealth =
      calculateHealth();


    const healthGain =
      Math.max(
        0,
        simulated -
        currentHealth
      );


    const upside =
      Math.round(
        400000 +
        healthGain *
        145000
      );


    $("potentialUpside")
      .textContent =
      "+" +
      money(upside);

  }


  $("targetConversion")
    .addEventListener(
      "input",
      runSimulation
    );


  $("targetCancellation")
    .addEventListener(
      "input",
      runSimulation
    );


  /* =========================
     AI ANALYST
  ========================== */

  window.askNexus =
    function () {

      const input =
        $("analystInput");

      const response =
        $("aiResponse");


      const question =
        input.value
          .trim()
          .toLowerCase();


      if (!question) {

        response.textContent =
          "Ask NEXUS a strategic question.";

        return;

      }


      let answer;


      if (
        question.includes(
          "risk"
        )
      ) {

        answer =
          "Your primary risk is concentrated in the weakest live business signal. NEXUS recommends fixing the highest financial exposure first.";

      }

      else if (
        question.includes(
          "revenue"
        ) ||
        question.includes(
          "money"
        )
      ) {

        answer =
          "Protect existing revenue before increasing acquisition spend. Recovery of high-intent demand currently represents the strongest opportunity.";

      }

      else if (
        question.includes(
          "customer"
        )
      ) {

        answer =
          "Prioritize customers showing cancellation, response-delay or fulfillment-risk behavior.";

      }

      else if (
        question.includes(
          "first"
        ) ||
        question.includes(
          "action"
        ) ||
        question.includes(
          "focus"
        )
      ) {

        answer =
          $("decisionTitle").textContent +
          ". " +
          $("decisionDescription").textContent;

      }

      else if (
        question.includes(
          "ceo"
        )
      ) {

        answer =
          "CEO priority: identify the largest revenue exposure, approve the highest-value intervention and measure recovered revenue.";

      }

      else {

        answer =
          "Based on the current signals, focus on the highest-risk revenue leakage before increasing acquisition spend.";

      }


      response.textContent =
        answer;


      toast(
        "NEXUS analysis generated."
      );

    };


  /* =========================
     ENTER KEY
  ========================== */

  $("analystInput")
    .addEventListener(
      "keydown",
      event => {

        if (
          event.key ===
          "Enter"
        ) {

          event.preventDefault();

          askNexus();

        }

      }
    );


  /* =========================
     START ENGINE
  ========================== */

  updateDashboard();

  runSimulation();


  console.log(
    "NEXUS COMMAND AI V10 — CEO ENGINE ONLINE"
  );

});
