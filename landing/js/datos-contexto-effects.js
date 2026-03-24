/**
 * Escapify · Datos contexto — mesh parallax + scroll reveal
 * Alineado con lean-canvas-effects.js · Respeta prefers-reduced-motion
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add(reduceMotion ? "dc-reduce-motion" : "dc-motion-ok");

  function revealAll() {
    document.querySelectorAll("[data-dc-reveal]").forEach(function (el) {
      el.classList.add("dc-revealed");
    });
  }

  if (reduceMotion) {
    revealAll();
    return;
  }

  if (!("IntersectionObserver" in window)) {
    revealAll();
    return;
  }

  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var delay = parseFloat(el.getAttribute("data-dc-delay") || "0", 10);
        setTimeout(function () {
          el.classList.add("dc-revealed");
        }, delay * 1000);
        io.unobserve(el);
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );

  document.querySelectorAll("[data-dc-reveal]").forEach(function (el) {
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
      if (el.dataset.dcAnimDone === "1") return;
      var pctRaw = (el.style.getPropertyValue("--esf-pct") || "").trim();
      var widthRaw = (el.style.width || "").trim();
      var target = !isNaN(parseFloat(pctRaw)) ? parseFloat(pctRaw) : parseFloat(widthRaw);
      if (isNaN(target)) return;
      el.dataset.dcAnimDone = "1";
      el.style.width = "0%";
      el.style.transition = "width .9s cubic-bezier(.22,.61,.36,1)";
      observeOnce(el, function () {
        requestAnimationFrame(function () {
          el.style.width = target + "%";
        });
      });
    });

    document.querySelectorAll(".esf-donut, .esf-ring").forEach(function (el) {
      if (el.dataset.dcAnimDone === "1") return;
      var prop = el.classList.contains("esf-ring") ? "--esf-ring-p" : "--p";
      var target = parseFloat((el.style.getPropertyValue(prop) || "").trim());
      if (isNaN(target)) return;
      el.dataset.dcAnimDone = "1";
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

  var mesh = document.querySelector("[data-dc-mesh]");
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
    mesh.style.setProperty("--dc-mx", rx.toFixed(2) + "px");
    mesh.style.setProperty("--dc-my", ry.toFixed(2) + "px");
    if (Math.abs(mx * 11 - rx) > 0.04 || Math.abs(my * 9 - ry) > 0.04) {
      ticking = true;
      requestAnimationFrame(updateMesh);
    }
  }

  window.addEventListener("mousemove", onMove, { passive: true });
})();
