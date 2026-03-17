/* ===== מסלול — Main JavaScript ===== */

(function () {
  'use strict';

  /* ----- Mobile Nav Toggle ----- */
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close nav on link click (mobile)
    mainNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mainNav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ----- Situation Selector (Home Page) ----- */
  const step1Radios = document.querySelectorAll('input[name="situation"]');
  const step2Container = document.getElementById('step2');
  const step2Radios = document.querySelectorAll('input[name="burial"]');
  const goBtn = document.getElementById('goBtn');

  let selectedSituation = null;
  let selectedBurial = null;

  // Route map: situation + burial → page
  const routes = {
    'mosad': {
      'datit': 'maslul-mosad.html',
      'ezrachit': 'maslul-mosad.html',
      'help': 'hashvaah.html'
    },
    'bayit': {
      'datit': 'maslul-bayit.html',
      'ezrachit': 'maslul-bayit.html',
      'help': 'hashvaah.html'
    },
    'lo-tzapuy': {
      'datit': 'maslul-lo-tzapuy.html',
      'ezrachit': 'maslul-lo-tzapuy.html',
      'help': 'hashvaah.html'
    },
    'chutz': {
      'datit': 'maslul-chutz.html',
      'ezrachit': 'maslul-chutz.html',
      'help': 'hashvaah.html'
    },
    'hemshech': {
      'datit': 'maslul-hemshech.html',
      'ezrachit': 'maslul-hemshech.html',
      'help': 'hashvaah.html'
    }
  };

  if (step1Radios.length > 0) {
    step1Radios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        selectedSituation = this.value;
        if (step2Container) {
          step2Container.classList.add('is-visible');
          step2Container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });
  }

  if (step2Radios.length > 0) {
    step2Radios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        selectedBurial = this.value;
        if (selectedBurial === 'help') {
          window.location.href = 'hashvaah.html';
          return;
        }
        if (selectedSituation && routes[selectedSituation]) {
          var page = routes[selectedSituation][selectedBurial] || 'maslul-mosad.html';
          window.location.href = page;
        }
      });
    });
  }

  /* ----- Checklist LocalStorage Persistence ----- */
  const STORAGE_KEY = 'maslul_checklist';

  function loadChecklist() {
    try {
      return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function saveChecklist(data) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // sessionStorage unavailable
    }
  }

  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  if (checkboxes.length > 0) {
    var saved = loadChecklist();

    checkboxes.forEach(function (cb) {
      var id = cb.id;
      if (id && saved[id]) {
        cb.checked = true;
        cb.closest('.checklist-item').classList.add('is-checked');
      }

      cb.addEventListener('change', function () {
        var data = loadChecklist();
        if (this.checked) {
          data[this.id] = true;
          this.closest('.checklist-item').classList.add('is-checked');
        } else {
          delete data[this.id];
          this.closest('.checklist-item').classList.remove('is-checked');
        }
        saveChecklist(data);
      });
    });
  }

  /* ----- Tab Switching ----- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabBtns.length > 0) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = this.getAttribute('data-tab');

        tabBtns.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(function (p) {
          p.classList.remove('is-active');
        });

        this.classList.add('is-active');
        this.setAttribute('aria-selected', 'true');
        var panel = document.getElementById(target);
        if (panel) panel.classList.add('is-active');
      });
    });
  }

  /* ----- Print Button ----- */
  const printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

  /* ----- Dynamic Date Display ----- */
  const dateEls = document.querySelectorAll('.dynamic-date');
  if (dateEls.length > 0) {
    var months = [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
    var now = new Date();
    var dateStr = months[now.getMonth()] + ' ' + now.getFullYear();
    dateEls.forEach(function (el) {
      el.textContent = dateStr;
    });
  }

  /* ----- Progress Bar: highlight on scroll ----- */
  const progressSteps = document.querySelectorAll('.progress-step[data-section]');
  if (progressSteps.length > 0) {
    function updateProgress() {
      var scrollPos = window.scrollY + 200;
      var active = null;
      progressSteps.forEach(function (step) {
        var section = document.getElementById(step.getAttribute('data-section'));
        if (section && section.offsetTop <= scrollPos) {
          active = step;
        }
      });
      progressSteps.forEach(function (s) { s.classList.remove('is-active'); });
      if (active) active.classList.add('is-active');
    }
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

  /* ----- Smooth scroll for anchor links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        target.focus({ preventScroll: true });
      }
    });
  });

})();
