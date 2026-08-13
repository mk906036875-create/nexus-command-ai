/* =========================================================
   NEXUS COMMAND AI — V8.1
   ENTERPRISE AUTONOMOUS DECISION INTELLIGENCE ENGINE
   WORKING INTERACTIVE SCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     CORE STATE
  ========================= */

  const nexusState = {
    riskScore: 68,
    healthScore: 82,
    revenueAtRisk: 2400000,
    recoverableRevenue: 730000,
    actionsExecuted: 0,
    scanCount: 0
  };

  /* =========================
     HELPERS
  ========================= */

  const $ = (selector) => document.querySelector(selector);

  const $$ = (selector) => document.querySelectorAll(selector);

  function toast(message, type = "success") {
    let existing = $(".nexus-toast");

    if (!existing) {
      existing = document.createElement("div");
      existing.className = "nexus-toast";
      document.body.appendChild(existing);
    }

    existing.textContent = message;

    existing.style.cssText = `
      position:fixed;
      right:20px;
      bottom:20px;
      z-index:99999;
      padding:15px 20px;
      border-radius:12px;
      background:#101827;
      color:#fff;
      border:1px solid rgba(255,255,255,.15);
      box-shadow:0 10px 35px rgba(0,0,0,.35);
      font-weight:600;
      max-width:360px;
      animation:nexusToast .3s ease;
    `;

    if (type === "danger") {
      existing.style.borderColor = "#ff4d6d";
    }

    if (type === "warning") {
      existing.style.borderColor = "#ffb020";
    }

    setTimeout(() => {
      existing.style.opacity = "0";
    }, 2800);

    setTimeout(() => {
      existing.remove();
    }, 3300);
  }

  function formatMoney(value) {
    if (value >= 1000000) {
      return "$" + (value / 1000000).toFixed(2) + "M";
    }

    if (value >= 1000) {
      return "$" + (value / 1000).toFixed(0) + "K";
    }

    return "$" + value.toLocaleString();
  }

  function animateNumber(element, start, end, duration = 900) {
    if (!element) return;

    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      const value = Math.floor(
        start + (end - start) * progress
      );

      element.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /* =========================
     ADD TOAST ANIMATION
  ========================= */

  const style = document.createElement("style");

  style.textContent = `
    @keyframes nexusToast {
      from {
        transform:translateY(20px);
        opacity:0;
      }
      to {
        transform:translateY(0);
        opacity:1;
      }
    }

    .nexus-active {
      transform:translateY(-2px);
      transition:.25s ease;
    }

    .nexus-pulse {
      animation:nexusPulse 1s ease;
    }

    @keyframes nexusPulse {
      0% { transform:scale(1); }
      50% { transform:scale(1.04); }
      100% { transform:scale(1); }
    }
  `;

  document.head.appendChild(style);

  /* =========================
     NAVIGATION
  ========================= */

  $$("a[href^='#']").forEach(link => {

    link.addEventListener("click", (event) => {

      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  });

  /* =========================
     SCROLL SPY
  ========================= */

  const sections = $$("section[id]");
  const navLinks = $$("a[href^='#']");

  window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

      const top = section.offsetTop - 150;

      if (window.scrollY >= top) {
        current = section.id;
      }

    });

    navLinks.forEach(link => {

      link.classList.remove("active");

      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }

    });

  });

  /* =========================
     BUSINESS RISK SCANNER
  ========================= */

  function runRiskScan() {

    nexusState.scanCount++;

    toast(
      "NEXUS is scanning business signals...",
      "warning"
    );

    setTimeout(() => {

      const riskChange =
        Math.floor(Math.random() * 11) - 5;

      nexusState.riskScore = Math.max(
        35,
        Math.min(
          92,
          nexusState.riskScore + riskChange
        )
      );

      nexusState
