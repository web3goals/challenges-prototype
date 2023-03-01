import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import { XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { useContext } from "react";
import { useAccount } from "wagmi";
import ChallengeShareDialog from "./ChallengeShareDialog";

/**
 * A component with challenge actions.
 */
export default function ChallengeActions(props: {
  id: string;
  creator: string;
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
      {!props.isFinalized && (
        <ChallengeFinalizeCloseButton id={props.id} creator={props.creator} />
      )}
      <ChallengeShareButton id={props.id} />
    </Stack>
  );
}

// TODO: Implement
function ChallengeFinalizeCloseButton(props: { id: string; creator: string }) {
  const { address } = useAccount();

  if (address === props.creator) {
    return (
      <XlLoadingButton variant="contained" onClick={() => {}}>
        Finalize
      </XlLoadingButton>
    );
  }

  return <></>;
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
