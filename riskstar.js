// ===========================
// RISKSTAR - Nueva Metáfora Visual
// Combina Star Coordinates + Glyphs para datos mixtos de seguros
// ===========================

// Estado global
const STATE = {
  data: [],
  filteredData: [],
  selectedId: null
};

// Configuración
const CONFIG = {
  dataPath: 'car_insurance_claim.csv',
  
  // TODAS las 15 dimensiones numéricas en ejes radiales
  axes: [
    { key: 'AGE', label: 'Edad', type: 'numeric' },
    { key: 'INCOME', label: 'Ingreso', type: 'numeric' },
    { key: 'HOME_VAL', label: 'Valor Casa', type: 'numeric' },
    { key: 'BLUEBOOK', label: 'Valor Auto', type: 'numeric' },
    { key: 'OLDCLAIM', label: 'Reclamo Anterior', type: 'numeric' },
    { key: 'CLM_FREQ', label: 'Frec. Reclamos', type: 'numeric' },
    { key: 'MVR_PTS', label: 'Puntos MVR', type: 'numeric' },
    { key: 'CLM_AMT', label: 'Monto Reclamo', type: 'numeric' },
    { key: 'KIDSDRIV', label: 'Niños Conducen', type: 'numeric' },
    { key: 'HOMEKIDS', label: 'Niños Casa', type: 'numeric' },
    { key: 'YOJ', label: 'Años Trabajo', type: 'numeric' },
    { key: 'TIF', label: 'Tiempo Asegurado', type: 'numeric' },
    { key: 'CAR_AGE', label: 'Edad Auto', type: 'numeric' },
    { key: 'TRAVTIME', label: 'Tiempo Viaje', type: 'numeric' }
  ],
  
  colors: {
    claim: { 0: '#48bb78', 1: '#f56565' }
  }
};

// Parsear currency
function parseCurrency(str) {
  if (typeof str === 'string') {
    return parseFloat(str.replace(/[$,]/g, '')) || 0;
  }
  return parseFloat(str) || 0;
}

// Cargar datos - TODAS las 27 características
async function loadData() {
  try {
    const raw = await d3.csv(CONFIG.dataPath);
    
    const cleaned = raw.map((d, i) => ({
      INDEX: i,
      ID: d.ID,
      // === NUMÉRICAS (14) ===
      AGE: +d.AGE || 0,
      INCOME: parseCurrency(d.INCOME),
      HOME_VAL: parseCurrency(d.HOME_VAL),
      BLUEBOOK: parseCurrency(d.BLUEBOOK),
      OLDCLAIM: parseCurrency(d.OLDCLAIM),
      CLM_FREQ: +d.CLM_FREQ || 0,
      MVR_PTS: +d.MVR_PTS || 0,
      CLM_AMT: parseCurrency(d.CLM_AMT),
      KIDSDRIV: +d.KIDSDRIV || 0,
      HOMEKIDS: +d.HOMEKIDS || 0,
      YOJ: +d.YOJ || 0,
      TIF: +d.TIF || 0,
      CAR_AGE: +d.CAR_AGE || 0,
      TRAVTIME: +d.TRAVTIME || 0,
      // === CATEGÓRICAS (12) ===
      GENDER: d.GENDER || 'Unknown',
      EDUCATION: d.EDUCATION || 'Unknown',
      CAR_TYPE: d.CAR_TYPE || 'Unknown',
      OCCUPATION: d.OCCUPATION || 'Unknown',
      RED_CAR: d.RED_CAR || 'no',
      REVOKED: d.REVOKED || 'No',
      PARENT1: d.PARENT1 || 'No',
      URBANICITY: d.URBANICITY || 'Unknown',
      MSTATUS: d.MSTATUS || 'No',
      CAR_USE: d.CAR_USE || 'Private',
      // === TARGET ===
      CLAIM_FLAG: +d.CLAIM_FLAG || 0
    }));
    
    console.log(`✅ Loaded ${cleaned.length} records`);
    console.log(`📊 Sample record:`, cleaned[0]);
    return cleaned;
    
  } catch (error) {
    console.error('❌ Error loading data:', error);
    alert('Error loading dataset. Check the file path.');
    return [];
  }
}

