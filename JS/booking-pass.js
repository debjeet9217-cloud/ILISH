/**
 * ILISH · The Taste of Bengal
 * Digital Boarding Pass & Active Booking State Machine
 * Client-Side Persistence with LocalStorage
 */

(function () {
  const STORAGE_KEY = 'tb_active_booking';

  // --- SVG QR Code Generator for Booking Ref ---
  function generateQrSvg(refCode) {
    // Elegant procedural pseudo-matrix pattern styled like a QR boarding code
    let rects = '';
    const seed = (refCode || 'ILISH').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const size = 17; // 17x17 grid
    const cellSize = 3.6;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Corner finder squares
        const isFinderTL = r < 5 && c < 5;
        const isFinderTR = r < 5 && c >= size - 5;
        const isFinderBL = r >= size - 5 && c < 5;

        let fill = false;
        if (isFinderTL) {
          fill = (r === 0 || r === 4 || c === 0 || c === 4 || (r >= 1 && r <= 3 && c >= 1 && c <= 3));
        } else if (isFinderTR) {
          fill = (r === 0 || r === 4 || c === size - 5 || c === size - 1 || (r >= 1 && r <= 3 && c >= size - 4 && c <= size - 2));
        } else if (isFinderBL) {
          fill = (r === size - 5 || r === size - 1 || c === 0 || c === 4 || (r >= size - 4 && r <= size - 2 && c >= 1 && c <= 3));
        } else {
          // Deterministic pseudorandom fill based on seed and coordinates
          const val = Math.sin(seed * (r + 1) + (c + 1) * 31.7) * 10000;
          fill = (val - Math.floor(val)) > 0.48;
        }

        if (fill) {
          rects += `<rect x="${(c * cellSize + 1).toFixed(1)}" y="${(r * cellSize + 1).toFixed(1)}" width="${cellSize - 0.4}" height="${cellSize - 0.4}" fill="#4A1118"/>`;
        }
      }
    }

    return `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Reservation QR Code">${rects}</svg>`;
  }

  // --- Calculate Human Readable Countdown ---
  function getCountdownText(bookingDate, bookingTime) {
    if (!bookingDate) return 'Booking Confirmed';
    try {
      // Parse e.g. "2026-10-18" and "08:00 PM"
      const dateParts = bookingDate.split('-');
      if (dateParts.length !== 3) return `Reserved for ${bookingDate}`;

      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1;
      const day = parseInt(dateParts[2], 10);

      let hours = 20; // default 8 PM
      let minutes = 0;
      if (bookingTime) {
        const timeMatch = bookingTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (timeMatch) {
          hours = parseInt(timeMatch[1], 10);
          minutes = parseInt(timeMatch[2], 10);
          if (timeMatch[3] && timeMatch[3].toUpperCase() === 'PM' && hours < 12) hours += 12;
          if (timeMatch[3] && timeMatch[3].toUpperCase() === 'AM' && hours === 12) hours = 0;
        }
      }

      const target = new Date(year, month, day, hours, minutes);
      const now = new Date();
      const diffMs = target - now;

      if (diffMs <= 0) {
        return 'Table Reserved Today';
      }

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

      if (diffDays > 0) {
        return `Your table is in ${diffDays} day${diffDays > 1 ? 's' : ''}, ${diffHours} hr${diffHours !== 1 ? 's' : ''}`;
      } else {
        return `Your table is today in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
      }
    } catch (e) {
      return `Reserved for ${bookingDate}`;
    }
  }

  // --- Generate Google Calendar Link ---
  function getGoogleCalendarUrl(booking) {
    try {
      const title = encodeURIComponent('Table Reservation · ILISH The Taste of Bengal');
      const details = encodeURIComponent(
        `Reservation Reference: ${booking.ref || 'ILISH'}\nGuests: ${booking.guests || '2'}\nSeating: ${booking.seating || 'Standard'}\nAddress: 14/B Park Street, Kolkata\nPhone: +91 98765 43210`
      );
      const location = encodeURIComponent('ILISH · Taste of Bengal, Park Street, Kolkata');

      const d = (booking.date || '').replace(/-/g, '');
      let startTime = '193000';
      let endTime = '213000';
      if (booking.time) {
        const m = booking.time.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (m) {
          let h = parseInt(m[1], 10);
          if (m[3] && m[3].toUpperCase() === 'PM' && h < 12) h += 12;
          if (m[3] && m[3].toUpperCase() === 'AM' && h === 12) h = 0;
          const hStr = h < 10 ? '0' + h : '' + h;
          const hEndStr = (h + 2) < 10 ? '0' + (h + 2) : '' + (h + 2);
          startTime = `${hStr}${m[2]}00`;
          endTime = `${hEndStr}${m[2]}00`;
        }
      }

      const dates = `${d}T${startTime}/${d}T${endTime}`;
      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${dates}`;
    } catch (e) {
      return '#';
    }
  }

  // --- Global Booking Manager ---
  window.TasteBengalBooking = {
    getActiveBooking() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        return null;
      }
    },

    saveBooking(bookingData) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookingData));
      } catch (e) {
        console.error('Failed to save reservation to localStorage', e);
      }
    },

    clearBooking() {
      try {
        localStorage.removeItem(STORAGE_KEY);
        const pill = document.getElementById('navBookingPill');
        if (pill) pill.remove();
        this.closePassModal();
      } catch (e) {
        console.error(e);
      }
    },

    renderNavbarPill() {
      // Remove pill from nav left of reservation text
      const pill = document.getElementById('navBookingPill');
      if (pill) pill.remove();
    },

    openPassModal() {
      const booking = this.getActiveBooking();
      if (!booking) return;

      let backdrop = document.getElementById('passModalBackdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'passModalBackdrop';
        backdrop.className = 'pass-modal-backdrop';
        backdrop.setAttribute('role', 'dialog');
        backdrop.setAttribute('aria-modal', 'true');
        backdrop.setAttribute('aria-label', 'Digital Boarding Pass Reservation Ticket');
        document.body.appendChild(backdrop);

        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) this.closePassModal();
        });

        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && backdrop.classList.contains('active')) {
            this.closePassModal();
          }
        });
      }

      const countdown = getCountdownText(booking.date, booking.time);
      const calUrl = getGoogleCalendarUrl(booking);
      const qrSvg = generateQrSvg(booking.ref);

      let dishesHtml = '';
      if (booking.dishes && booking.dishes.length > 0) {
        const dishRows = booking.dishes.map(d => `
          <li class="pass-dish-row">
            <span>${d.name || d}</span>
            <span>${d.price ? '₹' + d.price : ''}</span>
          </li>
        `).join('');

        dishesHtml = `
          <div class="pass-dishes-block">
            <div class="pass-dishes-title">
              <span>PRE-ORDERED DISHES (${booking.dishes.length})</span>
              <span>${booking.estTotal ? '₹' + booking.estTotal : ''}</span>
            </div>
            <ul class="pass-dish-list">
              ${dishRows}
            </ul>
          </div>
        `;
      }

      backdrop.innerHTML = `
        <div class="boarding-pass-card" role="document">
          <button type="button" class="pass-close-btn" id="closePassModalBtn" aria-label="Close Digital Pass">&times;</button>
          
          <div class="pass-header">
            <div class="pass-header-top">
              <div class="pass-brand-badge">
                <span class="pass-brand-name">ILISH</span>
                <span class="pass-sub-brand">Taste of Bengal</span>
              </div>
              <span class="pass-status-pill">&#9679; Table Reserved</span>
            </div>

            <div class="pass-headline">
              <h2 class="pass-title">${booking.name || 'Guest'}</h2>
              <span class="pass-ref-tag">Booking Reference: <b>${booking.ref || 'IL-8842'}</b></span>
            </div>
          </div>

          <div class="pass-countdown-bar">
            <span>${countdown}</span>
            <span>Park Street, Kolkata</span>
          </div>

          <div class="ticket-divider-strip">
            <div class="ticket-dashed-line"></div>
          </div>

          <div class="pass-body">
            <div class="pass-grid">
              <div class="pass-item">
                <span class="pass-label">Date &amp; Day</span>
                <span class="pass-value">${booking.date || 'TBD'} ${booking.dayName ? '(' + booking.dayName + ')' : ''}</span>
              </div>
              <div class="pass-item">
                <span class="pass-label">Time &amp; Session</span>
                <span class="pass-value">${booking.time || 'Dinner'} (${booking.session || 'Dinner'})</span>
              </div>
              <div class="pass-item">
                <span class="pass-label">Party Size</span>
                <span class="pass-value">${booking.guests || '2 Guests'}</span>
              </div>
              <div class="pass-item">
                <span class="pass-label">Table Area</span>
                <span class="pass-value">${booking.seating || 'Heritage Dining Room'}</span>
              </div>
              ${booking.occasion ? `
              <div class="pass-item" style="grid-column: 1 / -1;">
                <span class="pass-label">Occasion</span>
                <span class="pass-value highlight">${booking.occasion}</span>
              </div>
              ` : ''}
            </div>

            ${dishesHtml}

            <div class="pass-qr-row">
              <div class="pass-qr-box">
                ${qrSvg}
              </div>
              <div class="pass-qr-info">
                <div class="pass-qr-heading">Show at Concierge Desk</div>
                <div class="pass-qr-sub">Scan upon arrival at 14/B Park Street for immediate host seating.</div>
              </div>
            </div>

            <div class="pass-actions">
              <a href="${calUrl}" target="_blank" rel="noopener" class="pass-btn-primary">
                <span>&#128197; Add to Google Calendar</span>
              </a>
              <div class="pass-secondary-actions">
                <a href="https://api.whatsapp.com/send/?phone=919876543210&text=${encodeURIComponent('Hello ILISH! Inquiring about reservation ' + (booking.ref || ''))}" target="_blank" rel="noopener" class="pass-btn-secondary">
                  <span>Chat Concierge</span>
                </a>
                <button type="button" class="pass-btn-secondary pass-btn-danger" id="cancelBookingBtn">
                  <span>Cancel Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      // Event handlers
      document.getElementById('closePassModalBtn').addEventListener('click', () => {
        this.closePassModal();
      });

      document.getElementById('cancelBookingBtn').addEventListener('click', () => {
        if (confirm('Are you sure you wish to cancel this reservation at ILISH?')) {
          this.clearBooking();
          alert('Your reservation has been cancelled.');
        }
      });

      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    },

    closePassModal() {
      const backdrop = document.getElementById('passModalBackdrop');
      if (backdrop) {
        backdrop.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  };

  // Auto-init on page load
  document.addEventListener('DOMContentLoaded', () => {
    window.TasteBengalBooking.renderNavbarPill();
  });
})();
