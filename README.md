# ⭐ RiskStar

**Nueva Metáfora Visual para Análisis de Riesgo en Seguros de Autos**

---

## Descripción

**RiskStar** es una nueva metáfora visual que combina **Star Coordinates** con **Glyphs metafóricos** para visualizar datos multidimensionales mixtos del dominio de seguros de autos. 

Esta visualización integra múltiples dimensiones en **UN SOLO GRÁFICO INTERACTIVO**, utilizando características visuales para codificar diferentes atributos de los clientes.

---

## Características Visuales que Codifican Datos

Según lo solicitado por el profesor, la metáfora utiliza:

### 1. **Posición** (Ejes Radiales - Star Coordinates)
Cada cliente se posiciona en el espacio 2D basándose en 6 dimensiones numéricas proyectadas en ejes radiales:
- **Edad** (AGE)
- **Ingreso** (INCOME)
- **Valor de Casa** (HOME_VAL)
- **Valor del Auto** (BLUEBOOK)
- **Frecuencia de Reclamos** (CLM_FREQ)
- **Puntos MVR** (MVR_PTS)

**Inspiración:** Hinted Star Coordinates (Matute & Linsen, 2019)

### 2. **Color**
- 🟢 **Verde**: Cliente sin reclamo (CLAIM_FLAG = 0)
- 🔴 **Rojo**: Cliente con reclamo (CLAIM_FLAG = 1)

### 3. **Tamaño**
El tamaño de cada glyph es proporcional al **monto del reclamo** (CLM_AMT):
- Glyphs pequeños: reclamos menores o sin reclamo
- Glyphs grandes: reclamos con montos altos

### 4. **Forma**
La forma del glyph codifica el **género** del cliente:
- ○ **Círculo**: Femenino
- □ **Cuadrado**: Masculino

**Inspiración:** MetaGlyph (Ying et al., 2022)

### 5. **Decoración Adicional**
- **Puntos dorados alrededor**: Número de reclamos previos (CLM_FREQ)
- **Triángulo rojo arriba**: Alto riesgo (MVR_PTS > 5)

### 6. **Interactividad** (Movimiento)
- **Hover**: Highlight + tooltip con detalles del cliente
- **Click**: Selección de cliente (otros se desvanecen)
- **Animación de entrada**: Transición suave al cargar

---

##  Innovación

### ¿Qué hace única a RiskStar?

1. **Proyección Star Coordinates para Datos Mixtos**
   - Adapta Star Coordinates (típicamente para datos numéricos) para trabajar con datos mixtos
   - Los ejes radiales muestran variables numéricas clave

2. **Glyphs Compuestos con Semántica de Seguros**
   - No son glyphs genéricos, están diseñados específicamente para el dominio de seguros
   - Codifican múltiples atributos en un solo elemento visual

3. **Codificación Multi-Atributo**
   - **6 variables numéricas** → Posición en ejes radiales
   - **1 variable objetivo** → Color
   - **1 variable cuantitativa** → Tamaño
   - **1 variable categórica** → Forma
   - **2 variables de riesgo** → Decoradores

4. **Escalabilidad Visual**
   - Permite visualizar hasta 500 registros sin saturación
   - Sampleo estratificado para mantener proporciones

---

## Cómo Usar

### Requisitos
- Navegador moderno (Chrome, Firefox, Safari)
- Servidor web local

### Instalación y Ejecución

1. **Abrir terminal:**
```bash
cd "/(carpeta del proyecto)"
```

2. **Iniciar servidor:**
```bash
# Con Node.js
node ../(carpeta del projecto)/server.js

# O con Python
python3 -m http.server 8000
```

3. **Abrir navegador:**
```
http://localhost:8000
```

---

## Interacciones

### Controles
- **Muestra de datos**: Selecciona cuántos registros visualizar (50-500)
- **Filtrar por Claim**: Muestra solo clientes con/sin reclamo
- **Resetear Vista**: Vuelve a la configuración inicial

### Mouse
- **Hover sobre glyph**: Ver detalles del cliente en tooltip
- **Click en glyph**: Seleccionar/deseleccionar cliente
- **Click en espacio vacío**: Deseleccionar

---

## 📊 Interpretación

### Patrones Visuales

**Clusters Centrales**
- Clientes con valores promedio en todas las dimensiones
- Perfiles de riesgo medio

**Glyphs en Extremos**
- Valores altos/bajos en alguna dimensión específica
- Perfiles atípicos o de alto riesgo

**Concentración de Color Rojo**
- Áreas con alta tasa de reclamos
- Identificación de segmentos problemáticos

**Glyphs Grandes**
- Reclamos con montos altos
- Clientes que generan mayor costo

**Triángulos Rojos**
- Clientes con historial de infracciones (MVR_PTS > 5)
- Alto riesgo de futuros reclamos

**Puntos Dorados**
- Clientes con historial de reclamos
- Frecuencia de incidentes

