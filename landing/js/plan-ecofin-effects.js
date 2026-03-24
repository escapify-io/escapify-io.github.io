/**
 * Escapify · Plan Ecofin — revelado al scroll, parallax en mesh
 * Alineado con lean-canvas-effects.js · Respeta prefers-reduced-motion
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add(reduceMotion ? "ef-reduce-motion" : "ef-motion-ok");

  function revealAll() {
    document.querySelectorAll("[data-ef-reveal]").forEach(function (el) {
      el.classList.add("ef-revealed");
    });
  }

  function stagger(selector, base, step) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      if (el.hasAttribute("data-ef-reveal")) return;
      el.setAttribute("data-ef-reveal", "");
      el.setAttribute("data-ef-delay", String(base + i * step));
    });
  }

  if (reduceMotion) {
    stagger(".ec-grid-2 .ec-card", 0, 0);
    stagger(".ec-metrics .ec-metric", 0, 0);
    stagger(".kpis .kpi", 0, 0);
    stagger(".ec-notes .ec-note", 0, 0);
    stagger(".table-wrap", 0, 0);
    stagger(".ec-section-title", 0, 0);
    revealAll();
    return;
  }

  stagger(".ec-grid-2 .ec-card", 0.06, 0.08);
  stagger(".ec-metrics .ec-metric", 0.05, 0.028);
  stagger(".kpis .kpi", 0.08, 0.06);
  stagger(".ec-notes .ec-note", 0.06, 0.07);
  stagger(".table-wrap", 0.1, 0.06);
  stagger(".ec-section-title", 0.04, 0.03);
  stagger(".ec-callout", 0.08, 0);
  stagger(".note-foot", 0.12, 0);

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseFloat(el.getAttribute("data-ef-delay") || "0", 10);
        setTimeout(function () {
          el.classList.add("ef-revealed");
        }, delay * 1000);
        io.unobserve(el);
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );

  document.querySelectorAll("[data-ef-reveal]").forEach(function (el) {
    io.observe(el);
  });

  function initVisualMicroAnimations() {
    function observeOnce(el, cb, threshold) {
      if (!("IntersectionObserver" in window)) {
        cb();
        return;
      }
      var done = false;
      var o = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (done || !e.isIntersecting) return;
            done = true;
            cb();
            o.unobserve(el);
          });
        },
        { threshold: threshold || 0.2 }
      );
      o.observe(el);
    }

    document.querySelectorAll(".esf-bar-fill, .bar span").forEach(function (el) {
      if (el.dataset.efAnimDone === "1") return;
      var pctRaw = (el.style.getPropertyValue("--esf-pct") || "").trim();
      var widthRaw = (el.style.width || "").trim();
      var target = !isNaN(parseFloat(pctRaw)) ? parseFloat(pctRaw) : parseFloat(widthRaw);
      if (isNaN(target)) return;
      el.dataset.efAnimDone = "1";
      el.style.width = "0%";
      el.style.transition = "width .9s cubic-bezier(.22,.61,.36,1)";
      observeOnce(el, function () {
        requestAnimationFrame(function () {
          el.style.width = target + "%";
        });
      });
    });

    document.querySelectorAll(".esf-donut, .esf-ring").forEach(function (el) {
      if (el.dataset.efAnimDone === "1") return;
      var prop = el.classList.contains("esf-ring") ? "--esf-ring-p" : "--p";
      var target = parseFloat((el.style.getPropertyValue(prop) || "").trim());
      if (isNaN(target)) return;
      el.dataset.efAnimDone = "1";
      el.style.setProperty(prop, "0");
      observeOnce(el, function () {
        var start = null;
        var dur = 950;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = target * eased;
          el.style.setProperty(prop, val.toFixed(2));
          var hole = el.querySelector(".esf-donut-hole");
          if (hole && /%/.test(hole.textContent || "")) {
            hole.textContent = Math.round(val) + "%";
          }
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      });
    });

    document.querySelectorAll("[data-k]").forEach(function (el) {
      if (el.dataset.efCountDone === "1") return;
      var raw = (el.textContent || "").trim();
      var num = parseFloat(raw.replace(/[^\d.,-]/g, "").replace(",", "."));
      if (isNaN(num)) return;
      var suffix = raw.replace(/[\d.,\s-]/g, "");
      var prefix = raw.startsWith("€") ? "€" : "";
      var decimals = num % 1 === 0 ? 0 : 1;
      el.dataset.efCountDone = "1";
      observeOnce(el, function () {
        var start = null;
        var dur = 850;
        function tick(ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          var val = (num * eased).toFixed(decimals);
          el.textContent = prefix + val + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
      }, 0.3);
    });
  }

  initVisualMicroAnimations();

  var mesh = document.querySelector("[data-ef-mesh]");
  if (!mesh) return;

  var mx = 0,
    my = 0,
    rx = 0,
    ry = 0;
  var ticking = false;

  function onMove(e) {
    var w = window.innerWidth,
      h = window.innerHeight;
    mx = (e.clientX / w - 0.5) * 2;
    my = (e.clientY / h - 0.5) * 2;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateMesh);
    }
  }

  function updateMesh() {
    ticking = false;
    rx += (mx * 11 - rx) * 0.07;
    ry += (my * 9 - ry) * 0.07;
    mesh.style.setProperty("--ef-mx", rx.toFixed(2) + "px");
    mesh.style.setProperty("--ef-my", ry.toFixed(2) + "px");
    if (Math.abs(mx * 11 - rx) > 0.04 || Math.abs(my * 9 - ry) > 0.04) {
      ticking = true;
      requestAnimationFrame(updateMesh);
    }
  }

  window.addEventListener("mousemove", onMove, { passive: true });
})();
