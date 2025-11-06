import express from "express";
import cors from "cors";
import testRoutes from "./routes/test.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("API funcionando");
});

// Montar las rutas del test
app.use("/api/test", testRoutes);

app.listen(4000, () => {
  console.log("Servidor corriendo en http://localhost:4000");
});