---

##  Preguntas Analíticas que Responde

1. **¿Qué perfiles de clientes tienen mayor probabilidad de reclamo?**
   - Observar clusters de glyphs rojos

2. **¿El monto del reclamo se correlaciona con otras variables?**
   - Ver si glyphs grandes se concentran en ciertas regiones

3. **¿Género influye en el riesgo?**
   - Comparar distribución de círculos vs cuadrados en áreas de riesgo

4. **¿Clientes con reclamos previos vuelven a reclamar?**
   - Buscar glyphs rojos con puntos dorados

5. **¿Valores altos de ingresos/auto implican menor riesgo?**
   - Analizar glyphs en extremos de ejes específicos

---

## 🔗 Referencias Académicas

### Papers que Inspiraron RiskStar

1. **Matute, J., & Linsen, L. (2019).**  
   *Hinted Star Coordinates for Mixed Data.*  
   Computer Graphics Forum, 38(3), 117-128.
   - **Aporte:** Estructura radial con ejes para datos mixtos

2. **Ying, Y., et al. (2022).**  
   *MetaGlyph: Automatic Generation of Metaphoric Glyph-based Visualization.*  
   IEEE VIS.
   - **Aporte:** Diseño de glyphs compuestos con semántica de dominio

3. **Wang, Y., et al. (2022).**  
   *Set-Stat-Map: Extending Parallel Coordinates for Visualizing Mixed Data.*  
   IEEE VIS.
   - **Comparación:** RiskStar usa proyección radial en lugar de paralela

---

##  Innovación vs Estado del Arte

| Característica | Star Coordinates Clásicas | RiskStar |
|----------------|---------------------------|----------|
| Tipo de datos | Solo numéricos | Mixtos (num + cat) |
| Codificación visual | Posición + color | Posición + color + tamaño + forma |
| Dominio | Genérico | Seguros de autos |
| Glyphs | Puntos simples | Glyphs compuestos con decoradores |
| Interactividad | Básica | Tooltips + selección + filtros |

---

## 📁 Estructura de Archivos

```
IMPLEMENTACION_V2/
├── index.html          # Estructura HTML y estilos CSS
├── riskstar.js         # Lógica de la metáfora visual en D3.js
├── README.md           # Este archivo
└── server.js           # (Opcional) Servidor Node.js
```

---

## ⚙️ Detalles Técnicos

### Tecnologías
- **D3.js v7**: Biblioteca de visualización
- **JavaScript ES6+**: Lógica de aplicación
- **CSS3**: Estilos y animaciones
- **SVG**: Gráficos vectoriales escalables

### Algoritmo de Proyección

```javascript
function calculatePosition(record) {
  let x = 0, y = 0;
  
  axes.forEach((axis, i) => {
    const angle = i * (2π / numAxes) - π/2;
    const normalizedValue = scale(record[axis]);
    x += cos(angle) * normalizedValue;
    y += sin(angle) * normalizedValue;
  });
  
  return { x, y };
}
```

### Normalización
- Cada eje usa `d3.scaleLinear()` para normalizar valores al rango [0, radius]
- Implementa `.nice()` para redondear dominios

### Performance
- Sampleo para mantener < 500 glyphs visibles
- Animaciones con `d3.transition()` para suavidad
- Event delegation para eficiencia

---

## 🎓 Aplicación en el Dominio

### Caso de Uso: Análisis de Riesgo

Un analista de seguros puede usar RiskStar para:

1. **Identificar Perfiles de Alto Riesgo**
   - Glyphs rojos + grandes + con triángulos

2. **Segmentación de Clientes**
   - Clusters visuales indican segmentos naturales

3. **Predicción de Reclamos**
   - Nuevos clientes se proyectan en RiskStar
   - Su posición indica riesgo basado en clientes similares

4. **Optimización de Primas**
   - Ajustar precios según región de riesgo en RiskStar

---

## 🐛 Limitaciones

1. **Oclusión con > 500 glyphs**
   - Solución: Sampleo o agregación

2. **Interpretación requiere entrenamiento**
   - No es tan intuitivo como bar charts
   - Necesita leyenda y tutorial

3. **Proyección 2D pierde información**
   - 6 dimensiones → 2D implica pérdida
   - Se prioriza exploración sobre precisión

---

## 🔮 Trabajo Futuro

- [ ] Algoritmo de "hints" para sugerir mejor configuración de ejes
- [ ] Drag & drop de ejes para reconfigurar
- [ ] Clustering automático (K-means) con overlay
- [ ] Exportar imagen SVG/PNG
- [ ] Panel de comparación de segmentos

---

## 👨‍💻 Autor

**Jeferson Apaza**  
Maestría en Ciencia de Datos  
Curso: Visualización de Datos  
Fecha: Junio 2026

---

## 📄 Licencia

Material académico del curso de Visualización de Datos.

---

