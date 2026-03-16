import { getLeads, sendJson } from "../_lib/leadsData.js";

export default async function handler(req, res) {
  try {
    const leads = await getLeads();
    const pinStats = {};

    leads.forEach((lead) => {
      const pin = String(lead.pin_code || "").trim();
      if (!pin) return;

      if (!pinStats[pin]) {
        pinStats[pin] = { total: 0, hot: 0, cold: 0 };
      }

      pinStats[pin].total += 1;
      if (lead.lead_classification_status === "Hot") pinStats[pin].hot += 1;
      if (lead.lead_classification_status === "Cold") pinStats[pin].cold += 1;
    });

    const rows = Object.entries(pinStats).map(([pin, stats]) => ({
      pin,
      total: stats.total,
      hot: stats.hot,
      cold: stats.cold,
      hotRatio: stats.total ? stats.hot / stats.total : 0,
      coldRatio: stats.total ? stats.cold / stats.total : 0
    }));

    const top = [...rows]
      .sort((a, b) => b.hotRatio - a.hotRatio || b.total - a.total)
      .slice(0, 5);

    const bottom = [...rows]
      .sort((a, b) => b.coldRatio - a.coldRatio || b.total - a.total)
      .slice(0, 5);

    sendJson(res, { top, bottom });
  } catch (error) {
    sendJson(res, { error: "Failed to load pincode stats" }, 500);
  }
}
