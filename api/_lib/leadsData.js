import fs from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";

let cachedRows = null;
let cacheTimestamp = 0;

function parseDateFlexible(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw) return null;

  const dmyMatch = raw.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (dmyMatch) {
    const [, dd, mm, yyyy] = dmyMatch;
    const dmyDate = new Date(`${yyyy}-${mm}-${dd}T00:00:00`);
    return Number.isNaN(dmyDate.getTime()) ? null : dmyDate;
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function getRowDate(row) {
  return (
    parseDateFlexible(row.updated_at) ||
    parseDateFlexible(row.created_at) ||
    parseDateFlexible(row.opty_created_date) ||
    parseDateFlexible(row.booking_date) ||
    parseDateFlexible(row.retail_date) ||
    null
  );
}

export async function getLeads() {
  const now = Date.now();
  if (cachedRows && now - cacheTimestamp < 15000) {
    return cachedRows;
  }

  const csvPath = path.join(process.cwd(), "public", "model_analysis.csv");
  const csvText = await fs.readFile(csvPath, "utf8");

  const parsed = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: true
  });

  cachedRows = Array.isArray(parsed.data) ? parsed.data : [];
  cacheTimestamp = now;

  return cachedRows;
}

export function getWeekOfYear(date) {
  const firstDay = new Date(date.getFullYear(), 0, 1);
  const dayOffset = Math.floor((date - firstDay) / 86400000);
  return Math.ceil((dayOffset + firstDay.getDay() + 1) / 7);
}

export function sendJson(res, data, status = 200) {
  res.status(status).json(data);
}
