 /* =========================================================
   NEXUS COMMAND AI — V4
   Revenue Intelligence Scanner
========================================================= */

"use strict";


/* =========================================================
   CONFIG
========================================================= */

const CONFIG = {
  defaultRevenue: 2400000,
  recoveryRate: 0.30,
  highRiskThreshold: 65,
  mediumRiskThreshold: 40
};


/* =========================================================
   STATE
========================================================= */

let scanData = {
  records: [],
  scanned: false,
  revenueRisk: 0,
  recovery: 0,
  highRiskRecords: 0,
  riskScore: 0,
  leaks: []
};


/* =========================================================
   DOM
========================================================= */

const $ = (id) => document.getElementById(id);


/* =========================================================
   FORMATTERS
========================================================= */

function money(value) {

  value = Number(value) || 0;

  if (value >= 1000000) {
    return "$" + (value / 1000000).toFixed(2) + "M";
  }

  if (value >= 1000) {
    return "$" + Math.round(value / 1000) + "K";
  }

  return "$" + Math.round(value);
}


function number(value) {

  const n = parseFloat(value);

  return Number.isFinite(n) ? n : 0;
}


function clamp(value, min, max) {

  return Math.max(min, Math.min(max, value));
}


/* =========================================================
   CSV PARSER
========================================================= */

function parseCSV(text) {

  const rows = [];

  let row = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {

    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
      continue;
    }

    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === "," && !insideQuotes) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if (
      (char === "\n" || char === "\r") &&
      !insideQuotes
    ) {

      if (char === "\r" && next === "\n") {
        i++;
      }

      row.push(value.trim());

      if (row.some(cell => cell !== "")) {
        rows.push(row);
      }

      row = [];
      value = "";

      continue;
    }

    value += char;
  }

  if (value !== "" || row.length) {

    row.push(value.trim());

    if (row.some(cell => cell !== "")) {
      rows.push(row);
    }
  }

  if (rows.length < 2) {
    return [];
  }

  const headers = rows[0].map(header =>
    header
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
  );

  return rows.slice(1).map(row => {

    const object = {};

    headers.forEach((header, index) => {
      object[header] = row[index] || "";
    });

    return object;
  });
}


/* =========================================================
   FIND COLUMN
========================================================= */

function findColumn(record, possibleNames) {

  for (const name of possibleNames) {

    if (
      Object.prototype.hasOwnProperty.call(
        record,
        name
      )
    ) {
      return name;
    }
  }

  return null;
}


/* =========================================================
   NORMALIZE RECORD
========================================================= */

function normalizeRecord(record, index) {

  const revenueColumn = findColumn(record, [
    "revenue",
    "amount",
    "sales",
    "deal_value",
    "order_value",
    "value"
  ]);

  const conversionColumn = findColumn(record, [
    "conversion",
    "conversion_rate",
    "conversionrate"
  ]);

  const cancellationColumn = findColumn(record, [
    "cancellation",
    "cancellation_rate",
    "cancel_rate",
    "cancellations"
  ]);

  const fulfillmentColumn = findColumn(record, [
    "fulfillment",
    "fulfillment_delay",
    "delay",
    "delivery_delay"
  ]);

  const responseColumn = findColumn(record, [
    "response_time",
    "response",
    "response_rate"
  ]);

  const statusColumn = findColumn(record, [
    "status",
    "customer_status",
    "deal_status"
  ]);

  return {

    id:
      record.id ||
      record.customer_id ||
      record.order_id ||
      "REC-" + String(index + 1).padStart(4, "0"),

    revenue:
      number(
        revenueColumn
          ? record[revenueColumn]
          : 0
      ),

    conversion:
      number(
        conversionColumn
          ? record[conversionColumn]
          : 0
      ),

    cancellation:
      number(
        cancellationColumn
          ? record[cancellationColumn]
          : 0
      ),

    fulfillment:
      number(
        fulfillmentColumn
          ? record[fulfillmentColumn]
          : 0
      ),

    response:
      number(
        responseColumn
          ? record[responseColumn]
          : 0
      ),

    status:
      String(
        statusColumn
          ? record[statusColumn]
          : ""
      ).toLowerCase(),

    original: record
  };
}


/* =========================================================
   RECORD RISK
========================================================= */

