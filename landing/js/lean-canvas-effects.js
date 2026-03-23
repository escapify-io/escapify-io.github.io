/**
 * Escapify · Lean Canvas — revelado al scroll, parallax ligero
 * Respeta prefers-reduced-motion
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add(reduceMotion ? "lc-reduce-motion" : "lc-motion-ok");

  function revealAll() {
    document.querySelectorAll("[data-lc-reveal]").forEach(function (el) {
      el.classList.add("lc-revealed");
    });
  }

  if (reduceMotion) {
    revealAll();
    return;
  }

  /* Bloques del lienzo: escalonado */
  document.querySelectorAll(".canvas .grid5 .box").forEach(function (el, i) {
    el.setAttribute("data-lc-reveal", "");
    el.setAttribute("data-lc-delay", String(0.04 + i * 0.038));
  });

  /* Business Model Canvas */
  document.querySelectorAll(".bmc-section").forEach(function (el, i) {
    el.setAttribute("data-lc-reveal", "");
    el.setAttribute("data-lc-delay", String(0.03 + i * 0.045));
  });

  document.querySelectorAll(".vision-box, .bmc-summary").forEach(function (el, i) {
    el.setAttribute("data-lc-reveal", "");
    el.setAttribute("data-lc-delay", String(0.08 + i * 0.06));
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
        var delay = parseFloat(el.getAttribute("data-lc-delay") || "0", 10);
        setTimeout(function () {
          el.classList.add("lc-revealed");
        }, delay * 1000);
        io.unobserve(el);
      });
    },
    { root: null, rootMargin: "0px 0px -6% 0px", threshold: 0.08 }
  );

  document.querySelectorAll("[data-lc-reveal]").forEach(function (el) {
    io.observe(el);
  });

  /* Parallax suave en mesh */
  var mesh = document.querySelector("[data-lc-mesh]");
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
    mesh.style.setProperty("--lc-mx", rx.toFixed(2) + "px");
    mesh.style.setProperty("--lc-my", ry.toFixed(2) + "px");
    if (Math.abs(mx * 11 - rx) > 0.04 || Math.abs(my * 9 - ry) > 0.04) {
      ticking = true;
      requestAnimationFrame(updateMesh);
    }
  }

  window.addEventListener("mousemove", onMove, { passive: true });
})();
