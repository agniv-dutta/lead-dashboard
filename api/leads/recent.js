import { getLeads, getRowDate, sendJson } from "../_lib/leadsData.js";

export default async function handler(req, res) {
  try {
    const limit = Number.parseInt(req.query?.limit || "7", 10);
    const safeLimit = Number.isNaN(limit) ? 7 : Math.max(1, Math.min(limit, 50));

    const leads = await getLeads();
    const sorted = [...leads].sort((a, b) => {
      const da = getRowDate(a)?.getTime() || 0;
      const db = getRowDate(b)?.getTime() || 0;
      return db - da;
    });

    sendJson(res, sorted.slice(0, safeLimit));
  } catch (error) {
    sendJson(res, { error: "Failed to load recent leads" }, 500);
  }
}
