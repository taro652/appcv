import { GoogleGenAI } from "@google/genai";
import express from 'express';
import cors from 'cors'; // Necesario para permitir que el frontend se comunique con el backend


const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

async function mainIa(cv) {
  try {
    const interaction = await ai.interactions.create({
      model: "gemini-3.5-flash",
      input: `
        Sos un experto en reclutamiento y orientación laboral. 
        Analizá el siguiente currículum y determiná sus mejores salidas laborales.

        RESTRICCIONES DE FORMATO OBLIGATORIAS:
        1. Respondé SÓLO con código HTML válido. No uses bloques de código con tres comillas (\`\`\`html). Empezá directo con las etiquetas.
        2. Usá exactamente la estructura de etiquetas que se detalla abajo.
        3. No agregues introducciones ni conclusiones. Ir directo al grano.
        4. Si falta información para alguna sección, completá con "No especificado en el CV".

        ESTRUCTURA REQUERIDA:
        <h3>🎯 Perfil Profesional Resumido</h3>
        <p>[Escribí acá un resumen de 3 líneas sobre el perfil del candidato]</p>

        <h3>🚀 Top 3 Salidas Laborales</h3>
        <ul>
          <li><strong>[Nombre del Rol 1]:</strong> [Explicación corta de por qué aplica y en qué industrias].</li>
          <li><strong>[Nombre del Rol 2]:</strong> [Explicación corta de por qué aplica y en qué industrias].</li>
          <li><strong>[Nombre del Rol 3]:</strong> [Explicación corta de por qué aplica y en qué industrias].</li>
        </ul>

        <h3>🛠️ Brecha de Habilidades (Qué le falta)</h3>
        <ul>
          <li>[Mencioná una tecnología, habilidad blanda o certificación que debería adquirir].</li>
          <li>[Mencioná otra].</li>
        </ul>

        <h3>💡 Consejos para el CV</h3>
        <ul>
          <li>[Un consejo técnico o de redacción para mejorar este perfil específico].</li>
        </ul>

        <hr>
        Currículum a analizar:
        ${cv}
      `,
    });

    return interaction.output_text;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/**/

const app = express();
app.use(express.json()); // Permite que el backend entienda el formato JSON recibido
app.use(cors());         // Habilita llamadas desde otros puertos (ej: desde el puerto de Vite)

// Escuchamos la ruta que definió el frontend
app.post('/api/datos', async (req, res) => {
    try {
      // 1. Recibimos la variable del frontend
      const cv = req.body.variableTexto; 
      // console.log("Texto recibido del cliente:", cv);

      // 2. Aquí procesarías el texto con tu API de IA...
      const respuestaDeLaIA = await mainIa(cv);

      // 3. Enviamos la variable de vuelta al frontend
      res.json({ devolucion: respuestaDeLaIA });
    } catch (err) {
      res.status(500).json({err: "Error interno al procesar el currículum con la IA."})
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor corriendo en el puerto ${PORT}"));