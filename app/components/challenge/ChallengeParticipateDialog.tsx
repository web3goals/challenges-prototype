import { Box, Dialog, DialogContent, Typography } from "@mui/material";
import FormikHelper from "components/helper/FormikHelper";
import {
  WidgetBox,
  WidgetInputTextField,
  WidgetTitle,
  XxlLoadingButton,
} from "components/styled";
import { challengeContractAbi } from "contracts/abi/challengeContract";
import { BigNumber } from "ethers";
import { Form, Formik } from "formik";
import useDebounce from "hooks/useDebounce";
import useToasts from "hooks/useToast";
import { useEffect, useState } from "react";
import { palette } from "theme/palette";
import { getChainId, getChallengeContractAddress } from "utils/chains";
import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * Dialog to participate in challenge.
 */
export default function ChallengeParticipateDialog(props: {
  id: string;
  onSuccess?: Function;
  isClose?: boolean;
  onClose?: Function;
}) {
  const { chain } = useNetwork();
  const { showToastSuccess, showToastError } = useToasts();

  // Dialog states
  const [isOpen, setIsOpen] = useState(!props.isClose);

  // Form states
  const [formValues, setFormValues] = useState({
    handle: "JannieLibo",
  });
  const formValidationSchema = yup.object({
    handle: yup.string().required(),
  });
  const debouncedFormValues = useDebounce(formValues);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getChallengeContractAddress(chain),
      abi: challengeContractAbi,
      functionName: "participate",
      args: [BigNumber.from(props.id), debouncedFormValues.handle],
      chainId: getChainId(chain),
      onError(error: any) {
        showToastError(error);
      },
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

  const isFormLoading = isContractWriteLoading || isTransactionLoading;
  const isFormDisabled = isFormLoading || isTransactionSuccess;
  const isFormSubmitButtonDisabled =
    isFormDisabled || isContractPrepareError || !contractWrite;

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  /**
   * Handle transaction success to show success message.
   */
  useEffect(() => {
    if (isTransactionSuccess) {
      showToastSuccess("You successfully joined the challenge!");
      props.onSuccess?.();
      close();
    }
  }, [isTransactionSuccess]);

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent sx={{ my: 2 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          👥 To participate
        </Typography>
        <Typography fontWeight={700} textAlign="center" sx={{ mt: 2 }}>
          you should define your twitter handle
        </Typography>
        <Formik
          initialValues={formValues}
          validationSchema={formValidationSchema}
          onSubmit={() => contractWrite?.()}
        >
          {({ values, errors, touched, handleChange }) => (
            <Form style={{ width: "100%" }}>
              <FormikHelper onChange={(values: any) => setFormValues(values)} />
              {/* Handle input */}
              <WidgetBox bgcolor={palette.purpleDark} mt={3}>
                <WidgetTitle>Handle</WidgetTitle>
                <WidgetInputTextField
                  id="handle"
                  name="handle"
                  value={values.handle}
                  onChange={handleChange}
                  error={touched.handle && Boolean(errors.handle)}
                  helperText={touched.handle && errors.handle}
                  disabled={isFormDisabled}
                  sx={{ width: 1 }}
                />
              </WidgetBox>
              {/* Submit button */}
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                mt={3}
              >
                <XxlLoadingButton
                  loading={isFormLoading}
                  variant="contained"
                  type="submit"
                  disabled={isFormSubmitButtonDisabled}
                >
                  Participate
                </XxlLoadingButton>
              </Box>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