function calculateRecordRisk(record) {

  let score = 0;

  /*
    Conversion
  */

  if (record.conversion > 0) {

    if (record.conversion < 1) {
      score += 35;
    }

    else if (record.conversion < 2) {
      score += 25;
    }

    else if (record.conversion < 3) {
      score += 12;
    }
  }


  /*
    Cancellation
  */

  if (record.cancellation >= 15) {
    score += 30;
  }

  else if (record.cancellation >= 10) {
    score += 22;
  }

  else if (record.cancellation >= 5) {
    score += 12;
  }


  /*
    Fulfillment
  */

  if (record.fulfillment >= 25) {
    score += 20;
  }

  else if (record.fulfillment >= 15) {
    score += 14;
  }

  else if (record.fulfillment >= 8) {
    score += 7;
  }


  /*
    Response
  */

  if (record.response >= 60) {
    score += 20;
  }

  else if (record.response >= 40) {
    score += 14;
  }

  else if (record.response >= 25) {
    score += 7;
  }


  /*
    Status
  */

  const riskyStatus =
    record.status.includes("cancel") ||
    record.status.includes("lost") ||
    record.status.includes("refund") ||
    record.status.includes("churn") ||
    record.status.includes("failed");

  if (riskyStatus) {
    score += 15;
  }


  return clamp(
    Math.round(score),
    0,
    100
  );
}


/* =========================================================
   DETECT LEAKS
========================================================= */

function detectLeaks(records) {

  let conversionLoss = 0;
  let cancellationLoss = 0;
  let fulfillmentLoss = 0;
  let responseLoss = 0;

  records.forEach(record => {

    const revenue =
      record.revenue || 0;

    if (
      record.conversion > 0 &&
      record.conversion < 2
    ) {
      conversionLoss +=
        revenue * 0.25;
    }

    if (
      record.cancellation >= 10
    ) {
      cancellationLoss +=
        revenue * 0.20;
    }

    if (
      record.fulfillment >= 15
    ) {
      fulfillmentLoss +=
        revenue * 0.15;
    }

    if (
      record.response >= 40
    ) {
      responseLoss +=
        revenue * 0.10;
    }
  });


  const leaks = [

    {
      name: "Conversion Leakage",
      description:
        "Low conversion signals are reducing potential revenue.",
      amount: conversionLoss,
      level: conversionLoss > 100000 ? "CRITICAL" : "HIGH"
    },

    {
      name: "Cancellation Leakage",
      description:
        "Elevated cancellations indicate avoidable revenue loss.",
      amount: cancellationLoss,
      level: cancellationLoss > 100000 ? "HIGH" : "MEDIUM"
    },

    {
      name: "Fulfillment Leakage",
      description:
        "Delivery or fulfillment delays may be driving lost value.",
      amount: fulfillmentLoss,
      level: fulfillmentLoss > 100000 ? "HIGH" : "MEDIUM"
    },

    {
      name: "Response-Time Leakage",
      description:
        "Slow response signals may be causing opportunity loss.",
      amount: responseLoss,
      level: responseLoss > 100000 ? "HIGH" : "MEDIUM"
    }

  ];

  return leaks
    .filter(item => item.amount > 0)
    .sort(
      (a, b) =>
        b.amount - a.amount
    );
}


/* =========================================================
   RUN SCAN
========================================================= */

function runScan(records) {

  if (!records || !records.length) {

    updateStatus(
      "No valid business records found.",
      true
    );

    return;
  }


  const normalized =
    records.map(normalizeRecord);


  const totalRevenue =
    normalized.reduce(
      (sum, record) =>
        sum + record.revenue,
      0
    );


  const enriched =
    normalized.map(record => ({
      ...record,
      risk:
        calculateRecordRisk(record)
    }));


  const highRisk =
    enriched.filter(
      record =>
        record.risk >=
        CONFIG.highRiskThreshold
    );


  const averageRisk =
    enriched.reduce(
      (sum, record) =>
        sum + record.risk,
      0
    ) / enriched.length;


  const leaks =
    detectLeaks(enriched);


  const calculatedLeakage =
    leaks.reduce(
      (sum, item) =>
        sum + item.amount,
      0
    );


  const revenueRisk =
    calculatedLeakage > 0
      ? calculatedLeakage
      : totalRevenue *
        (averageRisk / 100) *
        0.25;


  const recovery =
    revenueRisk *
    CONFIG.recoveryRate;


  scanData = {

    records: enriched,

    scanned: true,

    revenueRisk:
      Math.max(0, revenueRisk),

    recovery:
      Math.max(0, recovery),

    highRiskRecords:
      highRisk.length,

    riskScore:
      Math.round(averageRisk),

    leaks
  };


  updateDashboard();

  updateLeakageList();

  updatePriority();

  updateRecovery();

  updateExecutiveSignal();

  updateStatus(
    "Scan complete. Revenue intelligence generated successfully."
  );
}


/* =========================================================
   UPDATE DASHBOARD
========================================================= */

