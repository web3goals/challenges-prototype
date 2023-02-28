import { Autocomplete, Box, MenuItem, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import FormikHelper from "components/helper/FormikHelper";
import {
  CentralizedBox,
  WidgetBox,
  WidgetInputSelect,
  WidgetInputTextField,
  WidgetSeparatorText,
  WidgetTitle,
  XxlLoadingButton,
} from "components/styled";
import { challengeContractAbi } from "contracts/abi/challengeContract";
import { ethers } from "ethers";
import { Form, Formik } from "formik";
import useDebounce from "hooks/useDebounce";
import useToasts from "hooks/useToast";
import { useState } from "react";
import { palette } from "theme/palette";
import {
  getChainId,
  getChainNativeCurrencySymbol,
  getChallengeContractAddress,
} from "utils/chains";
import {
  dateStringToBigNumberTimestamp,
  numberToBigNumber,
  numberToBigNumberEthers,
} from "utils/converters";
import {
  useAccount,
  useContractEvent,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import * as yup from "yup";

/**
 * A component with form to start a challenge.
 */
export default function ChallengeStartForm(props: {
  onSuccess: (startedChallengeId: string) => void;
}) {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { showToastError } = useToasts();

  const challengeTypes = [
    "Tweet every day for X days with hashtag Y and mention Z",
  ];

  // Form states
  const [formValues, setFormValues] = useState({
    duration: 30,
    hashtag: "#30DaysOfCode",
    handle: "BestDevsDAO",
    description:
      "Participate in the #30DaysOfCode challenge and win prizes from BestDevsDAO",
    prize: 0.1,
    prizeCurrency: "native",
    deadline: "2023-06-01",
  });
  const formValidationSchema = yup.object({
    duration: yup.number().required(),
    hashtag: yup.string().required(),
    handle: yup.string().required(),
    description: yup.string().required(),
    prize: yup.number().required(),
    prizeCurrency: yup.string().required(),
    deadline: yup.string().required(),
  });
  const debouncedFormValues = useDebounce(formValues);

  // Contract states
  const { config: contractPrepareConfig, isError: isContractPrepareError } =
    usePrepareContractWrite({
      address: getChallengeContractAddress(chain),
      abi: challengeContractAbi,
      functionName: "start",
      args: [
        numberToBigNumber(debouncedFormValues.duration),
        debouncedFormValues.hashtag,
        debouncedFormValues.handle,
        debouncedFormValues.description,
        numberToBigNumberEthers(debouncedFormValues.prize),
        dateStringToBigNumberTimestamp(debouncedFormValues.deadline),
      ],
      overrides: {
        value: numberToBigNumberEthers(debouncedFormValues.prize),
      },
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

  /**
   * Listen contract events to get id of started challenge.
   */
  useContractEvent({
    address: getChallengeContractAddress(chain),
    abi: challengeContractAbi,
    eventName: "Transfer",
    listener(from, to, tokenId) {
      if (from === ethers.constants.AddressZero && to === address) {
        props.onSuccess(tokenId.toString());
      }
    },
  });

  return (
    <CentralizedBox>
      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        🤝 Dear Web3, I want start
      </Typography>
      <Formik
        initialValues={formValues}
        validationSchema={formValidationSchema}
        onSubmit={() => contractWrite?.()}
      >
        {({ values, errors, touched, handleChange, setValues }) => (
          <Form style={{ width: "100%" }}>
            <FormikHelper onChange={(values: any) => setFormValues(values)} />
            {/* Type input */}
            <WidgetBox bgcolor={palette.blue} mb={3}>
              <WidgetTitle>Challenge</WidgetTitle>
              <Autocomplete
                defaultValue={challengeTypes[0]}
                options={challengeTypes.map((type) => type)}
                disabled={isFormDisabled}
                renderInput={(params) => (
                  <WidgetInputTextField
                    {...params}
                    id="type"
                    name="type"
                    multiline
                    maxRows={4}
                    required
                    sx={{ width: 1 }}
                  />
                )}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            <WidgetSeparatorText mb={3}>where</WidgetSeparatorText>
            {/* Duration input */}
            <WidgetBox bgcolor={palette.purpleDark} mb={3}>
              <WidgetTitle>Days X</WidgetTitle>
              <WidgetInputTextField
                id="duration"
                name="duration"
                type="number"
                value={values.duration}
                onChange={handleChange}
                error={touched.duration && Boolean(errors.duration)}
                helperText={touched.duration && errors.duration}
                disabled={isFormDisabled}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Hashtag input */}
            <WidgetBox bgcolor={palette.purpleDark} mb={3}>
              <WidgetTitle>Hashtag Y</WidgetTitle>
              <WidgetInputTextField
                id="hashtag"
                name="hashtag"
                value={values.hashtag}
                onChange={handleChange}
                error={touched.hashtag && Boolean(errors.hashtag)}
                helperText={touched.hashtag && errors.hashtag}
                disabled={isFormDisabled}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Handle input */}
            <WidgetBox bgcolor={palette.purpleDark} mb={3}>
              <WidgetTitle>Mention Z</WidgetTitle>
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
            <WidgetSeparatorText mb={3}>with</WidgetSeparatorText>
            {/* Description input */}
            <WidgetBox bgcolor={palette.purpleLight} mb={3}>
              <WidgetTitle>Description</WidgetTitle>
              <WidgetInputTextField
                id="description"
                name="description"
                value={values.description}
                onChange={handleChange}
                error={touched.description && Boolean(errors.description)}
                helperText={touched.description && errors.description}
                disabled={isFormDisabled}
                multiline
                maxRows={4}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            <WidgetSeparatorText mb={3}>and</WidgetSeparatorText>
            {/* Prize input */}
            <WidgetBox bgcolor={palette.green} mb={3}>
              <WidgetTitle>Prize Pool</WidgetTitle>
              <Stack direction="row" spacing={1} sx={{ width: 1 }}>
                <WidgetInputTextField
                  id="prize"
                  name="prize"
                  type="number"
                  value={values.prize}
                  onChange={handleChange}
                  error={touched.prize && Boolean(errors.prize)}
                  helperText={touched.prize && errors.prize}
                  disabled={isFormDisabled}
                  sx={{ flex: 1 }}
                />
                <WidgetInputSelect
                  id="prizeCurrency"
                  name="prizeCurrency"
                  value={values.prizeCurrency}
                  onChange={handleChange}
                  disabled={isFormDisabled}
                  sx={{ flex: 1 }}
                >
                  <MenuItem value="native">
                    {getChainNativeCurrencySymbol(chain)}
                  </MenuItem>
                </WidgetInputSelect>
              </Stack>
            </WidgetBox>
            <WidgetSeparatorText mb={3}>
              which will be shared among the participants who will complete the
              challenge
            </WidgetSeparatorText>
            {/* Deadline input */}
            <WidgetBox bgcolor={palette.red} mb={3}>
              <WidgetTitle>By</WidgetTitle>
              <WidgetInputTextField
                id="deadline"
                name="deadline"
                type="date"
                value={values.deadline}
                onChange={handleChange}
                error={touched.deadline && Boolean(errors.deadline)}
                helperText={touched.deadline && errors.deadline}
                disabled={isFormDisabled}
                sx={{ width: 1 }}
              />
            </WidgetBox>
            {/* Submit button */}
            <Box display="flex" flexDirection="column" alignItems="center">
              <XxlLoadingButton
                loading={isFormLoading}
                variant="contained"
                type="submit"
                disabled={isFormSubmitButtonDisabled}
              >
                Start Challenge
              </XxlLoadingButton>
            </Box>
          </Form>
        )}
      </Formik>
    </CentralizedBox>
  );
}