// Samplear datos
function sampleData(data, n) {
  if (n >= data.length) return data;
  return d3.shuffle(data.slice()).slice(0, n);
}

// Crear visualización RiskStar
function createRiskStar(data) {
  // Limpiar SVG
  d3.select('#mainSvg').selectAll('*').remove();
  
  if (!data || data.length === 0) {
    console.log('No data to visualize');
    return;
  }
  
  // Dimensiones
  const svg = d3.select('#mainSvg');
  const width = window.innerWidth;
  const height = window.innerHeight - 100; // Descontar header y footer
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 100;
  
  svg.attr('viewBox', `0 0 ${width} ${height}`);
  
  // Grupo principal
  const g = svg.append('g')
    .attr('transform', `translate(${centerX},${centerY})`);
  
  // Número de ejes
  const numAxes = CONFIG.axes.length;
  const angleStep = (2 * Math.PI) / numAxes;
  
  // Escalas para cada eje
  const scales = {};
  CONFIG.axes.forEach(axis => {
    const extent = d3.extent(data, d => d[axis.key]);
    scales[axis.key] = d3.scaleLinear()
      .domain(extent)
      .range([0, radius]);
  });
  
  // Escala para tamaño de glyphs (basado en CLM_AMT)
  const sizeScale = d3.scaleSqrt()
    .domain([0, d3.max(data, d => d.CLM_AMT) || 100000])
    .range([8, 25]); // Tamaños más grandes y visibles
  
  // Dibujar ejes radiales
  CONFIG.axes.forEach((axis, i) => {
    const angle = i * angleStep - Math.PI / 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    
    // Línea del eje
    g.append('line')
      .attr('class', 'axis-line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', x)
      .attr('y2', y);
    
    // Label del eje
    const labelRadius = radius + 30;
    const labelX = Math.cos(angle) * labelRadius;
    const labelY = Math.sin(angle) * labelRadius;
    
    g.append('text')
      .attr('class', 'axis-label')
      .attr('x', labelX)
      .attr('y', labelY)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(axis.label);
    
    // Círculos de guía
    [0.25, 0.5, 0.75, 1].forEach(ratio => {
      const r = radius * ratio;
      g.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', r)
        .attr('fill', 'none')
        .attr('stroke', 'rgba(255,255,255,0.1)')
        .attr('stroke-width', 1)
        .attr('stroke-dasharray', '2,4');
    });
  });
  
  // Función para calcular posición de un punto en Star Coordinates
  function calculatePosition(d) {
    let x = 0, y = 0;
    
    CONFIG.axes.forEach((axis, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const value = scales[axis.key](d[axis.key]);
      x += Math.cos(angle) * value;
      y += Math.sin(angle) * value;
    });
    
    // Normalizar para que no se salga mucho
    const maxDist = radius * 0.8;
    const dist = Math.sqrt(x * x + y * y);
    if (dist > maxDist) {
      x = (x / dist) * maxDist;
      y = (y / dist) * maxDist;
    }
    
    return { x, y };
  }
  
  // Crear glyphs para cada registro
  const glyphs = g.selectAll('.glyph')
    .data(data)
    .join('g')
    .attr('class', 'glyph')
    .attr('transform', d => {
      const pos = calculatePosition(d);
      return `translate(${pos.x},${pos.y})`;
    })
    .on('mouseover', function(event, d) {
      // Highlight
      d3.select(this)
        .raise()
        .select('circle, rect')
        .attr('stroke', '#ffd700')
        .attr('stroke-width', 3);
      
      // Mostrar tooltip
      showTooltip(event, d);
    })
    .on('mouseout', function() {
      d3.select(this)
        .select('circle, rect')
        .attr('stroke', '#333')
        .attr('stroke-width', 1.5);
      
      hideTooltip();
    })
    .on('click', function(event, d) {
      // Toggle selección
      if (STATE.selectedId === d.INDEX) {
        STATE.selectedId = null;
        glyphs.classed('selected', false).classed('faded', false);
      } else {
        STATE.selectedId = d.INDEX;
        glyphs.classed('selected', g => g.INDEX === d.INDEX);
        glyphs.classed('faded', g => g.INDEX !== d.INDEX);
      }
    });
  
  // Dibujar glyphs
  glyphs.each(function(d) {
    const glyph = d3.select(this);
    const baseSize = sizeScale(d.CLM_AMT || 0) + 8; // Tamaño mínimo visible
    const color = CONFIG.colors.claim[d.CLAIM_FLAG];
    
    // ===== CAPA 1: FORMA BASE (GENDER + EDUCATION) =====
    const educationLevels = {
      'PhD': 0,
      'Masters': 1,
      'Bachelors': 2,
      'z_High School': 3,
      '<High School': 4
    };
    const eduLevel = educationLevels[d.EDUCATION] || 3;
    const sides = 3 + eduLevel; // 3-7 lados según educación
    
    const isMale = d.GENDER === 'M' || d.GENDER === 'Male' || d.GENDER === 'z_M';
    
    if (isMale) {
      // Polígono regular para hombres (según educación)
      const points = [];
      for (let i = 0; i < sides; i++) {
        const angle = (i / sides) * 2 * Math.PI - Math.PI / 2;
        const r = baseSize / 2;
        points.push([Math.cos(angle) * r, Math.sin(angle) * r]);
      }
      glyph.append('polygon')
        .attr('points', points.map(p => p.join(',')).join(' '))
        .attr('fill', color)
        .attr('stroke', '#333')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8);
    } else {
      // Círculo para mujeres
      glyph.append('circle')
        .attr('r', baseSize / 2)
        .attr('fill', color)
        .attr('stroke', '#333')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.8);
    }
    
    // ===== CAPA 2: ANILLO EXTERIOR (CAR_TYPE) =====
    const carTypeColors = {
      'Sports Car': '#ef4444',
      'SUV': '#f97316',
      'z_SUV': '#f97316',
      'Minivan': '#eab308',
      'Panel Truck': '#84cc16',
      'Pickup': '#22c55e',
      'Van': '#06b6d4'
    };
    const carColor = carTypeColors[d.CAR_TYPE] || '#999';
    
    glyph.append('circle')
      .attr('r', baseSize / 2 + 3)
      .attr('fill', 'none')
      .attr('stroke', carColor)
      .attr('stroke-width', 2)
      .attr('opacity', 0.7);
    
    // ===== CAPA 3: SECTORES INTERNOS (OCCUPATION) =====
    if (d.OCCUPATION) {
      const occupations = ['Professional', 'Manager', 'Clerical', 'z_Blue Collar', 'Lawyer', 'Doctor'];
      const occIndex = occupations.indexOf(d.OCCUPATION);
      if (occIndex >= 0) {
        const sectorAngle = (2 * Math.PI) / occupations.length;
        const startAngle = occIndex * sectorAngle;
        const endAngle = startAngle + sectorAngle;
        
        const arc = d3.arc()
          .innerRadius(0)
          .outerRadius(baseSize / 4)
          .startAngle(startAngle)
          .endAngle(endAngle);
        
        glyph.append('path')
          .attr('d', arc)
          .attr('fill', '#ffd700')
          .attr('opacity', 0.6);
      }
    }
    
    // ===== CAPA 4: DECORADORES EXTERNOS =====
    const decorators = [];
    
    // RED_CAR
    if (d.RED_CAR === 'yes') {
      decorators.push({ symbol: d3.symbolSquare, color: '#dc2626', pos: 0 });
    }
    
    // REVOKED
    if (d.REVOKED === 'Yes') {
      decorators.push({ symbol: d3.symbolTriangle, color: '#ff6b6b', pos: 1 });
    }
    
    // PARENT1
    if (d.PARENT1 === 'Yes') {
      decorators.push({ symbol: d3.symbolStar, color: '#fbbf24', pos: 2 });
    }
    
    // URBANICITY (Urban = diamante, Rural = cruz)
    if (d.URBANICITY && d.URBANICITY.includes('Urban')) {
      decorators.push({ symbol: d3.symbolDiamond, color: '#3b82f6', pos: 3 });
    } else if (d.URBANICITY && d.URBANICITY.includes('Rural')) {
      decorators.push({ symbol: d3.symbolCross, color: '#10b981', pos: 3 });
    }
    
    decorators.forEach(dec => {
      const angle = (dec.pos / 4) * 2 * Math.PI;
      const dist = baseSize / 2 + 8;
      const x = Math.cos(angle) * dist;
      const y = Math.sin(angle) * dist;
      
      glyph.append('path')
        .attr('d', d3.symbol().type(dec.symbol).size(20))
        .attr('transform', `translate(${x},${y})`)
        .attr('fill', dec.color)
        .attr('opacity', 0.9);
    });
    
    // ===== CAPA 5: MARCAS DE FRECUENCIA (CLM_FREQ) =====
    if (d.CLM_FREQ > 0) {
      for (let i = 0; i < Math.min(d.CLM_FREQ, 6); i++) {
        const angle = (i / 6) * 2 * Math.PI;
        const dist = baseSize / 2 + 1;
        glyph.append('circle')
          .attr('cx', Math.cos(angle) * dist)
          .attr('cy', Math.sin(angle) * dist)
          .attr('r', 1.5)
          .attr('fill', '#ffd700')
          .attr('stroke', '#000')
          .attr('stroke-width', 0.5);
      }
    }
    
    // ===== CAPA 6: INDICADOR CENTRAL (MSTATUS) =====
    if (d.MSTATUS === 'Yes') {
      glyph.append('circle')
        .attr('r', 2)
        .attr('fill', '#e11d48')
        .attr('opacity', 1);
    }
    
    // ===== CAPA 7: LÍNEAS RADIALES (CAR_USE) =====
    if (d.CAR_USE === 'Commercial') {
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * 2 * Math.PI;
        glyph.append('line')
          .attr('x1', 0)
          .attr('y1', 0)
          .attr('x2', Math.cos(angle) * baseSize / 3)
          .attr('y2', Math.sin(angle) * baseSize / 3)
          .attr('stroke', '#000')
          .attr('stroke-width', 0.5)
          .attr('opacity', 0.3);
      }
    }
  });
  
  // Animación de entrada
  glyphs
    .style('opacity', 0)
    .transition()
    .duration(500)
    .delay((d, i) => i * 2)
    .style('opacity', 1);
  
  console.log(`✅ RiskStar rendered with ${data.length} glyphs`);
}

