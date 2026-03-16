import { getLeads, getRowDate, getWeekOfYear, sendJson } from "../_lib/leadsData.js";

export default async function handler(req, res) {
  try {
    const weeks = Number.parseInt(req.query?.weeks || "8", 10);
    const safeWeeks = Number.isNaN(weeks) ? 8 : Math.max(1, Math.min(weeks, 26));

    const leads = await getLeads();
    const weekly = {};

    leads.forEach((lead) => {
      const date = getRowDate(lead);
      if (!date) return;

      const year = date.getFullYear();
      const week = getWeekOfYear(date);
      const key = `${year}-W${String(week).padStart(2, "0")}`;

      if (!weekly[key]) {
        weekly[key] = {
          label: key,
          timestamp: date.getTime(),
          Hot: 0,
          Warm: 0
        };
      }

      if (lead.lead_classification_status === "Hot") weekly[key].Hot += 1;
      if (lead.lead_classification_status === "Warm") weekly[key].Warm += 1;
    });

    const series = Object.values(weekly)
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-safeWeeks);

    sendJson(res, series);
  } catch (error) {
    sendJson(res, { error: "Failed to load velocity" }, 500);
  }
}
