import { getLeads, sendJson } from "../_lib/leadsData.js";

const DEFAULT_STAGES = {
  "02 Open Green Form": 0,
  "Booking Done": 0,
  Retailed: 0,
  "Test Drive": 0,
  Lost: 0,
  None: 0
};

export default async function handler(req, res) {
  try {
    const leads = await getLeads();
    const stages = { ...DEFAULT_STAGES };

    leads.forEach((lead) => {
      const stage = lead.updated_sales_stage || "None";
      if (stages[stage] !== undefined) {
        stages[stage] += 1;
      } else {
        stages.None += 1;
      }
    });

    sendJson(res, stages);
  } catch (error) {
    sendJson(res, { error: "Failed to load funnel" }, 500);
  }
}
