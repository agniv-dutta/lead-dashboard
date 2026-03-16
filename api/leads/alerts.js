import { getLeads, getRowDate, sendJson } from "../_lib/leadsData.js";

export default async function handler(req, res) {
  try {
    const leads = await getLeads();
    const now = Date.now();
    const thresholdMs = 48 * 60 * 60 * 1000;

    const alerts = leads
      .filter((lead) => lead.lead_classification_status === "Hot")
      .map((lead) => ({
        lead,
        lastContact: getRowDate(lead)?.getTime() || 0
      }))
      .filter((item) => now - item.lastContact > thresholdMs)
      .sort((a, b) => b.lastContact - a.lastContact)
      .slice(0, 6)
      .map(({ lead }) => ({
        message: `Hot lead on ${lead.model || "model"} - no contact in 48h`,
        customer: lead.customer_name,
        phone: lead.phone_number,
        model: lead.model
      }));

    sendJson(res, alerts);
  } catch (error) {
    sendJson(res, { error: "Failed to load alerts" }, 500);
  }
}
