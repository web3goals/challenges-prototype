import { TabContext, TabList, TabPanel } from "@mui/lab";
import { SxProps, Tab } from "@mui/material";
import { Box } from "@mui/system";
import ChallengeList from "components/challenge/ChallengeList";
import { useState } from "react";

/**
 * A component with tabs with account challenges.
 */
export default function AccountChallenges(props: {
  address: string;
  sx?: SxProps;
}) {
  const [tabValue, setTabValue] = useState("1");

  function handleChange(_: any, newTabValue: any) {
    setTabValue(newTabValue);
  }

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      <TabContext value={tabValue}>
        <TabList
          centered
          onChange={handleChange}
          sx={{
            borderBottom: 1,
            borderColor: "divider",
            mb: 1,
          }}
        >
          <Tab label="Started" value="1" />
          <Tab label="Participation" value="2" />
        </TabList>
        <TabPanel value="1" sx={{ px: 0 }}>
          <ChallengeList creator={props.address} />
        </TabPanel>
        <TabPanel value="2" sx={{ px: 0 }}>
          <ChallengeList participant={props.address} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
