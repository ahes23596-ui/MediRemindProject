import AxiosWrapper from "./AxiosWrapper";

const normalizeList = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const startOfDay = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const isSameDay = (firstDate, secondDate) =>
  firstDate.getFullYear() === secondDate.getFullYear() &&
  firstDate.getMonth() === secondDate.getMonth() &&
  firstDate.getDate() === secondDate.getDate();

export const occursOnDate = (reminder, selectedDate = new Date()) => {
  const targetDate = startOfDay(selectedDate);
  const createdDate = reminder?.createdAt ? startOfDay(reminder.createdAt) : startOfDay(new Date());
  const repeat = reminder?.repeat || "once";

  if (repeat === "daily") {
    return targetDate >= createdDate;
  }

  if (repeat === "weekly") {
    return targetDate >= createdDate && targetDate.getDay() === createdDate.getDay();
  }

  if (repeat === "monthly") {
    return targetDate >= createdDate && targetDate.getDate() === createdDate.getDate();
  }

  return isSameDay(targetDate, createdDate);
};

export const sortRemindersByTime = (reminders) =>
  [...reminders].sort((firstReminder, secondReminder) =>
    (firstReminder.time || "").localeCompare(secondReminder.time || "")
  );

export const reminderService = {
  async getReminders() {
    const { data } = await AxiosWrapper.get("/reminders");
    return normalizeList(data);
  },
};

export default reminderService;
