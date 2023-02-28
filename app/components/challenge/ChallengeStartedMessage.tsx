import { Typography } from "@mui/material";
import { CentralizedBox, ThickDivider } from "components/styled";
import ChallengeShareActions from "./ChallengeShareActions";

/**
 * A component with message that challenge is started.
 */
export default function ChallengeStartedMessage(props: { id: string }) {
  return (
    <CentralizedBox>
      <Typography variant="h4" textAlign="center" fontWeight={700}>
        🤟 Congrats, you started a challenge!
      </Typography>
      <ThickDivider sx={{ mt: 5 }} />
      <ChallengeShareActions id={props.id} sx={{ mt: 6 }} />
    </CentralizedBox>
  );
}
