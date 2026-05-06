/* ===== Portfolio – script.js ===== */
(() => {
  "use strict";

  /* ---------- Lucide icons ---------- */
  lucide.createIcons();

  /* ---------- Page loader ---------- */
  const loader = document.getElementById("page-loader");
  window.addEventListener("load", () => {
    setTimeout(() => loader.classList.add("hidden"), 600);
  });

  /* ---------- Theme toggle ---------- */
  const html = document.documentElement;
  const themeBtn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  if (saved) html.setAttribute("data-theme", saved);

  themeBtn.addEventListener("click", () => {
    const next = html.dataset.theme === "dark" ? "light" : "dark";
    html.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    lucide.createIcons();
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", navMenu.classList.contains("open"));
  });
  navMenu.querySelectorAll(".nav__link").forEach((l) =>
    l.addEventListener("click", () => navMenu.classList.remove("open"))
  );

  /* ---------- Header scroll state ---------- */
  const header = document.getElementById("main-header");
  const btt = document.getElementById("back-to-top");

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 50);
    btt.classList.toggle("visible", y > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  btt.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  /* ---------- Active nav link ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav__link");

  const setActiveLink = () => {
    const scrollY = window.scrollY + 200;
    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const h = sec.offsetHeight;
      const id = sec.id;
      if (scrollY >= top && scrollY < top + h) {
        navLinks.forEach((l) => l.classList.remove("active"));
        document
          .querySelector(`.nav__link[href="#${id}"]`)
          ?.classList.add("active");
      }
    });
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });

  /* ---------- Typewriter ---------- */
  const roles = [
    "CS Student & Developer",
    "MERN Stack Enthusiast",
    "Java & Python Developer",
    "Data Analytics Explorer",
  ];
  const tw = document.getElementById("typewriter-text");
  let ri = 0,
    ci = 0,
    deleting = false;

  const type = () => {
    const word = roles[ri];
    if (!deleting) {
      tw.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        return setTimeout(type, 1800);
      }
      setTimeout(type, 80);
    } else {
      tw.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        ri = (ri + 1) % roles.length;
      }
      setTimeout(type, 40);
    }
  };
  type();

  /* ---------- Scroll-reveal (IntersectionObserver) ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("revealed");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObs.observe(el));

  /* ---------- Skill-bar animation ---------- */
  const bars = document.querySelectorAll(".skill-card__progress");
  const barObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + "%";
          barObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  bars.forEach((b) => barObs.observe(b));

  /* ---------- Stat counter animation ---------- */
  const counters = document.querySelectorAll("[data-target]");
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el = e.target;
          const target = +el.dataset.target;
          let cur = 0;
          const step = Math.ceil(target / 40);
          const iv = setInterval(() => {
            cur += step;
            if (cur >= target) {
              cur = target;
              clearInterval(iv);
            }
            el.textContent = cur;
          }, 40);
          countObs.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((c) => countObs.observe(c));

  /* ---------- Particles (simple floating dots) ---------- */
  const canvas = document.querySelector(".hero__particles");
  if (canvas) {
    const cvs = document.createElement("canvas");
    cvs.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
    canvas.appendChild(cvs);
    const ctx = cvs.getContext("2d");
    let w, h, dots;

    const init = () => {
      w = cvs.width = canvas.offsetWidth;
      h = cvs.height = canvas.offsetHeight;
      dots = Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        o: Math.random() * 0.4 + 0.1,
      }));
    };
    init();
    window.addEventListener("resize", init);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const accent = getComputedStyle(html).getPropertyValue("--accent").trim();
      dots.forEach((d) => {
        d.x += d.dx;
        d.y += d.dy;
        if (d.x < 0 || d.x > w) d.dx *= -1;
        if (d.y < 0 || d.y > h) d.dy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = accent;
        ctx.globalAlpha = d.o;
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(draw);
    };
    draw();
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("contact-name").value.trim();
    const email = document.getElementById("contact-email").value.trim();
    const message = document.getElementById("contact-message").value.trim();

    if (!name || !email || !message) {
      formStatus.textContent = "❌ Please fill in all fields.";
      formStatus.className = "form-status error";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      formStatus.textContent = "❌ Please enter a valid email address.";
      formStatus.className = "form-status error";
      return;
    }

    const btn = document.getElementById("contact-submit");
    btn.classList.add("loading");
    formStatus.textContent = "";

    // Simulate send (replace with real endpoint)
    setTimeout(() => {
      btn.classList.remove("loading");
      formStatus.textContent = "✅ Message sent successfully!";
      formStatus.className = "form-status success";
      form.reset();
      setTimeout(() => (formStatus.textContent = ""), 4000);
    }, 1500);
  });
})();
