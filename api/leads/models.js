import { getLeads, sendJson } from "../_lib/leadsData.js";

export default async function handler(req, res) {
  try {
    const leads = await getLeads();
    const models = {};

    leads.forEach((lead) => {
      const model = (lead.model || "Unknown").trim() || "Unknown";
      models[model] = (models[model] || 0) + 1;
    });

    sendJson(res, models);
  } catch (error) {
    sendJson(res, { error: "Failed to load model distribution" }, 500);
  }
}
