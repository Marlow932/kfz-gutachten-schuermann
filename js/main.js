/* ==========================================================================
   Stefan Schürmann – Kfz-Sachverständiger — v2 "Agency" Edition
   Powered by GSAP + ScrollTrigger + Lenis (loaded via CDN in index.html)
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || new URLSearchParams(location.search).has("nomotion");
  const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
  const hasGsap = typeof window.gsap !== "undefined";
  if (hasGsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  if (reduceMotion) document.documentElement.classList.add("force-no-motion");

  /* --------------------------------------------------------------------
     Theme toggle (light/dark)
     -------------------------------------------------------------------- */
  function getTheme() {
    return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
  }
  function applyThemeState(theme) {
    document.querySelectorAll(".theme-toggle").forEach((btn) => btn.setAttribute("aria-pressed", theme === "light"));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f5f6fa" : "#06070a");
  }
  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem("theme", theme); } catch (e) {}
    applyThemeState(theme);
  }
  applyThemeState(getTheme());
  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => setTheme(getTheme() === "light" ? "dark" : "light"));
  });

  /* --------------------------------------------------------------------
     Lenis smooth scroll
     -------------------------------------------------------------------- */
  let lenis = null;
  if (typeof window.Lenis !== "undefined" && !reduceMotion) {
    lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
    lenis.on("scroll", () => hasGsap && ScrollTrigger.update());
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  function scrollTo(target, opts) {
    const el = typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -20, ...opts });
    else el.scrollIntoView({ behavior: opts && opts.immediate ? "auto" : reduceMotion ? "auto" : "smooth" });
  }

  /* --------------------------------------------------------------------
     Preloader
     -------------------------------------------------------------------- */
  const preloader = document.querySelector(".preloader");
  let preloaderDismissed = false;
  function dismissPreloader() {
    if (preloaderDismissed) return;
    preloaderDismissed = true;
    if (!location.hash) window.scrollTo(0, 0);
    if (hasGsap && window.ScrollTrigger) ScrollTrigger.refresh();
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        setTimeout(() => {
          const y = target.getBoundingClientRect().top + window.scrollY - 20;
          window.scrollTo({ top: y, behavior: "auto" });
          if (lenis) lenis.scrollTo(y, { immediate: true });
        }, 60);
      }
    }

    const done = () => document.body.classList.remove("is-loading");
    if (preloader) {
      if (hasGsap && !reduceMotion) {
        gsap.to(preloader.querySelector(".preloader-bar i"), { width: "100%", duration: 0.6, ease: "power2.out" });
        gsap.to(preloader, {
          yPercent: -100, duration: 0.7, delay: 0.35, ease: "power3.inOut",
          onComplete: () => { preloader.style.display = "none"; done(); },
        });
      } else {
        preloader.style.display = "none";
        done();
      }
    } else {
      done();
    }
  }
  window.addEventListener("load", dismissPreloader);
  setTimeout(dismissPreloader, 3500);

  /* --------------------------------------------------------------------
     Custom cursor
     -------------------------------------------------------------------- */
  if (!isTouch && hasGsap) {
    document.body.classList.add("has-cursor");
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener("mousemove", (e) => {
      dotX(e.clientX); dotY(e.clientY);
      ringX(e.clientX); ringY(e.clientY);
    });
    document.querySelectorAll("a, button, .magnetic").forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-active"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-active"));
    });
  }

  /* --------------------------------------------------------------------
     Magnetic buttons
     -------------------------------------------------------------------- */
  if (!isTouch && hasGsap && !reduceMotion) {
    document.querySelectorAll(".magnetic-wrap").forEach((wrap) => {
      const btn = wrap.querySelector(".btn");
      if (!btn) return;
      const strength = 22;
      wrap.addEventListener("mousemove", (e) => {
        const r = wrap.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) / r.width;
        const y = (e.clientY - r.top - r.height / 2) / r.height;
        gsap.to(btn, { x: x * strength, y: y * strength, duration: 0.4, ease: "power3.out" });
      });
      wrap.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
      });
    });
  }

  /* --------------------------------------------------------------------
     Header scroll state + progress bar
     -------------------------------------------------------------------- */
  const header = document.querySelector(".site-header");
  const progressBar = document.querySelector(".progress-bar");
  function onScrollUI() {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 10);
    if (progressBar) {
      const h = document.documentElement;
      const pct = (window.scrollY / (h.scrollHeight - h.clientHeight)) * 100;
      progressBar.style.width = pct + "%";
    }
  }
  onScrollUI();
  window.addEventListener("scroll", onScrollUI, { passive: true });

  /* --------------------------------------------------------------------
     Fullscreen nav overlay
     -------------------------------------------------------------------- */
  const menuBtn = document.querySelector(".menu-btn");
  const navOverlay = document.querySelector(".nav-overlay");
  function toggleNav(open) {
    const isOpen = open !== undefined ? open : !navOverlay.classList.contains("is-open");
    navOverlay.classList.toggle("is-open", isOpen);
    menuBtn.classList.toggle("is-open", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
    if (lenis) isOpen ? lenis.stop() : lenis.start();
    if (isOpen && hasGsap && !reduceMotion) {
      gsap.fromTo(".nav-overlay-links a", { yPercent: 110 }, { yPercent: 0, duration: 0.7, stagger: 0.06, ease: "power4.out", delay: 0.15 });
    }
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", () => toggleNav());
    navOverlay.querySelectorAll("a[href^='#']").forEach((a) => a.addEventListener("click", (e) => {
      e.preventDefault();
      toggleNav(false);
      setTimeout(() => scrollTo(a.getAttribute("href")), 350);
    }));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") toggleNav(false); });
  }

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    if (a.closest(".nav-overlay")) return;
    a.addEventListener("click", (e) => {
      const target = a.getAttribute("href");
      if (target.length > 1 && document.querySelector(target)) {
        e.preventDefault();
        scrollTo(target);
      }
    });
  });

  /* --------------------------------------------------------------------
     GSAP scroll reveals
     -------------------------------------------------------------------- */
  if (hasGsap) {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      try {
        gsap.utils.toArray("[data-gsap]").forEach((el) => {
          const type = el.getAttribute("data-gsap");
          const from = type === "scale" ? { opacity: 0, scale: 0.9 }
            : type === "left" ? { opacity: 0, x: -60 }
            : type === "right" ? { opacity: 0, x: 60 }
            : { opacity: 0, y: 50 };
          gsap.from(el, {
            ...from,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%" },
          });
        });
      } catch (err) { console.error("[reveal] data-gsap setup failed", err); }

      try {
        gsap.utils.toArray("[data-gsap-group]").forEach((group) => {
          const items = group.querySelectorAll("[data-gsap-item]");
          gsap.from(items, {
            opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: group, start: "top 85%" },
          });
        });
      } catch (err) { console.error("[reveal] data-gsap-group setup failed", err); }
    });

    // Split headline reveal — kept independent of matchMedia/ScrollTrigger so a
    // failure elsewhere can never leave the hero headline permanently hidden.
    try {
      const splitSpans = document.querySelectorAll(".split-line > span");
      if (!reduceMotion && splitSpans.length) {
        gsap.set(splitSpans, { yPercent: 120 });
        gsap.to(splitSpans, {
          yPercent: 0, duration: 1, ease: "power4.out", stagger: 0.08, delay: 0.5,
        });
      }
    } catch (err) {
      console.error("[hero] split-text animation failed", err);
    }
    // Hard safety net: whatever happens above, the headline must be visible.
    setTimeout(() => {
      document.querySelectorAll(".split-line > span").forEach((s) => { s.style.transform = ""; });
    }, 2600);

    /* Hero orb parallax */
    if (!isTouch) {
      document.querySelectorAll(".hero-orb").forEach((orb, i) => {
        const depth = (i + 1) * 26;
        window.addEventListener("mousemove", (e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * depth;
          const y = (e.clientY / window.innerHeight - 0.5) * depth;
          gsap.to(orb, { x, y, duration: 0.8, ease: "power3.out" });
        });
      });
    }

    /* Bento card cursor-follow glow */
    document.querySelectorAll(".bento-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width) * 100 + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height) * 100 + "%");
      });
    });

    /* Animated stat counters */
    document.querySelectorAll("[data-counter]").forEach((el) => {
      const target = parseFloat(el.getAttribute("data-counter"));
      const decimals = el.getAttribute("data-decimals") ? parseInt(el.getAttribute("data-decimals"), 10) : 0;
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () => {
          gsap.to(obj, {
            val: target, duration: reduceMotion ? 0 : 1.6, ease: "power2.out",
            onUpdate: () => { el.textContent = obj.val.toFixed(decimals); },
          });
        },
      });
    });

    /* Pinned process scrollytelling */
    const processSection = document.querySelector(".process-pin");
    const processTrack = document.querySelector(".process-track");
    const processProgress = document.querySelector(".process-progress i");
    if (processSection && processTrack) {
      mm.add("(min-width: 901px) and (prefers-reduced-motion: no-preference)", () => {
        const getScrollAmount = () => processTrack.scrollWidth - window.innerWidth + 120;
        const tween = gsap.to(processTrack, {
          x: () => -getScrollAmount(),
          ease: "none",
          scrollTrigger: {
            trigger: processSection,
            start: "top top",
            end: () => "+=" + (getScrollAmount() + window.innerHeight * 0.4),
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => { if (processProgress) processProgress.style.width = self.progress * 100 + "%"; },
          },
        });
        return () => tween.scrollTrigger && tween.scrollTrigger.kill();
      });
    }

    /* About image reveal via clip-path */
    const aboutVisual = document.querySelector(".about-visual");
    if (aboutVisual) {
      gsap.fromTo(aboutVisual, { clipPath: "inset(8% 8% 8% 8% round 32px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 32px)", duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: aboutVisual, start: "top 82%" },
      });
    }

  } else {
    document.querySelectorAll("[data-gsap]").forEach((el) => (el.style.opacity = 1));
  }

  /* --------------------------------------------------------------------
     Einsatzgebiet pins — plain CSS transition + one observer on the group,
     not per-pin ScrollTrigger, so a single failure can't leave any of them
     permanently invisible.
     -------------------------------------------------------------------- */
  const areaMap = document.querySelector(".area-map");
  if (areaMap) {
    const pins = areaMap.querySelectorAll(".area-pin");
    pins.forEach((pin, i) => pin.style.setProperty("--pin-delay", `${i * 0.07}s`));
    if ("IntersectionObserver" in window) {
      const areaObserver = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              areaMap.classList.add("is-visible");
              obs.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      areaObserver.observe(areaMap);
    } else {
      areaMap.classList.add("is-visible");
    }
  }

  /* --------------------------------------------------------------------
     Crash showcase video — plays while in view, restarts each time the
     visitor scrolls back to it. Reduced-motion visitors get native
     controls and a static poster instead of an auto-playing loop.
     -------------------------------------------------------------------- */
  const crashVideo = document.getElementById("crash-video");
  if (crashVideo) {
    if (reduceMotion) {
      crashVideo.setAttribute("controls", "");
      crashVideo.removeAttribute("loop");
    } else if ("IntersectionObserver" in window) {
      const crashObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              crashVideo.currentTime = 0;
              crashVideo.play().catch(() => {});
            } else {
              crashVideo.pause();
            }
          });
        },
        { threshold: 0.35 }
      );
      crashObserver.observe(crashVideo);
    } else {
      crashVideo.setAttribute("controls", "");
    }
  }

  /* --------------------------------------------------------------------
     Trust marquee — duplicate content for seamless loop
     -------------------------------------------------------------------- */
  document.querySelectorAll(".marquee-track").forEach((track) => {
    track.innerHTML += track.innerHTML;
  });

  /* --------------------------------------------------------------------
     Reviews drag-scroll (native horizontal scroll with momentum feel)
     -------------------------------------------------------------------- */
  const reviewViewport = document.querySelector(".review-viewport");
  if (reviewViewport) {
    let isDown = false, startX, scrollLeft;
    reviewViewport.addEventListener("pointerdown", (e) => {
      isDown = true; reviewViewport.setPointerCapture(e.pointerId);
      startX = e.clientX; scrollLeft = reviewViewport.scrollLeft;
    });
    reviewViewport.addEventListener("pointermove", (e) => {
      if (!isDown) return;
      reviewViewport.scrollLeft = scrollLeft - (e.clientX - startX);
    });
    ["pointerup", "pointerleave"].forEach((ev) => reviewViewport.addEventListener(ev, () => (isDown = false)));
  }

  /* --------------------------------------------------------------------
     Zielgruppen tabs with sliding indicator
     -------------------------------------------------------------------- */
  const tabBtns = document.querySelectorAll(".tabs-nav button");
  const tabPanels = document.querySelectorAll(".tab-panel");
  const indicator = document.querySelector(".tabs-indicator");
  function moveIndicator(btn) {
    if (!indicator) return;
    indicator.style.width = btn.offsetWidth + "px";
    indicator.style.transform = `translateX(${btn.offsetLeft}px)`;
  }
  function activateTab(id, btn) {
    tabBtns.forEach((b) => b.classList.toggle("is-active", b === btn));
    tabPanels.forEach((p) => p.classList.toggle("is-active", p.getAttribute("data-panel") === id));
    moveIndicator(btn);
  }
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => activateTab(btn.getAttribute("data-tab"), btn));
  });
  if (tabBtns.length) {
    window.addEventListener("load", () => moveIndicator(document.querySelector(".tabs-nav button.is-active")));
    window.addEventListener("resize", () => moveIndicator(document.querySelector(".tabs-nav button.is-active")));
  }

  /* --------------------------------------------------------------------
     FAQ accordion
     -------------------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item").forEach((other) => {
        other.classList.remove("is-open");
        other.querySelector(".faq-a").style.height = "0px";
        other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
      });
      if (!isOpen) {
        item.classList.add("is-open");
        q.setAttribute("aria-expanded", "true");
        a.style.height = a.querySelector(".faq-a-inner").offsetHeight + "px";
      }
    });
  });
  const firstFaq = document.querySelector(".faq-item");
  if (firstFaq) {
    firstFaq.classList.add("is-open");
    firstFaq.querySelector(".faq-a").style.height = firstFaq.querySelector(".faq-a-inner").offsetHeight + "px";
  }

  /* --------------------------------------------------------------------
     Floating label form inputs
     -------------------------------------------------------------------- */
  document.querySelectorAll(".field select").forEach((sel) => {
    sel.closest(".field").classList.add("is-filled");
  });

  /* --------------------------------------------------------------------
     Contact form
     -------------------------------------------------------------------- */
  const form = document.querySelector("#contact-form");
  if (form) {
    const isNetlify = document.documentElement.getAttribute("data-hosting") === "netlify";
    form.addEventListener("submit", (e) => {
      const honeypot = form.querySelector('input[name="firma-website"]');
      if (honeypot && honeypot.value) { e.preventDefault(); return; }
      if (isNetlify) return;
      e.preventDefault();
      const data = new FormData(form);
      const body = [
        `Name: ${data.get("name") || ""}`,
        `Telefon: ${data.get("telefon") || ""}`,
        `E-Mail: ${data.get("email") || ""}`,
        `Anliegen: ${data.get("anliegen") || ""}`,
        "",
        data.get("nachricht") || "",
      ].join("\n");
      const mailto = `mailto:gutachten.wuppertal@yahoo.de?subject=${encodeURIComponent("Anfrage über Website: " + (data.get("anliegen") || "Kfz-Gutachten"))}&body=${encodeURIComponent(body)}`;
      const success = form.parentElement.querySelector(".form-success");
      if (success) success.classList.add("is-visible");
      window.location.href = mailto;
      form.reset();
    });
  }

  /* --------------------------------------------------------------------
     Back to top / footer year
     -------------------------------------------------------------------- */
  const yearEl = document.querySelector("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.body.classList.add("is-loading");
})();
