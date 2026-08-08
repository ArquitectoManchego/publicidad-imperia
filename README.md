# Publicidad Imperia - Editor & Visualizador de Lonas Publicitarias

Aplicación de diseño gráfico y acotación a escala real especializada en la visualización de lonas publicitarias para fachadas e interiores de locales comerciales, con herramientas de edición vectoriales avanzadas estilo **Adobe Illustrator CC** e integración directa con la API de generación de imágenes de Google ("Nano Banana").

---

## 🌟 Características Principales

- 🎨 **Herramientas estilo Adobe Illustrator CC:**
  - Barra de alineación superior: izquierda, centro horizontal, derecha, arriba, medio vertical, base y distribución de espacio.
  - Atajos de teclado nativos: `Ctrl+2` (bloquear), `Ctrl+Alt+2` (desbloquear), `Ctrl+3` (ocultar), `Ctrl+Alt+3` (mostrar), `V`, `R`, `S`, `T`, `H`, `G`, `Supr`.
  - Ventana de Capas (Layers Tree) con alternadores de visibilidad (ojo), candado de bloqueo, reordenamiento de capas (Z-index) y borrado.
  - Tipografía con control de **Kerning/Tracking** (espaciado entre letras), interlineado y alineación de párrafos.

- 📐 **Acotación y Escala Real en Metros:**
  - Herramienta de Regla (S) para medir un elemento conocido en la foto (puerta, ventana, pared).
  - Cálculo automático de escala (píxeles por metro).
  - Medida real proyectada en tiempo real: Ancho (m), Alto (m) y Superficie (m²).

- 🤖 **Integración con Google Imagen API ("Nano Banana"):**
  - Generación de imágenes con Inteligencia Artificial especificando la relación de aspecto e hiper-resolución exacta del área de la lona seleccionada.
  - Inserción automática de la imagen resultante sobre la lona en el lienzo.

- 💾 **Persistencia Local y Briefing:**
  - Guardado y lectura de proyectos completos en formato `.json`.
  - Galería de fotos del local (fachadas exteriores e interiores).
  - Formulario de necesidades de publicidad e ideas visuales.

---

## 🚀 Instalación y Uso Local

```bash
# Clonar repositorio
git clone https://github.com/ArquitectoManchego/publicidad-imperia.git

# Entrar al directorio
cd publicidad-imperia

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm run dev
```

---

## 🔗 Enlaces

- **Repositorio en GitHub:** [https://github.com/ArquitectoManchego/publicidad-imperia](https://github.com/ArquitectoManchego/publicidad-imperia)
