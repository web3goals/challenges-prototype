import { SxProps } from "@mui/material";
import { Stack } from "@mui/system";
import { XlLoadingButton, XxlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { challengeContractAbi } from "contracts/abi/challengeContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import { useContext, useEffect } from "react";
import { getChainId, getChallengeContractAddress } from "utils/chains";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import ChallengeShareDialog from "./ChallengeShareDialog";

/**
 * A component with challenge actions.
 */
export default function ChallengeActions(props: {
  id: string;
  creator: string;
  isFinalized: boolean;
  onSuccess?: Function;
  sx?: SxProps;
}) {
  const { address } = useAccount();

  return (
    <Stack
      direction="column"
      spacing={2}
      justifyContent="center"
      sx={{ ...props.sx }}
    >
      {!props.isFinalized && address === props.creator && (
        <ChallengeFinalizeCloseButton
          id={props.id}
          creator={props.creator}
          onSuccess={props.onSuccess}
        />
      )}
      <ChallengeShareButton id={props.id} />
    </Stack>
  );
}

function ChallengeFinalizeCloseButton(props: {
  id: string;
  creator: string;
  onSuccess?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getChallengeContractAddress(chain),
      abi: challengeContractAbi,
      functionName: "finalize",
      args: [BigNumber.from(props.id)],
      chainId: getChainId(chain),
    });
  const {
    data: contractWriteData,
    isLoading: isContractWriteLoading,
    write: contractWrite,
  } = useContractWrite(contractPrepareConfig);
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } =
    useWaitForTransaction({
      hash: contractWriteData?.hash,
    });

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("The challenge is finalized!");
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  return (
    <XxlLoadingButton
      variant="contained"
      type="submit"
      disabled={isContractPrepareError || !contractWrite}
      loading={isContractWriteLoading || isTransactionLoading}
      onClick={() => contractWrite?.()}
    >
      Finalize
    </XxlLoadingButton>
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
