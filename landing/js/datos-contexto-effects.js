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
