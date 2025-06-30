/**
 * @openapi
 * components:
 *   schemas:
 *     AgentInfo:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - status
 *         - registeredAt
 *         - endpoint
 *         - functions
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         status:
 *           type: string
 *           enum: [idle, busy, error]
 *         registeredAt:
 *           type: string
 *         endpoint:
 *           type: string
 *           description: JSON-RPC A2A endpoint
 *         functions:
 *           type: array
 *           items:
 *             type: string
 *           description: 기능 목록 (e.g. "summarize", "classify")
 *         description:
 *           type: string
 *         templateId:
 *           type: string
 *         systemPrompt:
 *           type: string
 *         chatHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, assistant, system]
 *               content:
 *                 type: string
 */
export interface AgentInfo {
  id: string;
  name: string;
  status: "idle" | "busy" | "error";
  registeredAt: string;
  functions: string[];
  description?: string;
  templateId?: string;
  systemPrompt?: string;
  chatHistory?: {
    role: "user" | "assistant" | "system";
    content: string;
  }[];
}
