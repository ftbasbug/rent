/* foundation.js */

class BookingSPA {
  constructor() {
    this.currentPage = null;
    this.bookingId = null;
    this.scriptsLoaded = new Set();
    this.init();
  }

  async init() {
    this.setupThemeToggle();
    this.updateBookingId();
    this.setupNavigation();
    await this.loadPage(this.getCurrentPage());
  }

  // 1. COMPLETED: Booking ID Management (with your suggested warning)
  updateBookingId() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      this.bookingId = urlParams.get('booking') || localStorage.getItem('bookingId');
      
      if (this.bookingId) {
        localStorage.setItem('bookingId', this.bookingId);
        document.body.dataset.bookingId = this.bookingId;
        
        const bookingEl = document.getElementById('booking-id');
        if (bookingEl) {
          bookingEl.textContent = `Booking #${this.bookingId}`;
        } else {
          console.warn('#booking-id element not found in DOM');
        }
      }
    } catch (error) {
      console.error('Booking ID update failed:', error);
    }
  }

  // 2. COMPLETED: Navigation Setup (your requested method)
  setupNavigation() {
    // Handle SPA links
    const handleNavigation = (e) => {
      const link = e.target.closest('[data-spa-link]');
      if (link) {
        e.preventDefault();
        this.loadPage(link.dataset.page);
      }
    };

    document.addEventListener('click', handleNavigation);
    document.addEventListener('touchend', handleNavigation);

    // Browser history
    window.addEventListener('popstate', (e) => {
      if (e.state?.page) {
        this.loadPage(e.state.page);
      }
    });
  }

  // 3. COMPLETED: Page Loading (your improved version)
  async loadPage(page) {
    if (!page || this.currentPage === page) return;

    try {
      this.showLoadingState();
      
      // Load HTML
      const response = await fetch(`pages/${page}.html`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const html = await response.text();
      
      // Inject content
      document.getElementById('app').innerHTML = html;
      this.currentPage = page;
      
      // Load JS
      await this.loadPageScript(page);
      
      // Update history
      history.pushState({ page }, '', `?page=${page}`);
      
    } catch (error) {
      console.error(`Failed loading ${page}:`, error);
      this.showErrorState(page);
    }
  }

  // 4. COMPLETED: Script Loading (optimized)
  async loadPageScript(page) {
    return new Promise((resolve) => {
      // Cleanup previous
      const oldScript = document.getElementById('page-script');
      if (oldScript) oldScript.remove();

      // Load new
      const script = document.createElement('script');
      script.id = 'page-script';
      script.src = `js/${page}.js`;
      
      script.onload = () => {
        this.scriptsLoaded.add(page);
        resolve();
      };
      
      script.onerror = () => {
        console.warn(`Script failed: ${page}.js`);
        resolve();
      };
      
      document.body.appendChild(script);
    });
  }

  // 5. COMPLETED: Current Page Detection (your suggested improvement)
  getCurrentPage() {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('page') || 'vehicle-selection';
    } catch (error) {
      console.warn('URL parse error, defaulting to vehicle-selection');
      return 'vehicle-selection';
    }
  }

  // Helper Methods
  showLoadingState() {
    document.getElementById('app').innerHTML = `
      <div class="spa-loading">
        <div class="loader"></div>
        <p>Loading ${this.getPageName(this.currentPage)}...</p>
      </div>`;
  }

  showErrorState(page) {
    document.getElementById('app').innerHTML = `
      <div class="error-state">
        <h3>Failed to load ${this.getPageName(page)}</h3>
        <button class="retry-btn" onclick="window.bookingSPA.loadPage('${page}')">
          Retry
        </button>
      </div>`;
  }

  getPageName(page) {
    const names = {
      'vehicle-selection': 'Vehicle Selection',
      'extras': 'Extra Services',
      'details-payment': 'Payment',
      'thankyou': 'Confirmation'
    };
    return names[page] || 'Page';
  }

  // Theme System
  setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.checked = localStorage.getItem('theme') === 'dark';
    toggle.addEventListener('change', () => {
      const newTheme = toggle.checked ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      document.documentElement.setAttribute('data-theme', newTheme);
    });
  }
}

// Initialize
window.bookingSPA = new BookingSPA();
