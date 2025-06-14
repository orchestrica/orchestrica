import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

import agentRoutes from "../routes/agents";
import memoryRoutes from "../routes/memory";
import { logger } from "../utils/logger";

dotenv.config();

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Orca MCP Server API",
      version: "0.1.0",
    },
  },
  apis: ["./src/routes/*.ts"],
});

export function startServer() {
  const app = express();
  const port = process.env.PORT || 8080;

  app.use(express.json());
  app.use("/agents", agentRoutes);
  app.use("/memory", memoryRoutes);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.listen(port, () => {
    logger.info(`MCP Server running on port ${port}`);
  });
}
