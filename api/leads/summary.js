import { getLeads, sendJson } from "../_lib/leadsData.js";

export default async function handler(req, res) {
  try {
    const leads = await getLeads();

    const total = leads.length;
    const hot = leads.filter((l) => l.lead_classification_status === "Hot").length;
    const warm = leads.filter((l) => l.lead_classification_status === "Warm").length;
    const bookings = leads.filter((l) => l.updated_sales_stage === "Booking Done").length;
    const retailed = leads.filter((l) => l.updated_sales_stage === "Retailed").length;

    sendJson(res, { total, hot, warm, bookings, retailed });
  } catch (error) {
    sendJson(res, { error: "Failed to load summary" }, 500);
  }
}
