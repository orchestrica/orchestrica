"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const agents_1 = __importDefault(require("../routes/agents"));
const memory_1 = __importDefault(require("../routes/memory"));
const logger_1 = require("../utils/logger");
dotenv_1.default.config();
const swaggerSpec = (0, swagger_jsdoc_1.default)({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Orca API Server API",
            version: "0.1.0",
        },
    },
    apis: ["./src/routes/*.ts"],
});
function startServer() {
    const app = (0, express_1.default)();
    const port = process.env.PORT || 8080;
    app.use(express_1.default.json());
    app.use("/agents", agents_1.default);
    app.use("/memory", memory_1.default);
    app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerSpec));
    app.get("/openapi.json", (_req, res) => {
        res.setHeader("Content-Type", "application/json");
        res.send(swaggerSpec);
    });
    app.listen(port, () => {
        logger_1.logger.info(`API Server running on port ${port}`);
    });
}
