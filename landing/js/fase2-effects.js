/**
 * Escapify · Fase 2 — micro-interacciones y entrada suave
 * Respeta prefers-reduced-motion
 */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) {
    root.classList.add("f2-reduce-motion");
  } else {
    root.classList.add("f2-motion-ok");
  }

  /* ─── Entrada escalonada ─── */
  function revealAllStatic() {
    document.querySelectorAll("[data-f2-reveal]").forEach(function (el) {
      el.classList.add("f2-revealed");
    });
  }

  if (reduceMotion) {
    revealAllStatic();
  } else if ("IntersectionObserver" in window) {
    var revealEls = document.querySelectorAll("[data-f2-reveal]");
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target;
          var delay = parseFloat(el.getAttribute("data-f2-delay") || "0", 10);
          setTimeout(function () {
            el.classList.add("f2-revealed");
          }, delay * 1000);
          io.unobserve(el);
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealAllStatic();
  }

  /* ─── Contadores KPI (un observer por bloque) ─── */
  function runCountUp(el, target, duration) {
    var start = null;
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = String(Math.round(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  document.querySelectorAll("[data-f2-count-wrap]").forEach(function (wrap) {
    var nums = wrap.querySelectorAll("[data-f2-count]");

    if (reduceMotion) {
      nums.forEach(function (el) {
        var t = parseInt(el.getAttribute("data-f2-count"), 10);
        if (!isNaN(t)) el.textContent = String(t);
      });
      return;
    }

    function start() {
      nums.forEach(function (el) {
        var target = parseInt(el.getAttribute("data-f2-count"), 10);
        if (isNaN(target)) return;
        el.textContent = "0";
        runCountUp(el, target, 850);
      });
    }

    if ("IntersectionObserver" in window) {
      var once = false;
      var cio = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (e) {
            if (!e.isIntersecting || once) return;
            once = true;
            start();
            cio.unobserve(wrap);
          });
        },
        { threshold: 0.25 }
      );
      cio.observe(wrap);
    } else {
      start();
    }
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
      if (el.dataset.f2AnimDone === "1") return;
      var pctRaw = (el.style.getPropertyValue("--esf-pct") || "").trim();
      var widthRaw = (el.style.width || "").trim();
      var target = !isNaN(parseFloat(pctRaw)) ? parseFloat(pctRaw) : parseFloat(widthRaw);
      if (isNaN(target)) return;
      el.dataset.f2AnimDone = "1";
      el.style.width = "0%";
      el.style.transition = "width .9s cubic-bezier(.22,.61,.36,1)";
      observeOnce(el, function () {
        requestAnimationFrame(function () {
          el.style.width = target + "%";
        });
      });
    });

    document.querySelectorAll(".esf-donut, .esf-ring").forEach(function (el) {
      if (el.dataset.f2AnimDone === "1") return;
      var prop = el.classList.contains("esf-ring") ? "--esf-ring-p" : "--p";
      var target = parseFloat((el.style.getPropertyValue(prop) || "").trim());
      if (isNaN(target)) return;
      el.dataset.f2AnimDone = "1";
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

  if (!reduceMotion) {
    initVisualMicroAnimations();
  }

  if (reduceMotion) return;

  /* ─── Parallax suave en el mesh del hero ─── */
  var mesh = document.querySelector("[data-f2-mesh]");
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
    rx += (mx * 12 - rx) * 0.08;
    ry += (my * 10 - ry) * 0.08;
    mesh.style.setProperty("--f2-mx", rx.toFixed(2) + "px");
    mesh.style.setProperty("--f2-my", ry.toFixed(2) + "px");
    if (Math.abs(mx * 12 - rx) > 0.05 || Math.abs(my * 10 - ry) > 0.05) {
      ticking = true;
      requestAnimationFrame(updateMesh);
    }
  }

  window.addEventListener("mousemove", onMove, { passive: true });
})();