// Tooltip
function showTooltip(event, d) {
  const tooltip = d3.select('#tooltip');
  
  const html = `
    <div class="tooltip-title">Cliente ${d.ID}</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:3px;font-size:11px;">
      <div><strong>Edad:</strong> ${d.AGE}</div>
      <div><strong>Género:</strong> ${d.GENDER}</div>
      <div><strong>Educación:</strong> ${d.EDUCATION}</div>
      <div><strong>Ocupación:</strong> ${d.OCCUPATION}</div>
      <div><strong>Ingreso:</strong> $${d3.format(',')(d.INCOME)}</div>
      <div><strong>Valor Casa:</strong> $${d3.format(',')(d.HOME_VAL)}</div>
      <div><strong>Valor Auto:</strong> $${d3.format(',')(d.BLUEBOOK)}</div>
      <div><strong>Edad Auto:</strong> ${d.CAR_AGE}</div>
      <div><strong>Tipo Auto:</strong> ${d.CAR_TYPE}</div>
      <div><strong>Auto Rojo:</strong> ${d.RED_CAR}</div>
      <div><strong>Uso Auto:</strong> ${d.CAR_USE}</div>
      <div><strong>Estado Civil:</strong> ${d.MSTATUS}</div>
      <div><strong>Padre:</strong> ${d.PARENT1}</div>
      <div><strong>Urbanicidad:</strong> ${d.URBANICITY}</div>
      <div><strong>Años Trabajo:</strong> ${d.YOJ}</div>
      <div><strong>Tiempo Aseg:</strong> ${d.TIF}</div>
      <div><strong>Tiempo Viaje:</strong> ${d.TRAVTIME} min</div>
      <div><strong>Niños Conducen:</strong> ${d.KIDSDRIV}</div>
      <div><strong>Niños Casa:</strong> ${d.HOMEKIDS}</div>
      <div><strong>Reclamo Previo:</strong> $${d3.format(',')(d.OLDCLAIM)}</div>
      <div><strong>Frec. Reclamos:</strong> ${d.CLM_FREQ}</div>
      <div><strong>Licencia Revocada:</strong> ${d.REVOKED}</div>
      <div><strong>Puntos MVR:</strong> ${d.MVR_PTS}</div>
      <div style="grid-column:1/-1;border-top:1px solid rgba(255,255,255,0.3);padding-top:5px;margin-top:5px;">
        <strong>RECLAMO:</strong> ${d.CLAIM_FLAG ? 'SÍ' : 'NO'}
        ${d.CLM_AMT > 0 ? `<br><strong>Monto:</strong> $${d3.format(',')(d.CLM_AMT)}` : ''}
      </div>
    </div>
  `;
  
  tooltip.html(html)
    .classed('visible', true)
    .style('left', (event.pageX + 15) + 'px')
    .style('top', (event.pageY - 15) + 'px');
}

