import { Box, SxProps, Typography, Link as MuiLink } from "@mui/material";
import { Stack } from "@mui/system";
import { XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { useContext, useEffect, useState } from "react";
import { addressToShortAddress } from "utils/converters";
import { useAccount } from "wagmi";
import ChallengeCompleteDialog from "./ChallengeCompleteDialog";
import ChallengeParticipateDialog from "./ChallengeParticipateDialog";

/**
 * A component with challenge participants.
 */
export default function ChallengeParticipants(props: {
  id: string;
  creator: string;
  isFinalized: boolean;
  participants: readonly any[];
  onUpdate?: Function;
  sx?: SxProps;
}) {
  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        ...props.sx,
      }}
    >
      {/* Title */}
      <Typography variant="h4" fontWeight={700} textAlign="center">
        👥 Participants
      </Typography>
      {/* Actions */}
      <ChallengeParticipantActions
        id={props.id}
        isFinalized={props.isFinalized}
        participants={props.participants}
        onSuccess={props.onUpdate}
        sx={{ mt: 4 }}
      />
      {/* List with participants */}
      {props.participants.length > 0 && (
        <Stack spacing={2} mt={4} width={1}>
          {props.participants.map((participant, index) => (
            <ChallengeParticipantCard
              key={index}
              accountAddress={participant.accountAddress}
              handle={participant.handle}
              isChallengeCompleted={participant.isChallengeCompleted}
              isPrizeReceived={participant.isPrizeReceived}
            />
          ))}
        </Stack>
      )}
      {/* Empty list */}
      {props.participants.length === 0 && (
        <Typography textAlign="center" mt={4}>
          no participants
        </Typography>
      )}
    </Box>
  );
}

function ChallengeParticipantActions(props: {
  id: string;
  isFinalized: boolean;
  participants: readonly any[];
  onSuccess?: Function;
  sx?: SxProps;
}) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { address } = useAccount();
  const [isParticipant, setIsParticipant] = useState(false);
  const [isCompletedChallenge, setIsCompletedChallenge] = useState(false);

  useEffect(() => {
    setIsParticipant(false);
    setIsCompletedChallenge(false);
    for (const participant of props.participants) {
      if (address === participant.accountAddress) {
        setIsParticipant(true);
        if (participant.isChallengeCompleted) {
          setIsCompletedChallenge(true);
        }
      }
    }
  }, [address, props.participants]);

  if (!props.isFinalized && !isParticipant) {
    return (
      <XlLoadingButton
        variant="contained"
        onClick={() =>
          showDialog?.(
            <ChallengeParticipateDialog
              id={props.id}
              onSuccess={props.onSuccess}
              onClose={closeDialog}
            />
          )
        }
        sx={{ ...props.sx }}
      >
        Participate
      </XlLoadingButton>
    );
  }

  if (!props.isFinalized && !isCompletedChallenge) {
    return (
      <XlLoadingButton
        variant="contained"
        onClick={() =>
          showDialog?.(
            <ChallengeCompleteDialog
              id={props.id}
              onSuccess={props.onSuccess}
              onClose={closeDialog}
            />
          )
        }
        sx={{ ...props.sx }}
      >
        Complete
      </XlLoadingButton>
    );
  }

  return <></>;
}

function ChallengeParticipantCard(props: {
  accountAddress: string;
  handle: string;
  isChallengeCompleted: boolean;
  isPrizeReceived: boolean;
  sx?: SxProps;
}) {
  return (
    <Box
      sx={{
        border: "solid",
        borderColor: "divider",
        borderWidth: 6,
        borderRadius: 2,
        py: 2,
        px: 4,
        ...props.sx,
      }}
    >
      {/* Account */}
      <Typography gutterBottom>
        👤{" "}
        <MuiLink href={`/accounts/${props.accountAddress}`} fontWeight={700}>
          {addressToShortAddress(props.accountAddress)}
        </MuiLink>
      </Typography>
      {/* Handle */}
      <Typography gutterBottom>
        🐤{" "}
        <MuiLink href={`https://twitter.com/${props.handle}`} target="_blank">
          @{props.handle}
        </MuiLink>
      </Typography>
      {/* Competion */}
      {props.isChallengeCompleted && (
        <Typography gutterBottom>✅ Challenge is completed</Typography>
      )}
      {/* Prize */}
      {props.isPrizeReceived && (
        <Typography gutterBottom>💰 Prize is received</Typography>
      )}
    </Box>
  );
}
