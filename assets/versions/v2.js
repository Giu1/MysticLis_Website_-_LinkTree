/* V2 — "Atelier": small touches that need markup (only loaded in V2). */
(function () {
  function ready(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    /* Italic accent on the end of each page title ("…, <em>feitos a mao.</em>") */
    document.querySelectorAll(".hero h1, .page-hero h1").forEach(function (h) {
      var t = h.textContent.trim();
      var cut = t.lastIndexOf(",");
      var words = t.split(" ");
      var head, tail;
      if (cut > 0) {
        head = t.slice(0, cut + 1);
        tail = t.slice(cut + 1).trim();
      } else {
        var n = words.length > 3 ? 2 : 1;
        head = words.slice(0, -n).join(" ");
        tail = words.slice(-n).join(" ");
      }
      h.textContent = head + " ";
      var em = document.createElement("em");
      em.textContent = tail;
      h.appendChild(em);
    });

    /* "Cera de soja · fragrancias veganas · …" as chips */
    document.querySelectorAll(".hero-note").forEach(function (p) {
      var parts = p.textContent.split("·").map(function (s) { return s.trim(); }).filter(Boolean);
      p.textContent = "";
      parts.forEach(function (s) {
        var c = document.createElement("span");
        c.className = "v2-chip";
        c.textContent = s;
        p.appendChild(c);
      });
    });

    /* Turning text ring around the logo */
    var card = document.querySelector(".profile-card");
    if (card) {
      var ring = document.createElement("div");
      ring.className = "v2-ring";
      ring.setAttribute("aria-hidden", "true");
      ring.innerHTML =
        '<svg viewBox="0 0 100 100"><defs><path id="v2-circle" d="M50,50 m-41,0 a41,41 0 1,1 82,0 a41,41 0 1,1 -82,0"/></defs>' +
        '<text><textPath href="#v2-circle" textLength="254" lengthAdjust="spacing">Feito a mao ✦ cera de soja ✦ Mystic Lis ✦ </textPath></text></svg>';
      card.appendChild(ring);
    }

    /* Marquee after the hero */
    var hero = document.querySelector(".hero");
    if (hero) {
      var words = ["Velas artesanais", "Ambientadores", "Workshops criativos", "Decoracao de eventos", "Lembrancas personalizadas", "Cabazes para oferecer"];
      var bar = document.createElement("div");
      bar.className = "v2-marquee";
      bar.setAttribute("aria-hidden", "true");
      var track = document.createElement("div");
      track.className = "v2-marquee-track";
      words.concat(words, words, words).forEach(function (w) {
        var s = document.createElement("span");
        s.textContent = w;
        track.appendChild(s);
      });
      bar.appendChild(track);
      hero.insertAdjacentElement("afterend", bar);
    }

    /* Header gets a line once the page moves */
    var header = document.querySelector(".site-header");
    function onScroll() {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    /* Fade and rise into view */
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var groups = [
      ".section-intro",
      ".linktree > h2, .linktree > .eyebrow",
      ".quick-link",
      ".photo-card",
      ".collection-strip",
      ".services > h2, .services > .eyebrow",
      ".service-card",
      ".seasonal > *",
      ".inquiry-form",
      ".contact > *",
      ".offer-card",
      ".steps-list li",
      ".page-cta",
      ".page-hero-image",
      ".profile-card"
    ];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    groups.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el, i) {
        el.classList.add("v2-reveal");
        el.style.setProperty("--d", Math.min(i % 4, 3) * 90 + "ms");
        io.observe(el);
      });
    });
  });
})();
