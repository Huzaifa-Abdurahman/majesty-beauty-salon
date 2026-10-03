/* =========================================================
   Majesty Beauty Bar & Cuts — site interactions
   ========================================================= */
(function () {
  "use strict";

  /* ---------------------------------------------------------
     EDIT HERE: reels and gallery photos
     --------------------------------------------------------- */
  var REELS = [
    { url: "https://www.facebook.com/reel/1691893929387629/", cap: "Fresh from the chair" },
    { url: "https://www.facebook.com/reel/2552722421868273/", cap: "Majesty moments" },
    { url: "https://www.facebook.com/reel/28742273338690719/", cap: "Fresh nails, fresh confidence" },
    { url: "https://www.facebook.com/reel/1058120303866144/", cap: "Barber style" },
    { url: "https://www.facebook.com/reel/27806132209069692/", cap: "Fresh. Flawless. Fabulous." },
    { url: "https://www.facebook.com/reel/1589997139503289/", cap: "Walk-ins welcome" }
  ];

  // Drop photos into the /images folder with these names (jpg). Missing ones show a gold placeholder.
  var GALLERY = [
    { src: "images/gallery-1.jpg", alt: "Red color before and after", icon: "i-braid" },
    { src: "images/gallery-2.jpg", alt: "Taper with curls and beard", icon: "i-razor" },
    { src: "images/gallery-3.jpg", alt: "Golden curls", icon: "i-hair" },
    { src: "images/gallery-4.jpg", alt: "Balayage before and after", icon: "i-hair" },
    { src: "images/gallery-5.jpg", alt: "Skin fade and beard", icon: "i-razor" },
    { src: "images/gallery-6.jpg", alt: "Blonde curls", icon: "i-hair" },
    { src: "images/gallery-7.jpg", alt: "Layered cut before and after", icon: "i-scissors" },
    { src: "images/gallery-8.jpg", alt: "Brunette color before and after", icon: "i-hair" },
    { src: "images/gallery-9.jpg", alt: "Curly cut before and after", icon: "i-hair" },
    { src: "images/gallery-10.jpg", alt: "Golden curls", icon: "i-hair" },
    { src: "images/gallery-11.jpg", alt: "Full glam makeup", icon: "i-makeup" }
  ];

  var SHOP_PHONE = "+19549070455";
  var WHATSAPP_NUMBER = "19549070455"; // country code + number, digits only
  var SHOP_EMAIL = "majestybbc@gmail.com";

  /* Pre-filled messages for WhatsApp / email buttons */
  var MESSAGES = {
    general: {
      text: "Hi Majesty Beauty Bar & Cuts! \uD83D\uDC51 I found you on your website and I'd like to book an appointment. What times do you have available this week?",
      subject: "Appointment inquiry | Majesty Beauty Bar & Cuts"
    },
    booth: {
      text: "Hi Majesty Beauty Bar & Cuts! I'm a beauty professional interested in renting a booth at your Pompano Beach salon. Could you share the details and pricing?",
      subject: "Booth rental inquiry | Majesty Beauty Bar & Cuts"
    }
  };
  function waLink(text) { return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text); }
  function mailLink(subject, body) { return "mailto:" + SHOP_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body); }
  function serviceText(svc) { return "Hi Majesty Beauty Bar & Cuts! \uD83D\uDC51 I'd like to book " + svc + ". What times do you have available?"; }
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Split hero lines into letters ---------- */
  $$("[data-split]").forEach(function (el) {
    var text = el.textContent, i = 0;
    el.setAttribute("aria-label", text);
    el.innerHTML = text.split(" ").map(function (word) {
      return '<span class="w" aria-hidden="true">' + word.split("").map(function (ch) {
        return '<span class="ch" style="--i:' + (i++) + '">' + ch + "</span>";
      }).join("") + "</span>";
    }).join(" ");
  });

  /* ---------- Loader ---------- */
  var loader = $("#loader");
  var started = false;
  function start() {
    if (started) return;
    started = true;
    loader.classList.add("is-done");
    document.body.classList.remove("is-loading");
    setTimeout(function () { document.body.classList.add("is-ready"); }, 350);
  }
  window.addEventListener("load", function () { setTimeout(start, reduceMotion ? 0 : 1500); });
  setTimeout(start, 3500); // never trap visitors behind the loader

  /* ---------- Nav ---------- */
  var nav = $("#nav"), toggle = $("#navToggle"), links = $("#navLinks");
  var progress = $("#progress");
  var lastY = 0;
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("is-scrolled", y > 40);
    nav.classList.toggle("is-hidden", y > lastY && y > 500 && !nav.classList.contains("is-open"));
    lastY = y;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? y / max : 0) + ")";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  function setMenu(open) {
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }
  toggle.addEventListener("click", function () { setMenu(toggle.getAttribute("aria-expanded") !== "true"); });
  links.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { setMenu(false); closeLightbox(); } });

  /* ---------- Current section highlight (nav + tab bar) ---------- */
  var sections = ["top", "services", "about", "reels", "gallery", "book", "contact"].map(function (id) { return document.getElementById(id); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.id;
        $$(".nav__links > a").forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("href") === "#" + id && id !== "top"); });
        $$(".tabbar a").forEach(function (a) { a.classList.toggle("is-current", a.getAttribute("data-tab") === id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { secObs.observe(s); });
  }

  /* ---------- Scroll reveal with stagger ---------- */
  var revealEls = $$("[data-reveal]");
  revealEls.forEach(function (el) {
    var sibs = $$(":scope > [data-reveal]", el.parentNode);
    var idx = sibs.indexOf(el);
    if (idx > 0) el.style.setProperty("--d", Math.min(idx, 6) * 0.09 + "s");
  });
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("is-in"); revObs.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { revObs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---------- Hero parallax ---------- */
  var heroImg = $(".hero__img");
  if (heroImg && !reduceMotion) {
    window.addEventListener("scroll", function () {
      var y = window.scrollY;
      if (y < window.innerHeight * 1.2) heroImg.style.transform = "translate3d(0," + y * 0.25 + "px,0)";
    }, { passive: true });
  }

  /* ---------- Gold sparkles in the hero ---------- */
  var canvas = $("#sparkles");
  if (canvas && canvas.getContext && !reduceMotion) {
    var ctx = canvas.getContext("2d"), parts = [], W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), running = true;
    function size() {
      W = canvas.offsetWidth; H = canvas.offsetHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(70, W / 18));
      parts = [];
      for (var i = 0; i < n; i++) parts.push(newPart(true));
    }
    function newPart(any) {
      return { x: Math.random() * W, y: any ? Math.random() * H : H + 10, r: Math.random() * 1.8 + 0.4, vy: Math.random() * 0.35 + 0.12, vx: (Math.random() - 0.5) * 0.2, a: Math.random() * Math.PI * 2, s: Math.random() * 0.02 + 0.008 };
    }
    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy; p.x += p.vx; p.a += p.s;
        if (p.y < -10) parts[i] = p = newPart(false);
        var tw = 0.35 + Math.sin(p.a) * 0.35 + 0.3;
        ctx.beginPath();
        ctx.fillStyle = "rgba(233, 207, 148," + tw.toFixed(2) + ")";
        ctx.shadowColor = "rgba(233, 207, 148, .9)"; ctx.shadowBlur = 8;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    size(); tick();
    window.addEventListener("resize", size);
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (en) {
        var vis = en[0].isIntersecting;
        if (vis && !running) { running = true; tick(); } else if (!vis) running = false;
      }).observe(canvas);
    }
  }

  /* ---------- Custom cursor + magnetic buttons (desktop) ---------- */
  if (finePointer && !reduceMotion) {
    var cursor = $("#cursor"), cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; cursor.classList.add("is-on"); });
    document.addEventListener("mouseleave", function () { cursor.classList.remove("is-on"); });
    (function loop() { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; cursor.style.transform = "translate(" + cx + "px," + cy + "px)"; requestAnimationFrame(loop); })();
    document.addEventListener("mouseover", function (e) { cursor.classList.toggle("is-hover", !!e.target.closest("a, button, label, .gal, [data-tilt]")); });

    $$(".magnetic").forEach(function (btn) {
      btn.addEventListener("mousemove", function (e) {
        var r = btn.getBoundingClientRect();
        btn.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.25 + "px," + (e.clientY - r.top - r.height / 2) * 0.35 + "px)";
      });
      btn.addEventListener("mouseleave", function () { btn.style.transform = ""; });
    });

    $$("[data-tilt]").forEach(function (card) {
      card.addEventListener("mousemove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = "perspective(900px) rotateY(" + px * 8 + "deg) rotateX(" + -py * 8 + "deg) translateY(-6px)";
      });
      card.addEventListener("mouseleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- Reels: build + autoplay when scrolled into view ---------- */
  var track = $("#reelTrack");
  function reelSrc(url, autoplay) {
    return "https://www.facebook.com/plugins/video.php?href=" + encodeURIComponent(url) +
      "&show_text=false&width=272&height=476&t=0" + (autoplay ? "&autoplay=true&mute=1" : "");
  }
  REELS.forEach(function (r, i) {
    var el = document.createElement("article");
    el.className = "reel";
    el.innerHTML =
      '<div class="reel__phone"><div class="reel__screen">' +
        '<div class="reel__poster"><div><svg class="ico"><use href="#i-play"/></svg><p>Scroll here to play</p></div></div>' +
      '</div><span class="reel__live">Playing</span></div>' +
      '<p class="reel__cap">' + r.cap + "</p>";
    el.dataset.url = r.url;
    el.dataset.index = i;
    el.addEventListener("click", function () { manual = el; pickReel(); });
    track.appendChild(el);
  });
  var reels = $$(".reel", track), active = null, manual = null, reelsSection = $("#reels");

  function play(el) {
    if (active === el) return;
    if (active) stop(active);
    active = el;
    var screen = $(".reel__screen", el);
    var f = document.createElement("iframe");
    f.src = reelSrc(el.dataset.url, true);
    f.title = "Majesty Beauty Bar & Cuts reel " + (+el.dataset.index + 1);
    f.setAttribute("scrolling", "no");
    f.setAttribute("allowfullscreen", "true");
    f.setAttribute("allow", "autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share");
    f.addEventListener("load", function () { el.classList.add("is-loaded"); });
    screen.appendChild(f);
    el.classList.add("is-playing");
  }
  function stop(el) {
    var f = $("iframe", el);
    if (f) f.remove();
    el.classList.remove("is-playing", "is-loaded");
    if (active === el) active = null;
  }

  function inView(el, ratio) {
    var r = el.getBoundingClientRect();
    var vh = window.innerHeight, vw = window.innerWidth;
    var visH = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    var visW = Math.min(r.right, vw) - Math.max(r.left, 0);
    return visH > r.height * ratio && visW > r.width * ratio;
  }
  function pickReel() {
    var secR = reelsSection.getBoundingClientRect();
    if (secR.bottom < 0 || secR.top > window.innerHeight) { if (active) stop(active); manual = null; return; }
    if (manual && inView(manual, 0.5)) { play(manual); return; }
    manual = null;
    var center = window.innerWidth / 2, best = null, bestD = Infinity;
    reels.forEach(function (el) {
      if (!inView(el, 0.6)) return;
      var r = el.getBoundingClientRect();
      var d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestD) { bestD = d; best = el; }
    });
    if (best) play(best); else if (active) stop(active);
  }
  var pickTimer;
  function schedulePick() { clearTimeout(pickTimer); pickTimer = setTimeout(pickReel, 180); }
  window.addEventListener("scroll", schedulePick, { passive: true });
  window.addEventListener("resize", schedulePick);
  track.addEventListener("scroll", schedulePick, { passive: true });

  $("#reelPrev").addEventListener("click", function () { track.scrollBy({ left: -310, behavior: "smooth" }); });
  $("#reelNext").addEventListener("click", function () { track.scrollBy({ left: 310, behavior: "smooth" }); });

  /* ---------- Gallery + lightbox ---------- */
  var grid = $("#galGrid"), lbImgs = [];
  GALLERY.forEach(function (g, i) {
    var b = document.createElement("button");
    b.className = "gal ph";
    b.setAttribute("data-reveal", "");
    b.style.setProperty("--d", (i % 4) * 0.08 + "s");
    b.setAttribute("aria-label", "Open photo: " + g.alt);
    b.innerHTML = '<svg class="ph__ico"><use href="#' + g.icon + '"/></svg>';
    var img = new Image();
    img.alt = g.alt; img.loading = "lazy"; img.src = g.src;
    img.onerror = function () { b.classList.add("is-missing"); img.remove(); b.disabled = true; b.style.cursor = "default"; };
    b.insertBefore(img, b.firstChild);
    b.addEventListener("click", function () { openLightbox(i); });
    grid.appendChild(b);
    if ("IntersectionObserver" in window && !reduceMotion && revObs) revObs.observe(b); else b.classList.add("is-in");
  });

  var lb = $("#lightbox"), lbImg = $("#lbImg"), lbIndex = 0;
  function available() { return GALLERY.map(function (g, i) { return i; }).filter(function (i) { return !grid.children[i].classList.contains("is-missing"); }); }
  function openLightbox(i) {
    if (grid.children[i].classList.contains("is-missing")) return;
    lbIndex = i; lbImg.src = GALLERY[i].src; lbImg.alt = GALLERY[i].alt;
    lb.hidden = false; document.body.style.overflow = "hidden"; $("#lbClose").focus();
  }
  function closeLightbox() { if (lb.hidden) return; lb.hidden = true; document.body.style.overflow = ""; }
  function stepLightbox(dir) {
    var av = available(); if (!av.length) return;
    var pos = av.indexOf(lbIndex); pos = (pos + dir + av.length) % av.length;
    openLightbox(av[pos]);
  }
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", function () { stepLightbox(-1); });
  $("#lbNext").addEventListener("click", function () { stepLightbox(1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "ArrowLeft") stepLightbox(-1);
    if (e.key === "ArrowRight") stepLightbox(1);
  });

  /* ---------- Booking stepper ---------- */
  var form = $("#bookForm");
  var steps = $$(".step", form), dots = $$(".stepper__steps li", form), current = 1;
  var dateInput = $("#fDate");
  var now = new Date();
  dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  function go(n) {
    current = n;
    steps.forEach(function (s) { s.classList.toggle("is-active", +s.dataset.step === n); });
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i + 1 === n); d.classList.toggle("is-done", i + 1 < n); });
    if (n === 3) renderSummary();
  }
  function val(name) { var el = form.querySelector('[name="' + name + '"]:checked') || form.querySelector('[name="' + name + '"]:not([type="radio"])'); return el ? el.value.trim() : ""; }
  function prettyDate(v) { if (!v) return ""; var p = v.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); }
  function renderSummary() {
    $("#summary").innerHTML = "<b>Service:</b> " + val("service") + "<br><b>When:</b> " + (prettyDate(val("date")) || "Any day") + ", " + (val("time") || "any time");
  }
  function check(n) {
    var err = $("#err" + n); err.textContent = "";
    if (n === 1 && !val("service")) { err.textContent = "Choose the service you'd like to book."; return false; }
    if (n === 3 && !val("name")) { err.textContent = "Add your name so the shop knows who's booking."; $("#fName").focus(); return false; }
    return true;
  }
  $$("[data-next]", form).forEach(function (b) { b.addEventListener("click", function () { if (check(current)) go(current + 1); }); });
  $$("[data-prev]", form).forEach(function (b) { b.addEventListener("click", function () { go(current - 1); }); });
  $$('[name="service"]', form).forEach(function (r) { r.addEventListener("change", function () { $("#err1").textContent = ""; }); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!check(3)) return;
    var via = (e.submitter && e.submitter.value) || "whatsapp";
    var lines = ["Hi Majesty Beauty Bar & Cuts! I'd like to book an appointment.", "", "Name: " + val("name"), "Service: " + val("service"), "Day: " + (prettyDate(val("date")) || "Any day"), "Time: " + (val("time") || "Any time")];
    if (val("note")) lines.push("Notes: " + val("note"));
    var body = lines.join("\n");
    var ua = navigator.userAgent;

    if (via === "whatsapp") {
      window.open(waLink(body), "_blank", "noopener");
      $("#doneMsg").textContent = "WhatsApp opened with your booking details. Hit send and the shop will confirm your time.";
    } else if (via === "email") {
      window.location.href = mailLink("Booking request: " + val("service") + " | " + val("name"), body);
      $("#doneMsg").textContent = "Your email is ready with your booking details. Hit send and the shop will reply to confirm.";
    } else if (/Android|iPhone|iPad|iPod/i.test(ua)) {
      var sep = /iPhone|iPad|iPod/i.test(ua) ? "&" : "?";
      window.location.href = "sms:" + SHOP_PHONE + sep + "body=" + encodeURIComponent(body);
      $("#doneMsg").textContent = "Your text is ready. Hit send and the shop will confirm your time.";
    } else {
      copyText(body).then(function () {
        $("#doneMsg").textContent = "Your request is copied. Text it to +1 954-907-0455 or call the shop to confirm your time.";
      }, function () {
        $("#doneMsg").textContent = "Text your request to +1 954-907-0455 or call the shop to confirm your time.";
      });
    }
    go(4);
  });
  $("#restart").addEventListener("click", function () { form.reset(); go(1); });

  // "Book" links on cards pre-select the service
  document.addEventListener("click", function (e) {
    var link = e.target.closest("[data-service]");
    if (!link) return;
    var wanted = link.getAttribute("data-service");
    var radio = $$('[name="service"]', form).filter(function (r) { return r.value === wanted; })[0];
    if (radio) { radio.checked = true; go(1); }
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? resolve() : reject(); } catch (err) { reject(err); }
      ta.remove();
    });
  }

  /* ---------- WhatsApp + email links with pre-filled messages ---------- */
  $$("[data-wa]").forEach(function (a) {
    var key = a.getAttribute("data-wa");
    var text = key.indexOf("service:") === 0 ? serviceText(key.slice(8)) : (MESSAGES[key] || MESSAGES.general).text;
    a.href = waLink(text);
  });
  $$("[data-mail]").forEach(function (a) {
    var m = MESSAGES[a.getAttribute("data-mail")] || MESSAGES.general;
    a.href = mailLink(m.subject, m.text + "\n\nName:\nPhone:\nPreferred day & time:");
  });

  /* ---------- Floating contact dock ---------- */
  var dock = $("#dock"), dockToggle = $("#dockToggle"), dockHint = $("#dockHint");
  function setDock(open) {
    dock.classList.toggle("is-open", open);
    dockToggle.setAttribute("aria-expanded", String(open));
    dock.classList.remove("show-hint");
  }
  dockToggle.addEventListener("click", function () { setDock(!dock.classList.contains("is-open")); });
  document.addEventListener("click", function (e) { if (!e.target.closest("#dock")) setDock(false); });
  setTimeout(function () { if (!dock.classList.contains("is-open")) dock.classList.add("show-hint"); }, 6000);
  setTimeout(function () { dock.classList.remove("show-hint"); }, 14000);
  dockHint.addEventListener("click", function () { setDock(true); });

  $("#year").textContent = new Date().getFullYear();
})();
