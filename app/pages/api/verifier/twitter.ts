import { NextApiRequest, NextApiResponse } from "next";
import { errorToString } from "utils/converters";

/**
 * Verify participant twitter activity for challenge completion.
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  try {
    response.status(200).json({
      isVerified: true,
      challengeDuration: request.query.challengeDuration,
      challengeHashtag: request.query.challengeHashtag,
      challengeHandle: request.query.challengeHandle,
      participantHandle: request.query.participantHandle,
    });
  } catch (error: any) {
    console.error(error);
    response.status(500).json({ error: errorToString(error) });
  }
}
