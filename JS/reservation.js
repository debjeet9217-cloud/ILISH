/* ==========================================================================
   ILISH · Taste of Bengal - Editorial Reservation System Logic
   5-Step Booking Flow, Story Progression & Signature Reservation Slip
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const WA = "919876543210"; // Restaurant WhatsApp number
  const $ = id => document.getElementById(id);

  // Core Booking State
  const S = {
    guests: 2,
    date: null,
    time: null,
    svc: "dinner",
    occ: "",
    pre: "",
    step: 1
  };

  const SL = {
    lunch: ["12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00"],
    dinner: ["18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00"]
  };
  const ALL = [...SL.lunch, ...SL.dinner], DAY = 864e5;
  const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const pad = n => String(n).padStart(2, "0");
  const ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const parse = s => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
  const t12 = t => { const [h, m] = t.split(":").map(Number); return `${h % 12 || 12}:${pad(m)} ${h < 12 ? "AM" : "PM"}`; };
  const dLabel = s => parse(s).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const dLabelShort = s => parse(s).toLocaleDateString("en-IN", { day: "numeric", month: "short" }).toUpperCase();
  const word = s => s === ymd(new Date()) ? "Today" : s === ymd(new Date(Date.now() + DAY)) ? "Tomorrow" : dLabel(s);
  const hash = s => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

  /* Availability logic */
  const full = (d, t) => hash(d + t) % 4 === 0 || (S.guests > 6 && hash(t + d) % 3 === 0);
  const past = (d, t) => {
    if (d !== ymd(new Date())) return false;
    const [h, m] = t.split(":").map(Number), n = new Date();
    return h * 60 + m <= n.getHours() * 60 + n.getMinutes() + 30;
  };
  const off = (d, t) => full(d, t) || past(d, t);
  const isMon = s => parse(s).getDay() === 1;

  /* Table Specifications */
  const TABLE_SPECS = {
    1: { title: "Solo Heritage Dining Table", sub: "Quiet corner table with dedicated personal service" },
    2: { title: "Intimate Dining Table", sub: "Ideal for couples with soft ambient lighting and river view" },
    3: { title: "Friends & Family Table", sub: "Spacious arrangement for 3 guests in main dining room" },
    4: { title: "Standard Heritage Table", sub: "Comfortable 4-seater surrounded by authentic Bengali artwork" },
    5: { title: "Family Banquet Table", sub: "Generous table space in our central heritage hall" },
    6: { title: "Large Family Platter Table", sub: "Ample room for signature seafood platters & side dishes" },
    7: { title: "Grand Celebration Table", sub: "Prime positioning with dedicated waitstaff" },
    8: { title: "Heritage Feast Table", sub: "Joined heritage tables for large family gatherings" }
  };

  /* Story Chapters mapping */
  const CAPTIONS = {
    river: { badge: "THE RIVER", title: "Hilsa begins here." },
    catch: { badge: "THE FISH", title: "The heart of the table." },
    table: { badge: "THE TABLE", title: "Where the meal becomes an experience." }
  };

  function updateStoryScene() {
    let key = "river";
    if (S.step === 2) key = "catch";
    else if (S.step >= 3) key = "table";

    document.querySelectorAll(".ph").forEach(p => p.classList.toggle("on", p.dataset.s === key));
    document.querySelectorAll(".chapter-item").forEach(c => c.classList.toggle("on", c.dataset.chap === key));
    
    if ($("capA")) $("capA").textContent = CAPTIONS[key].badge;
    if ($("capB")) $("capB").textContent = CAPTIONS[key].title;
  }

  /* Guest stepper & selector logic */
  document.querySelectorAll(".seat-chip").forEach(btn => {
    const n = +btn.dataset.n;
    btn.onclick = () => setGuests(n);
  });

  if ($("btnMinus")) $("btnMinus").onclick = () => setGuests(S.guests - 1);
  if ($("btnPlus")) $("btnPlus").onclick = () => setGuests(S.guests + 1);

  function setGuests(n) {
    S.guests = Math.max(1, Math.min(8, n));
    if (S.date && S.time && off(S.date, S.time)) S.time = null;
    if (S.date) drawSlots();
    render();
  }

  /* Date buttons initialization */
  const daysContainer = $("days");
  if (daysContainer) {
    daysContainer.innerHTML = "";
    for (let i = 0; i < 6; i++) {
      const d = new Date(Date.now() + i * DAY), s = ymd(d), b = document.createElement("button");
      b.type = "button";
      b.className = "opt day";
      b.dataset.d = s;
      const closed = isMon(s);
      b.innerHTML = `<span>${i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-IN", { weekday: "short" })}</span><small>${closed ? "Closed" : d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</small>${closed ? "<em>Closed</em>" : ""}`;
      if (closed) {
        b.setAttribute("aria-disabled", "true");
        b.onclick = () => { if ($("monday")) $("monday").hidden = false; };
      } else {
        b.onclick = () => setDate(s);
      }
      daysContainer.appendChild(b);
    }
  }

  if ($("otherBtn")) $("otherBtn").onclick = () => {
    if ($("pick")) {
      $("pick").hidden = false;
      $("pick").min = ymd(new Date());
      try { $("pick").showPicker(); } catch (e) { $("pick").focus(); }
    }
  };

  if ($("pick")) $("pick").onchange = e => {
    const s = e.target.value;
    if (!s) return;
    if (isMon(s)) {
      if ($("monday")) $("monday").hidden = false;
      return;
    }
    setDate(s);
  };

  function setDate(s) {
    if ($("monday")) $("monday").hidden = true;
    if ($("full")) $("full").hidden = true;
    S.date = s;
    S.time = null;
    if ($("days")) [...$("days").children].forEach(b => b.setAttribute("aria-pressed", b.dataset.d === s));
    const free = k => SL[k].some(t => !off(s, t));
    S.svc = free("dinner") ? "dinner" : free("lunch") ? "lunch" : "dinner";
    drawSlots();
    render();
  }

  /* Time slot switcher */
  document.querySelectorAll("#seg .opt-tab").forEach(b => b.onclick = () => {
    S.svc = b.dataset.s;
    if ($("full")) $("full").hidden = true;
    drawSlots();
  });

  function drawSlots() {
    if ($("seg")) [...$("seg").children].forEach(b => b.setAttribute("aria-pressed", b.dataset.s === S.svc));
    const box = $("slots");
    if (!box) return;
    box.innerHTML = "";
    if (!S.date) return;
    SL[S.svc].forEach(t => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt";
      b.textContent = t12(t);
      b.setAttribute("aria-pressed", S.time === t);
      const o = off(S.date, t);
      if (o) b.setAttribute("aria-disabled", "true");
      b.onclick = () => o ? showFull(t) : pickTime(t);
      box.appendChild(b);
    });
  }

  function pickTime(t) {
    S.time = t;
    if ($("full")) $("full").hidden = true;
    drawSlots();
    render();
  }

  function showFull(t) {
    const box = $("full");
    if (!box) return;
    box.hidden = false;
    box.innerHTML = (past(S.date, t) ? "That time slot has passed. " : `Fully booked at ${t12(t)}. `) +
      `Please select another available time slot.`;
  }

  /* Pre-order Dish Selection */
  document.querySelectorAll("#pre .dish-card").forEach(b => b.onclick = () => {
    const isSelected = b.getAttribute("aria-pressed") === "true";
    document.querySelectorAll("#pre .dish-card").forEach(x => x.setAttribute("aria-pressed", "false"));
    if (!isSelected) {
      b.setAttribute("aria-pressed", "true");
      S.pre = b.dataset.v;
      if ($("customDishInput")) $("customDishInput").value = "";
    } else {
      S.pre = "";
    }
    render();
  });

  if ($("customDishInput")) {
    $("customDishInput").oninput = e => {
      S.pre = e.target.value.trim();
      document.querySelectorAll("#pre .dish-card").forEach(x => x.setAttribute("aria-pressed", "false"));
      render();
    };
  }

  // Full Menu Modal handlers
  let selectedModalDishes = [];
  if ($("openMenuModalBtn")) {
    $("openMenuModalBtn").onclick = () => { if ($("menuModal")) $("menuModal").hidden = false; };
  }
  if ($("closeMenuModalBtn")) {
    $("closeMenuModalBtn").onclick = () => { if ($("menuModal")) $("menuModal").hidden = true; };
  }
  document.querySelectorAll(".btn-select-dish").forEach(btn => {
    btn.onclick = () => {
      const dish = btn.dataset.dish;
      const idx = selectedModalDishes.indexOf(dish);
      if (idx > -1) {
        selectedModalDishes.splice(idx, 1);
        btn.textContent = "+ Select Dish";
        btn.classList.remove("selected");
      } else {
        selectedModalDishes.push(dish);
        btn.textContent = "✓ Selected";
        btn.classList.add("selected");
      }
      if ($("modalSelectedList")) {
        $("modalSelectedList").textContent = selectedModalDishes.length ? selectedModalDishes.join(", ") : "None";
      }
    };
  });
  if ($("confirmModalSelectionBtn")) {
    $("confirmModalSelectionBtn").onclick = () => {
      if (selectedModalDishes.length) {
        S.pre = selectedModalDishes.join(", ");
        if ($("customDishInput")) $("customDishInput").value = S.pre;
        document.querySelectorAll("#pre .dish-card").forEach(x => x.setAttribute("aria-pressed", "false"));
      }
      if ($("menuModal")) $("menuModal").hidden = true;
      render();
    };
  }

  /* Occasion handler */
  if ($("occ")) $("occ").querySelectorAll(".occ-chip").forEach(b => b.onclick = () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    $("occ").querySelectorAll(".occ-chip").forEach(x => x.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", on ? "true" : "false");
    S.occ = on ? b.textContent : "";
  });

  if ($("phone")) $("phone").oninput = e => e.target.value = e.target.value.replace(/\D/g, "");
  if ($("name")) $("name").oninput = render;

  /* Step Navigation Logic */
  const STEP_NAMES = [
    "When are you joining us?",
    "How many at the table?",
    "Tell us where to reach you",
    "Anything we should know?",
    "Review your reservation"
  ];

  function render() {
    // Show active pane
    [1, 2, 3, 4, 5].forEach(i => {
      if ($("p" + i)) $("p" + i).hidden = i !== S.step;
    });

    // Update progress bar
    if ($("stepIndicator")) {
      const badge = $("stepIndicator").querySelector(".step-badge");
      const text = $("stepIndicator").querySelector(".step-name");
      if (badge) badge.textContent = `STEP 0${S.step} OF 05`;
      if (text) text.textContent = STEP_NAMES[S.step - 1];
    }
    if ($("bars")) {
      [...$("bars").children].forEach((bar, idx) => {
        bar.className = idx < S.step ? "on" : "";
      });
    }

    // Story photo update
    updateStoryScene();

    // Guest stepper state & specification box
    const spec = TABLE_SPECS[S.guests] || TABLE_SPECS[2];
    if ($("cntBn")) $("cntBn").textContent = `${S.guests} Guest${S.guests > 1 ? "s" : ""}`;
    if ($("stepVal")) $("stepVal").textContent = S.guests;
    if ($("btnMinus")) $("btnMinus").disabled = S.guests <= 1;
    if ($("btnPlus")) $("btnPlus").disabled = S.guests >= 8;

    document.querySelectorAll(".seat-chip").forEach(chip => {
      const on = +chip.dataset.n === S.guests;
      chip.classList.toggle("on", on);
      chip.setAttribute("aria-checked", on ? "true" : "false");
    });

    if ($("tableTypeTitle")) $("tableTypeTitle").textContent = spec.title;
    if ($("tableTypeSub")) $("tableTypeSub").textContent = spec.sub;

    // Signature Reservation Slip Sync
    if ($("sG")) $("sG").textContent = pad(S.guests);
    if ($("sD")) {
      $("sD").textContent = S.date ? dLabelShort(S.date) : "Select Date";
    }
    if ($("sT")) {
      $("sT").textContent = S.time ? t12(S.time) : "Select Time";
    }
    if ($("sTableType")) $("sTableType").textContent = spec.title;
    if ($("sI")) $("sI").textContent = S.pre || "None";

    // Bottom Action Bar text & button controls
    if ($("actions")) $("actions").hidden = S.step === 5;
    if ($("back")) $("back").hidden = S.step === 1;
    
    let summaryText = "";
    if (S.step === 1) {
      summaryText = S.date && S.time ? `<b>${word(S.date)} · ${t12(S.time)}</b>` : "Select Date & Time to continue";
    } else if (S.step === 2) {
      summaryText = `<b>${S.guests} Guest${S.guests > 1 ? "s" : ""} · ${spec.title}</b>`;
    } else if (S.step === 3) {
      const n = $("name") ? $("name").value.trim() : "";
      summaryText = n ? `<b>Guest: ${n}</b>` : "Enter contact information";
    } else if (S.step === 4) {
      summaryText = S.pre ? `<b>Pre-order: ${S.pre}</b>` : "No pre-order selected";
    } else if (S.step === 5) {
      summaryText = "<b>Ready to request table</b>";
    }
    if ($("line")) $("line").innerHTML = summaryText;

    if ($("next")) {
      if (S.step === 5) {
        $("next").hidden = true;
      } else {
        $("next").hidden = false;
        $("next").textContent = S.step === 4 ? "REVIEW RESERVATION →" : "CONTINUE →";
      }
    }
  }

  function go(n) {
    S.step = Math.max(1, Math.min(5, n));
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if ($("back")) $("back").onclick = () => go(S.step - 1);

  if ($("next")) $("next").onclick = () => {
    // Validation for Step 1
    if (S.step === 1) {
      if (!S.date || !S.time) {
        alert("Please select both a date and time slot to continue.");
        return;
      }
      return go(2);
    }
    // Step 2 (Guests)
    if (S.step === 2) return go(3);
    
    // Step 3 (Contact Validation)
    if (S.step === 3) {
      const name = $("name") ? $("name").value.trim() : "";
      const ph = $("phone") ? $("phone").value.trim() : "";
      const okN = name.length > 1;
      const okP = /^[6-9]\d{9}$/.test(ph);

      if ($("fName")) $("fName").classList.toggle("bad", !okN);
      if ($("fPhone")) $("fPhone").classList.toggle("bad", !okP);

      if (!okN) return $("name").focus();
      if (!okP) return $("phone").focus();

      return go(4);
    }

    // Step 4 -> Step 5 (Review)
    if (S.step === 4) {
      buildReviewTicket();
      return go(5);
    }
  };

  function buildReviewTicket() {
    const name = $("name") ? $("name").value.trim() : "";
    const ph = $("phone") ? $("phone").value.trim() : "";
    const email = $("email") ? $("email").value.trim() : "";
    const req = $("req") ? $("req").value.trim() : "";
    const spec = TABLE_SPECS[S.guests] || TABLE_SPECS[2];

    const rows = [
      ["GUEST NAME", name],
      ["PHONE", "+91 " + ph],
      ["PARTY SIZE", `${S.guests} Guest${S.guests > 1 ? "s" : ""}`],
      ["DATE", dLabel(S.date)],
      ["TIME", t12(S.time)],
      ["SEATING", spec.title],
      ["PRE-ORDER", S.pre || "None"]
    ];

    if (email) rows.push(["EMAIL", email]);
    if (S.occ) rows.push(["OCCASION", S.occ]);
    if (req) rows.push(["NOTES", req]);

    if ($("ticket")) {
      $("ticket").innerHTML = `
        <div class="slip-header">
          <span class="slip-brand-name">ILISH</span>
          <span class="slip-tag">RESERVATION REQUEST</span>
        </div>
        <div class="slip-divider"></div>
        <div class="slip-body">
          <div class="slip-row">
            <span class="slip-label">CONFIRMATION FOR</span>
            <div class="slip-hero-val">${name.split(" ")[0]}</div>
          </div>
          <div class="slip-divider dotted"></div>
          <dl style="display:grid; gap:8px;">
            ${rows.map(([k, v]) => `
              <div style="display:flex; justify-between; align-items:baseline; border-bottom: 1px dashed var(--line); padding-bottom:4px;">
                <dt style="font-size:11px; font-weight:600; color:var(--mute); font-family:var(--body); width:110px;">${k}</dt>
                <dd style="font-size:13px; font-weight:600; color:var(--maroon); flex:1; text-align:right;">${v}</dd>
              </div>
            `).join("")}
          </dl>
        </div>
        <div class="slip-perforation"></div>
      `;
    }

    // Dynamic Ref Code
    const ref = "IL-" + Math.floor(1000 + Math.random() * 9000);
    if ($("refCode")) $("refCode").textContent = `Reference ${ref}`;

    // Prepare WhatsApp Link
    const msg = `Hello Ilish! I'd like to request a table reservation.\nReference: ${ref}\nName: ${name}\nPhone: +91 ${ph}\nParty: ${S.guests} Guests\nDate: ${dLabel(S.date)}\nTime: ${t12(S.time)}\nSeating: ${spec.title}\nPre-order: ${S.pre || "None"}` +
      (S.occ ? `\nOccasion: ${S.occ}` : "") + (req ? `\nSpecial Requests: ${req}` : "");

    if ($("waSend")) {
      $("waSend").onclick = () => {
        // Save to active booking store
        if (window.TasteBengalBooking && window.TasteBengalBooking.saveBooking) {
          window.TasteBengalBooking.saveBooking({
            ref: ref,
            name: name,
            phone: ph,
            email: email,
            guests: `${S.guests} Guest${S.guests > 1 ? "s" : ""}`,
            date: S.date,
            dayName: parse(S.date).toLocaleDateString("en-IN", { weekday: "short" }),
            time: t12(S.time),
            session: S.svc === 'lunch' ? 'Lunch' : 'Dinner',
            seating: spec.title,
            occasion: S.occ || '',
            dishes: S.pre ? S.pre.split(',').map(s => ({ name: s.trim() })) : [],
            notes: req || ''
          });
        }

        window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`, '_blank');
        if ($("sent")) {
          $("sent").hidden = false;
          // Wire up View Boarding Pass button
          let passBtn = $("viewBoardingPassBtn");
          if (!passBtn) {
            passBtn = document.createElement("button");
            passBtn.id = "viewBoardingPassBtn";
            passBtn.type = "button";
            passBtn.className = "btn-editorial-primary";
            passBtn.style.marginBottom = "10px";
            passBtn.innerHTML = "View Digital Boarding Pass &amp; QR &rarr;";
            passBtn.onclick = () => {
              if (window.TasteBengalBooking && window.TasteBengalBooking.openPassModal) {
                window.TasteBengalBooking.openPassModal();
              }
            };
            const actionsWrap = $("sent").querySelector(".conf-actions");
            if (actionsWrap) actionsWrap.prepend(passBtn);
          }
        }
        if ($("waResend")) $("waResend").href = `https://wa.me/${WA}?text=${encodeURIComponent(msg)}`;
      };
    }
  }

  if ($("editBack")) $("editBack").onclick = () => go(1);

  // Read URL query parameter for pre-order
  const urlParams = new URLSearchParams(window.location.search);
  const preorderParam = urlParams.get('preorder');
  if (preorderParam) {
    S.pre = preorderParam;
    if ($("customDishInput")) $("customDishInput").value = preorderParam;
    // Check if matches preset cards
    document.querySelectorAll("#pre .dish-card").forEach(x => {
      if (x.dataset.v && x.dataset.v.toLowerCase() === preorderParam.toLowerCase()) {
        x.setAttribute("aria-pressed", "true");
      }
    });
  }

  // Initial draw
  drawSlots();
  render();
});
