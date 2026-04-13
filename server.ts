import express from "express";
import { createServer as createViteServer } from "vite";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { ImageAnnotatorClient } from "@google-cloud/vision";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ storage: multer.memoryStorage() });

let visionClient: ImageAnnotatorClient | null = null;

function getVisionClient() {
  if (!visionClient) {
    const credsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (credsJson) {
      try {
        const credentials = JSON.parse(credsJson);
        visionClient = new ImageAnnotatorClient({ credentials });
      } catch (e) {
        console.error("Failed to parse GOOGLE_APPLICATION_CREDENTIALS_JSON", e);
        throw new Error("Invalid Google Cloud credentials format.");
      }
    } else {
      // Fallback to default application credentials if they set GOOGLE_APPLICATION_CREDENTIALS file path
      visionClient = new ImageAnnotatorClient();
    }
  }
  return visionClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Object Detection
  app.post("/api/detect-objects", upload.single("image"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image provided" });
      }

      const client = getVisionClient();
      
      // Call Google Cloud Vision API for object localization
      const [result] = await client.objectLocalization({ 
        image: { content: req.file.buffer } 
      });
      
      const objects = result.localizedObjectAnnotations || [];

      // Map Google Vision response to our frontend format
      // Google Vision returns normalizedVertices (0.0 to 1.0)
      const mappedObjects = objects.map((obj, index) => {
        return {
          id: obj.mid || `obj_${index}`,
          name: obj.name,
          confidence: obj.score,
          boundingBox: {
            vertices: obj.boundingPoly?.normalizedVertices?.map(v => ({
              x: v.x || 0,
              y: v.y || 0
            })) || []
          }
        };
      });

      res.json({ objects: mappedObjects });
    } catch (error) {
      console.error("Error detecting objects:", error);
      res.status(500).json({ error: "Failed to process image. Please check your API credentials." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
