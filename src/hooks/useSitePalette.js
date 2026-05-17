import { useTheme } from "@mui/material/styles";
import { getDashboardTheme } from "../pages/DBShows/dashboardTheme";

export default function useSitePalette() {
  const theme = useTheme();
  return getDashboardTheme(theme.palette.mode === "dark");
}
