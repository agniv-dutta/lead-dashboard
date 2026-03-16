import { getLeads, getRowDate, sendJson } from "../_lib/leadsData.js";

function keyForDate(date, period) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (period === "quarterly") {
    const quarter = Math.ceil(month / 3);
    return `${year}-Q${quarter}`;
  }

  return `${year}-${String(month).padStart(2, "0")}`;
}

export default async function handler(req, res) {
  try {
    const period = req.query?.period === "quarterly" ? "quarterly" : "monthly";
    const leads = await getLeads();
    const grouped = {};

    leads.forEach((lead) => {
      const date = getRowDate(lead);
      if (!date) return;

      const key = keyForDate(date, period);
      if (!grouped[key]) grouped[key] = { Hot: 0, Warm: 0, Cold: 0 };

      const status = lead.lead_classification_status;
      if (grouped[key][status] !== undefined) {
        grouped[key][status] += 1;
      }
    });

    const ordered = Object.keys(grouped)
      .sort()
      .reduce((acc, key) => {
        acc[key] = grouped[key];
        return acc;
      }, {});

    sendJson(res, ordered);
  } catch (error) {
    sendJson(res, { error: "Failed to load trend" }, 500);
  }
}
