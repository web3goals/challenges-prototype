import ChallengeActions from "components/challenge/ChallengeActions";
import ChallengeParams from "components/challenge/ChallengeParams";
import Layout from "components/layout";
import { CentralizedBox, FullWidthSkeleton } from "components/styled";
import { challengeContractAbi } from "contracts/abi/challengeContract";
import { BigNumber } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getChallengeContractAddress } from "utils/chains";
import { useContractRead, useNetwork } from "wagmi";

/**
 * Page with a challenge.
 */
export default function Challenge() {
  const router = useRouter();
  const { slug } = router.query;
  const { chain } = useNetwork();
  const [challengeId, setChallengeId] = useState<string | undefined>();

  // State of contract reading to get challenge params
  const {
    data: challengeParams,
    refetch: refetchChallengeParams,
    isFetching: isChallengeParamsFetching,
  } = useContractRead({
    address: getChallengeContractAddress(chain),
    abi: challengeContractAbi,
    functionName: "getParams",
    args: challengeId ? [BigNumber.from(challengeId)] : undefined,
    enabled: challengeId !== undefined,
  });

  // State of contract reading to get challenge participants
  const {
    data: challengeParticipants,
    refetch: refetchChallengeParticipants,
    isFetching: isChallengeParticipantsFetching,
  } = useContractRead({
    address: getChallengeContractAddress(chain),
    abi: challengeContractAbi,
    functionName: "getParticipants",
    args: challengeId ? [BigNumber.from(challengeId)] : undefined,
    enabled: challengeId !== undefined,
  });

  const isDataReady =
    challengeId &&
    challengeParams &&
    challengeParticipants &&
    !isChallengeParamsFetching &&
    !isChallengeParticipantsFetching;

  useEffect(() => {
    setChallengeId(slug ? (slug as string) : undefined);
  }, [slug]);

  return (
    <Layout maxWidth="sm">
      <CentralizedBox>
        {isDataReady ? (
          <>
            <ChallengeParams
              id={challengeId}
              createdTimestamp={challengeParams.createdTimestamp}
              creator={challengeParams.creator}
              duration={challengeParams.duration}
              hashtag={challengeParams.hashtag}
              handle={challengeParams.handle}
              description={challengeParams.description}
              prize={challengeParams.prize}
              deadline={challengeParams.deadline}
              isFinalized={challengeParams.isFinalized}
            />
            <ChallengeActions
              id={challengeId}
              isFinalized={challengeParams.isFinalized}
              sx={{ mt: 4 }}
            />
          </>
        ) : (
          <FullWidthSkeleton />
        )}
      </CentralizedBox>
    </Layout>
  );
}
