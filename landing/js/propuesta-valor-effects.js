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
