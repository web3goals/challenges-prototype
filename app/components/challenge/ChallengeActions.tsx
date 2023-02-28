import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import { XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { BigNumber } from "ethers";
import { useContext } from "react";
import ChallengeShareDialog from "./ChallengeShareDialog";

/**
 * A component with challenge actions.
 */
export default function ChallengeActions(props: {
  id: string;
  isFinalized: boolean;
  sx?: SxProps;
}) {
  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      sx={{ ...props.sx }}
    >
      {!props.isFinalized && <ChallengeFinalizeCloseButton id={props.id} />}
      <ChallengeShareButton id={props.id} />
    </Stack>
  );
}

// TODO: Implement
// TODO: Display only for creator
function ChallengeFinalizeCloseButton(props: { id: string }) {
  return (
    <XlLoadingButton variant="contained" onClick={() => {}}>
      Finalize
    </XlLoadingButton>
  );
}

function ChallengeShareButton(props: { id: string }) {
  const { showDialog, closeDialog } = useContext(DialogContext);

  return (
    <XlLoadingButton
      variant="outlined"
      onClick={() =>
        showDialog?.(
          <ChallengeShareDialog id={props.id} onClose={closeDialog} />
        )
      }
    >
      Share
    </XlLoadingButton>
  );
}
