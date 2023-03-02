import { SxProps, Typography, Link as MuiLink } from "@mui/material";
import { Box, Stack } from "@mui/system";
import { FullWidthSkeleton, XxlLoadingButton } from "components/styled";
import ChallengeEntity from "entities/ChallengeEntity";
import { BigNumber, ethers } from "ethers";
import useError from "hooks/useError";
import useSubgraph from "hooks/useSubgraph";
import { useEffect, useState } from "react";
import { getChainNativeCurrencySymbol } from "utils/chains";
import {
  addressToShortAddress,
  bigNumberTimestampToLocaleDateString,
} from "utils/converters";
import { useNetwork } from "wagmi";

/**
 * A component with challenge list.
 */
export default function ChallengeList(props: {
  creator?: string;
  participant?: string;
  sx?: SxProps;
}) {
  const { chain } = useNetwork();
  const { handleError } = useError();
  const { findChallenges } = useSubgraph();
  const [challenges, setChallenges] = useState<
    Array<ChallengeEntity> | undefined
  >();
  const [isMoreChallengesExist, setIsMoreChallengesExist] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const pageSize = 3;

  async function loadMoreChallenges(pageNumber: number) {
    try {
      const loadedChallenges = await findChallenges({
        chain: chain,
        creator: props.creator,
        participant: props.participant,
        first: pageSize,
        skip: pageNumber * pageSize,
      });
      setChallenges(
        challenges ? [...challenges, ...loadedChallenges] : loadedChallenges
      );
      setPageNumber(pageNumber);
      if (loadedChallenges.length === 0) {
        setIsMoreChallengesExist(false);
      }
    } catch (error: any) {
      handleError(error, true);
    }
  }

  useEffect(() => {
    setChallenges(undefined);
    setIsMoreChallengesExist(true);
    loadMoreChallenges(0);
  }, [chain, props]);

  return (
    <Box sx={{ width: 1, ...props.sx }}>
      {/* List with challenges */}
      {challenges && challenges.length > 0 && (
        <Stack spacing={2}>
          {challenges.map((challenge, index) => (
            <ChallengeCard key={index} challenge={challenge} />
          ))}
          {/* Actions */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            {isMoreChallengesExist && (
              <XxlLoadingButton
                variant="outlined"
                onClick={() => {
                  loadMoreChallenges(pageNumber + 1);
                }}
              >
                Load More
              </XxlLoadingButton>
            )}
          </Stack>
        </Stack>
      )}
      {/* Empty list */}
      {challenges && challenges.length === 0 && (
        <Typography textAlign="center">no challenges</Typography>
      )}
      {/* Loading list */}
      {!challenges && <FullWidthSkeleton />}
    </Box>
  );
}

function ChallengeCard(props: { challenge: ChallengeEntity; sx?: SxProps }) {
  const { chain } = useNetwork();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "solid",
        borderColor: !props.challenge.isFinalized ? "blue" : "divider",
        borderWidth: 6,
        borderRadius: 2,
        py: 2,
        px: 4,
        ...props.sx,
      }}
    >
      {/* Link */}
      <Typography fontWeight={700}>
        🏆
        <MuiLink href={`/challenges/${props.challenge.id}`}>
          Challenge #{props.challenge.id}
        </MuiLink>
      </Typography>
      {/* Description */}
      <Typography fontWeight={700} mt={1}>
        {props.challenge.description}
      </Typography>

      {/* Details */}
      <Stack direction="row" spacing={2} mt={1}>
        <Typography variant="body2">
          👤
          <MuiLink href={`/accounts/${props.challenge.creator}`}>
            {addressToShortAddress(props.challenge.creator)}
          </MuiLink>
        </Typography>
        <Typography variant="body2">
          👥 {props.challenge.participantsNumber}
        </Typography>
        <Typography variant="body2">
          💰 {ethers.utils.formatEther(BigNumber.from(props.challenge.prize))}{" "}
          {getChainNativeCurrencySymbol(chain)}
        </Typography>
        <Typography variant="body2">
          {bigNumberTimestampToLocaleDateString(
            BigNumber.from(props.challenge.deadline)
          )}
        </Typography>
      </Stack>
    </Box>
  );
}
