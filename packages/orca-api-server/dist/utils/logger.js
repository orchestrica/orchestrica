"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (msg) => console.log("[INFO]", msg),
    error: (msg) => console.error("[ERROR]", msg),
};
