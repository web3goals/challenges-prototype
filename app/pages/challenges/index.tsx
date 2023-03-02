import { Typography } from "@mui/material";
import ChallengeList from "components/challenge/ChallengeList";
import Layout from "components/layout";
import { CentralizedBox } from "components/styled";

/**
 * Page with challenges.
 */
export default function Challenges() {
  return (
    <Layout>
      <CentralizedBox>
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          sx={{ mb: 4 }}
        >
          🏆 Last challenges
        </Typography>
        <ChallengeList />
      </CentralizedBox>
    </Layout>
  );
}