function updateDashboard() {

  const records =
    scanData.records.length;

  const revenueRisk =
    scanData.revenueRisk;

  const recovery =
    scanData.recovery;

  const highRisk =
    scanData.highRiskRecords;


  if ($("recordsScanned")) {
    $("recordsScanned").textContent =
      records.toLocaleString();
  }

  if ($("scannerRevenueRisk")) {
    $("scannerRevenueRisk").textContent =
      money(revenueRisk);
  }

  if ($("scannerRecovery")) {
    $("scannerRecovery").textContent =
      money(recovery);
  }

  if ($("highRiskRecords")) {
    $("highRiskRecords").textContent =
      highRisk.toLocaleString();
  }
}


/* =========================================================
   LEAKAGE UI
========================================================= */

function updateLeakageList() {

  const container =
    $("leakageList");

  if (!container) {
    return;
  }


  if (!scanData.leaks.length) {

    container.innerHTML = `
      <div class="empty-state">
        No major leakage pattern detected.
      </div>
    `;

    return;
  }


  container.innerHTML =
    scanData.leaks
      .map(item => `

        <div class="leakage-row">

          <span class="leakage-dot"></span>

          <div>

            <strong>
              ${escapeHTML(item.name)}
            </strong>

            <small>
              ${escapeHTML(item.description)}
            </small>

          </div>

          <b>
            ${money(item.amount)}
          </b>

          <em class="leakage-level">
            ${item.level}
          </em>

        </div>

      `)
      .join("");
}


/* =========================================================
   PRIORITY ACTION
========================================================= */

function updatePriority() {

  const container =
    $("priorityAction");

  if (!container) {
    return;
  }


  if (!scanData.scanned) {
    return;
  }


  const topLeak =
    scanData.leaks[0];


  if (!topLeak) {

    container.innerHTML = `

      <div class="priority-number">
        01
      </div>

      <div>

        <span>
          LOW EXPOSURE
        </span>

        <h4>
          No urgent leakage detected
        </h4>

        <p>
          Continue monitoring business signals.
        </p>

      </div>

    `;

    return;
  }


  container.innerHTML = `

    <div class="priority-number">
      01
    </div>

    <div>

      <span>
        PRIORITY RECOVERY ACTION
      </span>

      <h4>
        Attack ${escapeHTML(topLeak.name)}
      </h4>

      <p>
        Estimated exposure:
        <strong>
          ${money(topLeak.amount)}
        </strong>
      </p>

    </div>

  `;
}


/* =========================================================
   RECOVERY
========================================================= */

function updateRecovery() {

  if ($("roiNumber")) {
    $("roiNumber").textContent =
      money(scanData.recovery);
  }


  const rate =
    scanData.revenueRisk > 0
      ? Math.round(
          (scanData.recovery /
            scanData.revenueRisk) *
          100
        )
      : 0;


  if ($("recoveryPercent")) {
    $("recoveryPercent").textContent =
      rate + "%";
  }


  if ($("recoveryProgress")) {
    $("recoveryProgress").style.width =
      clamp(rate, 0, 100) + "%";
  }


  if ($("nextBestAction")) {

    $("nextBestAction").textContent =
      scanData.leaks.length
        ? "RECOVER"
        : "MONITOR";
  }
}


/* =========================================================
   EXECUTIVE SIGNAL
========================================================= */

function updateExecutiveSignal() {

  if (!scanData.scanned) {
    return;
  }


  if ($("executiveSignal")) {

    $("executiveSignal").textContent =
      `${scanData.highRiskRecords} high-risk records detected with ${money(scanData.revenueRisk)} potential revenue exposure.`;
  }


  if ($("executiveDescription")) {

    const top =
      scanData.leaks[0];

    $("executiveDescription").textContent =
      top
        ? `${top.name} is currently the highest-value leakage signal. Estimated recovery opportunity: ${money(scanData.recovery)}.`
        : "No major leakage category crossed the detection threshold.";
  }
}


/* =========================================================
   RECOVERY PLAN
========================================================= */

function generateRecoveryPlan() {

  const response =
    $("aiResponse");

  if (!response) {
    return;
  }


  if (!scanData.scanned) {

    response.textContent =
      "Run a business scan first. NEXUS needs detected signals before generating a recovery plan.";

    return;
  }


  const top =
    scanData.leaks[0];


  if (!top) {

    response.textContent =
      "NEXUS recommends continuous monitoring because no major revenue leakage signal was detected.";

    return;
  }


  response.textContent =

`NEXUS RECOVERY PLAN

1. PRIORITY
Focus immediately on ${top.name}.

2. DETECTED EXPOSURE
${money(top.amount)}

3. ESTIMATED RECOVERY
${money(scanData.recovery)}

4. FIRST ACTION
Identify the highest-value records contributing to this signal and contact or remediate them first.

5. SECOND ACTION
Create a targeted operational intervention for the affected workflow.

6. THIRD ACTION
Monitor the same signal after intervention and compare the new leakage rate.

EXECUTIVE TARGET
Recover the highest-value opportunities first rather than treating every record equally.`;
}


