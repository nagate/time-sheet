import * as React from "react";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import Paper from "@mui/material/Paper";
import { FormatListBulleted, PunchClock, Settings } from "@mui/icons-material";
import { useRouter } from "next/navigation";

export default function NormalBottomNavigation() {
  const INDEX_INPUT = 0;
  const INDEX_LIST = 1;
  const INDEX_SETTINGS = 2;

  const router = useRouter();
  const [value, setValue] = React.useState(0);
  const ref = React.useRef<HTMLDivElement>(null);

  const handleChangeNav = (
    event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    setValue(value);
    if (value === INDEX_INPUT) {
      router.push("/home");
    } else if (value === INDEX_LIST) {
      router.push("/time-sheets/list");
    } else if (value === INDEX_SETTINGS) {
      router.push("/settings/list");
    }
  };

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <CssBaseline />
      <Paper
        sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation showLabels value={value} onChange={handleChangeNav}>
          <BottomNavigationAction label="入力" icon={<PunchClock />} />
          <BottomNavigationAction label="一覧" icon={<FormatListBulleted />} />
          <BottomNavigationAction label="設定" icon={<Settings />} />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
