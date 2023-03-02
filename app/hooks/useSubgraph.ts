import axios from "axios";
import ChallengeEntity from "entities/ChallengeEntity";
import { getSubgraphApiUrl } from "utils/chains";
import { Chain } from "wagmi";

/**
 * Hook to work with subgraph.
 */
export default function useSubgraph() {
  const defaultFirst = 10;
  const defaultSkip = 0;

  let findChallenges = async function (args: {
    chain: Chain | undefined;
    creator?: string;
    participant?: string;
    first?: number;
    skip?: number;
  }): Promise<Array<ChallengeEntity>> {
    // Prepare query
    const creatorFilter = args.creator
      ? `creator: "${args.creator.toLowerCase()}"`
      : "";
    const participantFilter = args.participant
      ? `participantAddresses_contains: ["${args.participant.toLowerCase()}"]`
      : "";
    const filterParams = `where: {${creatorFilter}, ${participantFilter}}`;
    const sortParams = `orderBy: createdTimestamp, orderDirection: desc`;
    const paginationParams = `first: ${args.first || defaultFirst}, skip: ${
      args.skip || defaultSkip
    }`;
    const query = `{
      challenges(${filterParams}, ${sortParams}, ${paginationParams}) {
        id
        createdTimestamp
        creator
        duration
        hashtag
        handle
        description
        prize
        deadline
        isFinalized
        participantsNumber
      }
    }`;
    // Make query and return result
    const response = await makeSubgraphQuery(args.chain, query);
    const challenges: Array<ChallengeEntity> = [];
    response.challenges?.forEach((challenge: any) => {
      challenges.push({
        id: challenge.id,
        createdTimestamp: challenge.createdTimestamp,
        creator: challenge.creator,
        duration: challenge.duration,
        hashtag: challenge.hashtag,
        handle: challenge.handle,
        description: challenge.description,
        prize: challenge.prize,
        deadline: challenge.deadline,
        isFinalized: challenge.isFinalized,
        participantsNumber: challenge.participantsNumber,
      });
    });
    return challenges;
  };

  return {
    findChallenges,
  };
}

async function makeSubgraphQuery(chain: Chain | undefined, query: string) {
  try {
    const chainSubgraphApiUrl = getSubgraphApiUrl(chain);
    if (!chainSubgraphApiUrl) {
      throw new Error(`Chain '${chain?.name}' does not support a subgraph`);
    }
    const response = await axios.post(chainSubgraphApiUrl, {
      query: query,
    });
    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      `Could not query the subgraph: ${JSON.stringify(error.message)}`
    );
  }
}
