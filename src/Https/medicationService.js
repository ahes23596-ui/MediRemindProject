import AxiosWrapper from "./AxiosWrapper";

const normalizeList = (payload, preferredKeys = []) => {
  if (Array.isArray(payload)) return payload;

  for (const key of preferredKeys) {
    if (Array.isArray(payload?.[key])) {
      return payload[key];
    }
  }

  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;

  return [];
};

export const medicationService = {
  async getMedicines() {
    const { data } = await AxiosWrapper.get("/medicines");
    return normalizeList(data);
  },

  async addMedicine(payload) {
    const { data } = await AxiosWrapper.post("/medicines/create", payload);
    return data;
  },

  async deleteMedicine(medicineId) {
    return AxiosWrapper.delete(`/medicines/delete/${medicineId}`);
  },

  async markTaken(medicineId, time) {
    const { data } = await AxiosWrapper.post(`/medicines/mark-taken/${medicineId}`, { time });
    return data;
  },

  async getMissedDoses() {
    const { data } = await AxiosWrapper.get("/medicines/missed-doses");
    return normalizeList(data, ["missedDoses", "data"]);
  },

  async getRefillAlerts() {
    const { data } = await AxiosWrapper.get("/medicines/refill-alerts");
    return normalizeList(data, ["alerts", "refillAlerts", "data"]);
  },

  async getCalendarSchedule() {
    const { data } = await AxiosWrapper.get("/medicines/calendar");
    return normalizeList(data, ["schedule", "data"]);
  },
};

export default medicationService;
