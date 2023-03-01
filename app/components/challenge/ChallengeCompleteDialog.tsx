import { Dialog, DialogContent, SxProps, Typography } from "@mui/material";
import {
  FullWidthSkeleton,
  WidgetSeparatorText,
  XxlLoadingButton,
} from "components/styled";
import { challengeContractAbi } from "contracts/abi/challengeContract";
import { BigNumber } from "ethers";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { getChainId, getChallengeContractAddress } from "utils/chains";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";

/**
 * Dialog to complete challenge.
 */
export default function ChallengeCompleteDialog(props: {
  id: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { address } = useAccount();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // State of contract reading to get challenge completion status
  const {
    data: isChallengeCompleted,
    isFetching: isChallengeCompletedFetching,
  } = useContractRead({
    address: getChallengeContractAddress(chain),
    abi: challengeContractAbi,
    functionName: "isChallengeCompleted",
    args: [BigNumber.from(props.id)],
    overrides: { from: address },
  });

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>
          ✅ Completion
        </Typography>
        {!isChallengeCompletedFetching ? (
          isChallengeCompleted ? (
            <ChallengeCompleteForm
              id={props.id}
              onSuccess={() => {
                close();
                props.onSuccess?.();
              }}
            />
          ) : (
            <ChallengeVerifyForm
              id={props.id}
              onSuccess={() => {
                close();
                props.onSuccess?.();
              }}
            />
          )
        ) : (
          <FullWidthSkeleton />
        )}
      </DialogContent>
    </Dialog>
  );
}

function ChallengeVerifyForm(props: { id: string; onSuccess?: Function }) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getChallengeContractAddress(chain),
      abi: challengeContractAbi,
      functionName: "verify",
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
      showToastSuccess(
        "The verification will be completed soon, try to complete the challenge later"
      );
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  return (
    <>
      <WidgetSeparatorText>
        verify twitter activity before marking the challenge as completed
      </WidgetSeparatorText>
      <XxlLoadingButton
        variant="contained"
        type="submit"
        disabled={isContractPrepareError || !contractWrite}
        loading={isContractWriteLoading || isTransactionLoading}
        onClick={() => contractWrite?.()}
        sx={{ mt: 3 }}
      >
        Verify
      </XxlLoadingButton>
    </>
  );
}

function ChallengeCompleteForm(props: { id: string; onSuccess?: Function }) {
  const { chain } = useNetwork();
  const { showToastSuccess } = useToasts();

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getChallengeContractAddress(chain),
      abi: challengeContractAbi,
      functionName: "complete",
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
      showToastSuccess("Challenge is completed!");
      props.onSuccess?.();
    }
  }, [isTransactionSuccess]);

  return (
    <>
      <WidgetSeparatorText>
        twitter activity verified, now you can complete the challenge
      </WidgetSeparatorText>
      <XxlLoadingButton
        variant="contained"
        type="submit"
        disabled={isContractPrepareError || !contractWrite}
        loading={isContractWriteLoading || isTransactionLoading}
        onClick={() => contractWrite?.()}
        sx={{ mt: 3 }}
      >
        Complete
      </XxlLoadingButton>
    </>
  );
}
