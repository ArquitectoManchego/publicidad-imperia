/**
 * Google Imagen API ("Nano Banana" Engine) integration
 */

const IMAGEN_MODELS = [
  'imagen-3.0-generate-002',
  'imagen-4.0-generate-001',
  'imagen-4.0-fast-generate-001',
  'imagen-3.0-fast-generate-001'
];

export async function generateImagenDesign({
  apiKey,
  prompt,
  widthRatio = 16,
  heightRatio = 9,
  style = 'fotorrealista',
  lonaRealWidthMeters = 0,
  lonaRealHeightMeters = 0,
}) {
  if (!apiKey) {
    throw new Error('Debes ingresar tu Google API Key en el panel de Nano Banana para generar la imagen con la IA de Google.');
  }

  // Calculate best matching Google Imagen aspect ratio string
  const ratio = widthRatio / heightRatio;
  let aspectRatio = '1:1';
  if (ratio > 1.4) aspectRatio = '16:9';
  else if (ratio < 0.7) aspectRatio = '9:16';
  else if (ratio > 1.1) aspectRatio = '4:3';
  else if (ratio < 0.9) aspectRatio = '3:4';

  const fullPrompt = `Diseño profesional de lona publicitaria para fachada comercial exterior. Medidas reales: ${lonaRealWidthMeters}m x ${lonaRealHeightMeters}m. Estilo: ${style}. Detalles del diseño: ${prompt}. Formato limpio, alta resolución, colores vibrantes sin distorsión tipográfica.`;

  let lastError = null;

  // Try available models sequentially
  for (const modelName of IMAGEN_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:predict?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [
              {
                prompt: fullPrompt,
              },
            ],
            parameters: {
              sampleCount: 1,
              aspectRatio: aspectRatio,
              outputMimeType: 'image/png',
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.predictions && data.predictions[0] && data.predictions[0].bytesBase64Encoded) {
          return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        }
      } else {
        const errText = await response.text();
        lastError = `Modelo ${modelName} (${response.status}): ${errText}`;
      }
    } catch (err) {
      lastError = err.message;
    }
  }

  throw new Error(`Error en la API de Google Imagen: ${lastError || 'No se pudo conectar con los modelos de imagen de Google.'}`);
}
