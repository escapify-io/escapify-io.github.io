/**
 * Escapify · Early Adopter — revelado al scroll, parallax ligero
 * Misma línea que lean-canvas-effects.js · respeta prefers-reduced-motion
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add(reduceMotion ? "ea-reduce-motion" : "ea-motion-ok");

  function revealAll() {
    document.querySelectorAll("[data-ea-reveal]").forEach(function (el) {
      el.classList.add("ea-revealed");
    });
  }

  if (reduceMotion) {
    revealAll();
    return;
  }

  document.querySelectorAll(".dt-card").forEach(function (el, i) {
    el.setAttribute("data-ea-reveal", "");
    el.setAttribute("data-ea-delay", String(0.04 + i * 0.06));
  });

  document.querySelectorAll(".ea-persona").forEach(function (el, i) {
    el.setAttribute("data-ea-reveal", "");
    el.setAttribute("data-ea-delay", String(0.05 + i * 0.07));
  });

  document.querySelectorAll(".ea-panel").forEach(function (el, i) {
    el.setAttribute("data-ea-reveal", "");
    el.setAttribute("data-ea-delay", String(0.03 + i * 0.04));
  });

  document.querySelectorAll(".canvas-box").forEach(function (el, i) {
    el.setAttribute("data-ea-reveal", "");
    el.setAttribute("data-ea-delay", String(0.035 + i * 0.035));
  });

  document.querySelectorAll(".interview").forEach(function (el) {
    el.setAttribute("data-ea-reveal", "");
    el.setAttribute("data-ea-delay", "0.08");
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
        var delay = parseFloat(el.getAttribute("data-ea-delay") || "0", 10);
        setTimeout(function () {
          el.classList.add("ea-revealed");
        }, delay * 1000);
        io.unobserve(el);
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );

  document.querySelectorAll("[data-ea-reveal]").forEach(function (el) {
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
      if (el.dataset.eaAnimDone === "1") return;
      var pctRaw = (el.style.getPropertyValue("--esf-pct") || "").trim();
      var widthRaw = (el.style.width || "").trim();
      var target = !isNaN(parseFloat(pctRaw)) ? parseFloat(pctRaw) : parseFloat(widthRaw);
      if (isNaN(target)) return;
      el.dataset.eaAnimDone = "1";
      el.style.width = "0%";
      el.style.transition = "width .9s cubic-bezier(.22,.61,.36,1)";
      observeOnce(el, function () {
        requestAnimationFrame(function () {
          el.style.width = target + "%";
        });
      });
    });

    document.querySelectorAll(".esf-donut, .esf-ring").forEach(function (el) {
      if (el.dataset.eaAnimDone === "1") return;
      var prop = el.classList.contains("esf-ring") ? "--esf-ring-p" : "--p";
      var target = parseFloat((el.style.getPropertyValue(prop) || "").trim());
      if (isNaN(target)) return;
      el.dataset.eaAnimDone = "1";
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

  var mesh = document.querySelector("[data-ea-mesh]");
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
    mesh.style.setProperty("--ea-mx", rx.toFixed(2) + "px");
    mesh.style.setProperty("--ea-my", ry.toFixed(2) + "px");
    if (Math.abs(mx * 11 - rx) > 0.04 || Math.abs(my * 9 - ry) > 0.04) {
      ticking = true;
      requestAnimationFrame(updateMesh);
    }
  }

  window.addEventListener("mousemove", onMove, { passive: true });
})();