/* =========================================================
   AI ANALYST
========================================================= */

function askCommander() {

  const input =
    $("aiQuestion");

  const response =
    $("aiResponse");


  if (!input || !response) {
    return;
  }


  const question =
    input.value
      .trim()
      .toLowerCase();


  if (!question) {

    response.textContent =
      "Ask a business question first.";

    return;
  }


  if (!scanData.scanned) {

    response.textContent =
      "NEXUS needs a completed business scan before answering data-based questions.";

    return;
  }


  const top =
    scanData.leaks[0];


  if (
    question.includes("most money") ||
    question.includes("biggest risk") ||
    question.includes("largest risk")
  ) {

    response.textContent =
      top
        ? `The biggest detected exposure is ${top.name}, representing approximately ${money(top.amount)} in potential leakage.`
        : "No major leakage category was detected.";

    return;
  }


  if (
    question.includes("recover") ||
    question.includes("recovery")
  ) {

    response.textContent =
      `NEXUS estimates ${money(scanData.recovery)} of recovery opportunity from ${money(scanData.revenueRisk)} of potential revenue exposure.`;

    return;
  }


  if (
    question.includes("risk") ||
    question.includes("danger")
  ) {

    response.textContent =
      `Current average business risk is ${scanData.riskScore}/100. ${scanData.highRiskRecords} records are classified as high risk.`;

    return;
  }


  if (
    question.includes("action") ||
    question.includes("next")
  ) {

    response.textContent =
      top
        ? `The next best action is to address ${top.name} first because it represents the highest detected leakage value.`
        : "The next best action is continued monitoring.";

    return;
  }


  response.textContent =
`NEXUS ANALYSIS

Records scanned:
${scanData.records.length.toLocaleString()}

Revenue at risk:
${money(scanData.revenueRisk)}

Recovery opportunity:
${money(scanData.recovery)}

High-risk records:
${scanData.highRiskRecords.toLocaleString()}

Current risk score:
${scanData.riskScore}/100

Top signal:
${top ? top.name : "No major leakage detected"}

Ask:
"Where are we losing the most money?"
"How much can we recover?"
"What is the biggest risk?"
"What should we do next?"`;
}


/* =========================================================
   SAMPLE DATA
========================================================= */

function generateSampleData() {

  return [

    {
      id: "ORD-1001",
      revenue: 185000,
      conversion: 1.4,
      cancellation: 14,
      fulfillment: 19,
      response: 47,
      status: "active"
    },

    {
      id: "ORD-1002",
      revenue: 240000,
      conversion: 2.7,
      cancellation: 4,
      fulfillment: 7,
      response: 18,
      status: "active"
    },

    {
      id: "ORD-1003",
      revenue: 315000,
      conversion: 0.9,
      cancellation: 17,
      fulfillment: 22,
      response: 64,
      status: "at-risk"
    },

    {
      id: "ORD-1004",
      revenue: 125000,
      conversion: 3.4,
      cancellation: 2,
      fulfillment: 5,
      response: 15,
      status: "active"
    },

    {
      id: "ORD-1005",
      revenue: 290000,
      conversion: 1.7,
      cancellation: 11,
      fulfillment: 16,
      response: 42,
      status: "at-risk"
    },

    {
      id: "ORD-1006",
      revenue: 410000,
      conversion: 0.8,
      cancellation: 19,
      fulfillment: 27,
      response: 72,
      status: "lost"
    },

    {
      id: "ORD-1007",
      revenue: 160000,
      conversion: 2.1,
      cancellation: 6,
      fulfillment: 11,
      response: 28,
      status: "active"
    },

    {
      id: "ORD-1008",
      revenue: 375000,
      conversion: 1.2,
      cancellation: 13,
      fulfillment: 18,
      response: 55,
      status: "at-risk"
    }

  ];
}


/* =========================================================
   SAMPLE SCAN
========================================================= */

function runSampleScan() {

  updateStatus(
    "Loading sample business data..."
  );


  setTimeout(() => {

    runScan(
      generateSampleData()
    );

  }, 500);
}


/* =========================================================
   FILE UPLOAD
============================