function hideTooltip() {
  d3.select('#tooltip').classed('visible', false);
}

// Event listeners
function setupControls() {
  document.getElementById('sampleSize').addEventListener('change', function(e) {
    const size = parseInt(e.target.value);
    const sampled = sampleData(STATE.data, size);
    STATE.filteredData = sampled;
    createRiskStar(sampled);
  });
  
  document.getElementById('filterClaim').addEventListener('change', function(e) {
    const value = e.target.value;
    let filtered = STATE.data;
    
    if (value !== 'all') {
      const claimFlag = parseInt(value);
      filtered = STATE.data.filter(d => d.CLAIM_FLAG === claimFlag);
    }
    
    const size = parseInt(document.getElementById('sampleSize').value);
    const sampled = sampleData(filtered, size);
    STATE.filteredData = sampled;
    createRiskStar(sampled);
  });
  
  document.getElementById('resetBtn').addEventListener('click', function() {
    STATE.selectedId = null;
    document.getElementById('sampleSize').value = '100';
    document.getElementById('filterClaim').value = 'all';
    
    const sampled = sampleData(STATE.data, 100);
    STATE.filteredData = sampled;
    createRiskStar(sampled);
  });
}

// Resize handler
window.addEventListener('resize', () => {
  if (STATE.filteredData.length > 0) {
    createRiskStar(STATE.filteredData);
  }
});

// Inicializar
async function init() {
  console.log('🚀 Initializing RiskStar...');
  
  STATE.data = await loadData();
  
  if (STATE.data.length === 0) {
    alert('No se pudieron cargar los datos');
    return;
  }
  
  const sampled = sampleData(STATE.data, 100);
  STATE.filteredData = sampled;
  
  createRiskStar(sampled);
  setupControls();
  
  console.log('✅ RiskStar initialized');
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
