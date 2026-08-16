document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STATE MANAGEMENT & DATA DEFAULTS
  // ==========================================
  const maxLimits = {
    catCpu: 100,
    catGpu: 100,
    catRam: 400,
    catNb: 50,
    catSb: 50,
    obsKeyboard: 300,
    obsMouse: 750,
    obsHeadphones: 1000,
    obsPrinters: 70,
    obsMonitors: 35,
    obsPcbuilds: 40
  };

  let dashboardData = JSON.parse(localStorage.getItem('dashboardData')) || {
    prices: {
      cpu: 4500,
      ram: 1800,
      mb: 3200,
      gpu: 12500,
      keyboard: 850,
      mouse: 450,
      headphones: 1200,
      printers: 5500,
      monitors: 4200,
      pcbuilds: 25000,
      nb: 650,
      sb: 600
    },
    categories: {
      cpu: 65,
      gpu: 40,
      ram: 280,
      nb: 30,
      sb: 25
    },
    observations: {
      keyboard: 180,
      mouse: 450,
      headphones: 620,
      printers: 35,
      monitors: 20,
      pcbuilds: 15
    },
    shortages: {
      cpu: false,
      gpu: true,
      ram: false,
      mb: false,
      keyboard: false,
      mouse: false,
      headphones: false,
      printers: true,
      monitors: false,
      pcbuilds: false,
      nb: false,
      sb: false
    },
    sales: {
      cpu: 5,
      gpu: 2,
      ram: 12,
      mb: 4,
      keyboard: 15,
      mouse: 25,
      headphones: 8,
      printers: 1,
      monitors: 3,
      pcbuilds: 1,
      nb: 0,
      sb: 0
    }
  };

  // ==========================================
  // TAB NAVIGATION
  // ==========================================
  const menuItems = document.querySelectorAll('.menu-item');
  const tabContents = document.querySelectorAll('.tab-content');

  menuItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetTab = item.getAttribute('data-tab');

      menuItems.forEach(i => i.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));

      item.classList.add('active');
      const activeContent = document.getElementById(`tab-${targetTab}`);
      if (activeContent) activeContent.classList.add('active');
    });
  });

  // ==========================================
  // DATA INPUT MODAL LOGIC
  // ==========================================
  const inputModal = document.getElementById('input-modal');
  const openInputModalBtn = document.getElementById('open-input-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const saveDataBtn = document.getElementById('save-data-btn');

  // Open Modal & Populate Input Values
  openInputModalBtn.addEventListener('click', () => {
    // Populate Prices
    document.getElementById('in-price-cpu').value = dashboardData.prices.cpu || 0;
    document.getElementById('in-price-ram').value = dashboardData.prices.ram || 0;
    document.getElementById('in-price-mb').value = dashboardData.prices.mb || 0;
    document.getElementById('in-price-gpu').value = dashboardData.prices.gpu || 0;

    // Populate Categories Quantities
    document.getElementById('in-cat-cpu').value = dashboardData.categories.cpu || 0;
    document.getElementById('in-cat-gpu').value = dashboardData.categories.gpu || 0;
    document.getElementById('in-cat-ram').value = dashboardData.categories.ram || 0;
    document.getElementById('in-cat-nb').value = dashboardData.categories.nb || 0;
    document.getElementById('in-cat-sb').value = dashboardData.categories.sb || 0;

    // Populate Observations Quantities
    document.getElementById('in-obs-keyboard').value = dashboardData.observations.keyboard || 0;
    document.getElementById('in-obs-mouse').value = dashboardData.observations.mouse || 0;
    document.getElementById('in-obs-headphones').value = dashboardData.observations.headphones || 0;
    document.getElementById('in-obs-printers').value = dashboardData.observations.printers || 0;
    document.getElementById('in-obs-monitors').value = dashboardData.observations.monitors || 0;
    document.getElementById('in-obs-pcbuilds').value = dashboardData.observations.pcbuilds || 0;

    inputModal.classList.add('active');
  });

  // Close Modal
  closeModalBtn.addEventListener('click', () => {
    inputModal.classList.remove('active');
  });

  inputModal.addEventListener('click', (e) => {
    if (e.target === inputModal) inputModal.classList.remove('active');
  });

  // Save Data
  saveDataBtn.addEventListener('click', () => {
    // Read Values
    dashboardData.prices.cpu = parseFloat(document.getElementById('in-price-cpu').value) || 0;
    dashboardData.prices.ram = parseFloat(document.getElementById('in-price-ram').value) || 0;
    dashboardData.prices.mb = parseFloat(document.getElementById('in-price-mb').value) || 0;
    dashboardData.prices.gpu = parseFloat(document.getElementById('in-price-gpu').value) || 0;

    dashboardData.categories.cpu = parseInt(document.getElementById('in-cat-cpu').value) || 0;
    dashboardData.categories.gpu = parseInt(document.getElementById('in-cat-gpu').value) || 0;
    dashboardData.categories.ram = parseInt(document.getElementById('in-cat-ram').value) || 0;
    dashboardData.categories.nb = parseInt(document.getElementById('in-cat-nb').value) || 0;
    dashboardData.categories.sb = parseInt(document.getElementById('in-cat-sb').value) || 0;

    dashboardData.observations.keyboard = parseInt(document.getElementById('in-obs-keyboard').value) || 0;
    dashboardData.observations.mouse = parseInt(document.getElementById('in-obs-mouse').value) || 0;
    dashboardData.observations.headphones = parseInt(document.getElementById('in-obs-headphones').value) || 0;
    dashboardData.observations.printers = parseInt(document.getElementById('in-obs-printers').value) || 0;
    dashboardData.observations.monitors = parseInt(document.getElementById('in-obs-monitors').value) || 0;
    dashboardData.observations.pcbuilds = parseInt(document.getElementById('in-obs-pcbuilds').value) || 0;

    saveAndRefresh();
    inputModal.classList.remove('active');
  });

  // ==========================================
  // ADD COMPONENT / SET PRICE MODAL
  // ==========================================
  const addCompModal = document.getElementById('add-component-modal');
  const closeAddCompModalBtn = document.getElementById('close-add-comp-modal');
  const confirmAddCompBtn = document.getElementById('confirm-add-comp-btn');
  const addCompBtns = document.querySelectorAll('.add-comp-btn');
  let currentCompTarget = null;

  addCompBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      currentCompTarget = id;

      document.getElementById('add-comp-modal-title').innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Update ${name}`;
      document.getElementById('add-comp-price').value = dashboardData.prices[id] || 0;
      document.getElementById('add-comp-qty').value = 1;

      addCompModal.classList.add('active');
    });
  });

  closeAddCompModalBtn.addEventListener('click', () => {
    addCompModal.classList.remove('active');
  });

  confirmAddCompBtn.addEventListener('click', () => {
    if (!currentCompTarget) return;

    const newPrice = parseFloat(document.getElementById('add-comp-price').value) || 0;
    const addQty = parseInt(document.getElementById('add-comp-qty').value) || 0;

    dashboardData.prices[currentCompTarget] = newPrice;

    // Update quantity in category or observation
    if (dashboardData.categories[currentCompTarget] !== undefined) {
      dashboardData.categories[currentCompTarget] += addQty;
    } else if (dashboardData.observations[currentCompTarget] !== undefined) {
      dashboardData.observations[currentCompTarget] += addQty;
    }

    saveAndRefresh();
    addCompModal.classList.remove('active');
  });

  // ==========================================
  // UI REFRESH & RENDER FUNCTIONS
  // ==========================================
  function saveAndRefresh() {
    localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
    renderDashboard();
    renderAchievements();
    renderShortages();
    renderSales();
  }

  function renderDashboard() {
    // Top Cards Counter Animation / Update
    updateCounter('card-cpu-price', dashboardData.prices.cpu);
    updateCounter('card-ram-price', dashboardData.prices.ram);
    updateCounter('card-mb-price', dashboardData.prices.mb);
    updateCounter('card-gpu-price', dashboardData.prices.gpu);

    // Update Categories
    updateProgressBar('cat-cpu-bar', 'cat-cpu-percent', dashboardData.categories.cpu, maxLimits.catCpu);
    updateProgressBar('cat-gpu-bar', 'cat-gpu-percent', dashboardData.categories.gpu, maxLimits.catGpu);
    updateProgressBar('cat-ram-bar', 'cat-ram-percent', dashboardData.categories.ram, maxLimits.catRam);
    updateProgressBar('cat-nb-bar', 'cat-nb-percent', dashboardData.categories.nb, maxLimits.catNb);
    updateProgressBar('cat-sb-bar', 'cat-sb-percent', dashboardData.categories.sb, maxLimits.catSb);

    // Update Observations
    updateProgressBar('obs-keyboard-bar', 'obs-keyboard-percent', dashboardData.observations.keyboard, maxLimits.obsKeyboard);
    updateProgressBar('obs-mouse-bar', 'obs-mouse-percent', dashboardData.observations.mouse, maxLimits.obsMouse);
    updateProgressBar('obs-headphones-bar', 'obs-headphones-percent', dashboardData.observations.headphones, maxLimits.obsHeadphones);
    updateProgressBar('obs-printers-bar', 'obs-printers-percent', dashboardData.observations.printers, maxLimits.obsPrinters);
    updateProgressBar('obs-monitors-bar', 'obs-monitors-percent', dashboardData.observations.monitors, maxLimits.obsMonitors);
    updateProgressBar('obs-pcbuilds-bar', 'obs-pcbuilds-percent', dashboardData.observations.pcbuilds, maxLimits.obsPcbuilds);
  }

  function updateCounter(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) {
      el.textContent = Number(value).toLocaleString();
    }
  }

  function updateProgressBar(barId, percentId, current, max) {
    const percent = Math.min(Math.round((current / max) * 100), 100);
    const bar = document.getElementById(barId);
    const percentTxt = document.getElementById(percentId);

    if (bar) bar.style.width = `${percent}%`;
    if (percentTxt) percentTxt.textContent = `${percent}%`;
  }

  function renderAchievements() {
    for (const [key, price] of Object.entries(dashboardData.prices)) {
      const priceTag = document.getElementById(`price-${key}`);
      if (priceTag) {
        priceTag.textContent = Number(price).toLocaleString();
      }
    }
  }

  // ==========================================
  // SHORTAGES RENDER & HANDLER
  // ==========================================
  function renderShortages() {
    const container = document.getElementById('shortages-checklist-container');
    if (!container) return;

    const items = [
      { id: 'cpu', name: 'CPU Processors' },
      { id: 'gpu', name: 'Graphics Cards (GPU)' },
      { id: 'ram', name: 'RAM Modules' },
      { id: 'mb', name: 'Motherboards' },
      { id: 'keyboard', name: 'Gaming Keyboards' },
      { id: 'mouse', name: 'Gaming Mice' },
      { id: 'headphones', name: 'Headsets / Headphones' },
      { id: 'printers', name: 'Office Printers' },
      { id: 'monitors', name: 'Monitors & Displays' },
      { id: 'pcbuilds', name: 'Custom PC Builds' },
      { id: 'nb', name: 'Northbridge Chipsets' },
      { id: 'sb', name: 'Southbridge Chipsets' }
    ];

    container.innerHTML = '';
    let shortageCount = 0;

    items.forEach(item => {
      const isMissing = !!dashboardData.shortages[item.id];
      if (isMissing) shortageCount++;

      const card = document.createElement('div');
      card.className = `missing-item-card ${isMissing ? 'is-missing' : ''}`;
      card.innerHTML = `
        <label class="checkbox-container">
          <input type="checkbox" data-id="${item.id}" ${isMissing ? 'checked' : ''}>
          <span class="item-name">${item.name}</span>
        </label>
        <span class="status-tag">${isMissing ? 'Shortage / Out' : 'In Stock'}</span>
      `;

      const checkbox = card.querySelector('input');
      checkbox.addEventListener('change', (e) => {
        dashboardData.shortages[item.id] = e.target.checked;
        saveAndRefresh();
      });

      container.appendChild(card);
    });

    const badge = document.getElementById('shortage-count-badge');
    if (badge) badge.textContent = shortageCount;
  }

  // ==========================================
  // SALES RENDER & HANDLER
  // ==========================================
  function renderSales() {
    const container = document.getElementById('sales-items-container');
    if (!container) return;

    const items = [
      { id: 'cpu', name: 'CPU Processor' },
      { id: 'gpu', name: 'GPU Card' },
      { id: 'ram', name: 'RAM Memory' },
      { id: 'mb', name: 'Motherboard' },
      { id: 'keyboard', name: 'Gaming Keyboard' },
      { id: 'mouse', name: 'Gaming Mouse' },
      { id: 'headphones', name: 'Headphones' },
      { id: 'printers', name: 'Printers' },
      { id: 'monitors', name: 'Monitors' },
      { id: 'pcbuilds', name: 'PC Builds' },
      { id: 'nb', name: 'Northbridge' },
      { id: 'sb', name: 'Southbridge' }
    ];

    container.innerHTML = '';
    let totalUnits = 0;
    let totalRevenue = 0;

    items.forEach(item => {
      const price = dashboardData.prices[item.id] || 0;
      const qtySold = dashboardData.sales[item.id] || 0;
      const itemTotal = price * qtySold;

      totalUnits += qtySold;
      totalRevenue += itemTotal;

      const row = document.createElement('div');
      row.className = 'sales-item-row';
      row.innerHTML = `
        <div class="sales-item-info">
          <h4>${item.name}</h4>
          <span class="sales-unit-price">Price: ${price.toLocaleString()} EGP</span>
        </div>
        <div class="sales-input-group">
          <label>Qty Sold:</label>
          <input type="number" class="sales-qty-input" data-id="${item.id}" value="${qtySold}" min="0">
        </div>
        <div class="sales-total-box">
          <span>Subtotal</span>
          <strong>${itemTotal.toLocaleString()} EGP</strong>
        </div>
      `;

      const qtyInput = row.querySelector('.sales-qty-input');
      qtyInput.addEventListener('input', (e) => {
        const val = parseInt(e.target.value) || 0;
        dashboardData.sales[item.id] = val;
        saveAndRefresh();
      });

      container.appendChild(row);
    });

    document.getElementById('total-sales-units').textContent = `${totalUnits.toLocaleString()} Units`;
    document.getElementById('total-sales-revenue').textContent = `${totalRevenue.toLocaleString()} EGP`;
  }

  // ==========================================
  // CHART.JS INITIALIZATION
  // ==========================================
  const ctx = document.getElementById('stocksChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
          label: 'Stock Value (EGP)',
          data: [120000, 150000, 180000, 170000, 210000, 250000, 290000, 310000, 340000, 380000, 420000, 450000],
          borderColor: '#f0a500',
          backgroundColor: 'rgba(240, 165, 0, 0.15)',
          fill: true,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: '#e2e8f0' } }
        }
      }
    });
  }

  // Initial Load
  saveAndRefresh();
});