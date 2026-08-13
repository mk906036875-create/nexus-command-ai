/* =========================================================
   NEXUS COMMAND AI — V10.1
   CEO EDITION
   LIVE SIMULATION + EXECUTIVE LEAD FORM
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  updateDashboard();

});


/* =========================
   HELPERS
========================= */

function $(id){
  return document.getElementById(id);
}


function money(value){

  if(value >= 1000000){
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if(value >= 1000){
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
}


/* =========================
   DASHBOARD ENGINE
========================= */

function updateDashboard(){

  const conversion =
    parseFloat($("conversion").value);

  const cancellation =
    parseFloat($("cancellation").value);

  const fulfillment =
    parseFloat($("fulfillment").value);

  const response =
    parseFloat($("response").value);


  /* HEALTH MODEL */

  let health = 100;

  health -= Math.max(
    0,
    (4 - conversion) * 8
  );

  health -= cancellation * 1.4;

  health -= fulfillment * .7;

  health -= response * .22;

  health = Math.round(
    Math.max(
      20,
      Math.min(98, health)
    )
  );


  const risk = 100 - health;


  /* FINANCIAL MODEL */

  const revenueRisk =
    Math.round(
      1800000 + risk * 18000
    );

  const recoverable =
    Math.round(
      revenueRisk *
      (.20 + risk / 500)
    );

  const customers =
    Math.round(
      9000 + risk * 130
    );


  /* KPI */

  $("healthScore").textContent = health;

  $("healthBar").style.width =
    health + "%";

  $("revenueRisk").textContent =
    money(revenueRisk);

  $("recoverable").textContent =
    money(recoverable);

  $("customers").textContent =
    customers.toLocaleString();


  /* HEALTH */

  if(health >= 75){

    $("healthStatus").textContent =
      "SYSTEM STABLE";

  }else if(health >= 50){

    $("healthStatus").textContent =
      "ATTENTION REQUIRED";

  }else{

    $("healthStatus").textContent =
      "HIGH RISK";
  }


  /* SIGNAL VALUES */

  $("conversionValue").textContent =
    conversion.toFixed(2) + "%";

  $("cancelValue").textContent =
    cancellation.toFixed(1) + "%";

  $("fulfillValue").textContent =
    fulfillment.toFixed(1) + "%";

  $("responseValue").textContent =
    response.toFixed(0) + "%";


  /* SIGNAL STATUS */

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


  /* AI DECISION */

  let decision =
    "Optimize healthy revenue growth";

  let decisionText =
    "Signals are stable. Focus on conversion and retention.";

  let priority =
    "MEDIUM";

  let priorityText =
    "Growth optimization";


  if(conversion < 2.8){

    decision =
      "Recover high-intent conversions";

    decisionText =
      "Prioritize checkout recovery before increasing acquisition spend.";

    priority =
      "HIGH";

    priorityText =
      "Conversion recovery";

  }else if(cancellation > 9){

    decision =
      "Reduce cancellation leakage";

    decisionText =
      "Focus on retention and proactive cancellation prevention.";

    priority =
      "HIGH";

    priorityText =
      "Retention recovery";

  }else if(fulfillment > 12){

    decision =
      "Stabilize fulfillment performance";

    decisionText =
      "Reduce SLA pressure before it becomes customer churn.";

    priority =
      "HIGH";

    priorityText =
      "Fulfillment recovery";

  }


  $("decision").textContent =
    decision;

  $("decisionText").textContent =
    decisionText;

  $("priority").textContent =
    priority;

  $("priorityText").textContent =
    priorityText;

  $("priorityRecovery").textContent =
    money(recoverable * .25);

}


/* =========================
   LIVE SIMULATION
========================= */

function runSimulation(showToast = true){

  const target =
    parseFloat($("targetConversion").value);

  $("targetValue").textContent =
    target.toFixed(2) + "%";


  let simulated =
    100 -
    Math.max(0,(4.5-target)*10);


  simulated =
    Math.round(
      Math.max(55,Math.min(98,simulated))
    );


  $("simHealth").textContent =
    simulated;


  if(showToast){

    showToastMessage(
      "NEXUS simulation complete — executive scenario updated."
    );

  }

}


/* =========================
   EXECUTE STRATEGY
========================= */

function executeStrategy(){

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

  },3500);

}


/* =========================
   MODAL
========================= */

function openLeadForm(){

  $("leadModal").classList.add("show");

  setTimeout(() => {

    $("leadName").focus();

  },100);

}


function closeLeadForm(){

  $("leadModal").classList.remove("show");

}


function closeOutside(event){

  if(event.target === $("leadModal")){

    closeLeadForm();

  }

}


/* =========================
   LEAD SUBMISSION
========================= */

function submitLead(event){

  event.preventDefault();


  const name =
    $("leadName").value.trim();

  const company =
    $("leadCompany").value.trim();

  const email =
    $("leadEmail").value.trim();

  const interest =
    $("leadInterest").value;


  if(!name || !company || !email || !interest){

    showToastMessage(
      "Please complete all executive request fields."
    );

    return;
  }


  /*
     DEMO MODE

     This creates a mailto request.
     Replace the email below with your
     real business email.
  */

  const destination =
    "mailto:YOUR_EMAIL@example.com" +
    "?subject=" +
    encodeURIComponent(
      "NEXUS Executive Demo Request"
    ) +
    "&body=" +
    encodeURIComponent(
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

function showToastMessage(message){

  const container =
    $("toast");

  container.innerHTML = "";

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

  },2800);


  setTimeout(() => {

    toast.remove();

  },3300);

}


/* =========================
   ESC KEY
========================= */

document.addEventListener(
  "keydown",
  event => {

    if(event.key === "Escape"){

      closeLeadForm();

    }

  }
);
