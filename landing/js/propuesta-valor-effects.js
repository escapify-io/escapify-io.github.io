/**
 * Escapify · Propuesta de valor — revelado al scroll, parallax en mesh
 * Alineado con lean-canvas-effects.js · Respeta prefers-reduced-motion
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add(reduceMotion ? "pv-reduce-motion" : "pv-motion-ok");

  function revealAll() {
    document.querySelectorAll("[data-pv-reveal]").forEach(function (el) {
      el.classList.add("pv-revealed");
    });
  }

  if (reduceMotion) {
    revealAll();
    return;
  }

  /* Escalonado en paneles VPC si no llevan atributo manual */
  document.querySelectorAll(".vpc-panel").forEach(function (el, i) {
    if (!el.hasAttribute("data-pv-reveal")) {
      el.setAttribute("data-pv-reveal", "");
      el.setAttribute("data-pv-delay", String(0.08 + i * 0.07));
    }
  });

  document.querySelectorAll(".card[data-pv-reveal], .pv-synth-card[data-pv-reveal]").forEach(function (el, i) {
    el.setAttribute("data-pv-delay", String(0.06 + i * 0.08));
  });

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseFloat(el.getAttribute("data-pv-delay") || "0", 10);
        setTimeout(function () {
          el.classList.add("pv-revealed");
        }, delay * 1000);
        io.unobserve(el);
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );

  document.querySelectorAll("[data-pv-reveal]").forEach(function (el) {
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
      if (el.dataset.pvAnimDone === "1") return;
      var pctRaw = (el.style.getPropertyValue("--esf-pct") || "").trim();
      var widthRaw = (el.style.width || "").trim();
      var target = !isNaN(parseFloat(pctRaw)) ? parseFloat(pctRaw) : parseFloat(widthRaw);
      if (isNaN(target)) return;
      el.dataset.pvAnimDone = "1";
      el.style.width = "0%";
      el.style.transition = "width .9s cubic-bezier(.22,.61,.36,1)";
      observeOnce(el, function () {
        requestAnimationFrame(function () {
          el.style.width = target + "%";
        });
      });
    });

    document.querySelectorAll(".esf-donut, .esf-ring").forEach(function (el) {
      if (el.dataset.pvAnimDone === "1") return;
      var prop = el.classList.contains("esf-ring") ? "--esf-ring-p" : "--p";
      var target = parseFloat((el.style.getPropertyValue(prop) || "").trim());
      if (isNaN(target)) return;
      el.dataset.pvAnimDone = "1";
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
  }

  initVisualMicroAnimations();

  /* Parallax suave en mesh */
  var mesh = document.querySelector("[data-pv-mesh]");
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
    mesh.style.setProperty("--pv-mx", rx.toFixed(2) + "px");
    mesh.style.setProperty("--pv-my", ry.toFixed(2) + "px");
    if (Math.abs(mx * 11 - rx) > 0.04 || Math.abs(my * 9 - ry) > 0.04) {
      ticking = true;
      requestAnimationFrame(updateMesh);
    }
  }

  window.addEventListener("mousemove", onMove, { passive: true });
})();
