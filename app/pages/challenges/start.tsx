import ChallengeStartedMessage from "components/challenge/ChallengeStartedMessage";
import ChallengeStartForm from "components/challenge/ChallengeStartForm";
import Layout from "components/layout";
import { useState } from "react";

/**
 * Page to start a challenge.
 */
export default function StartChallenge() {
  const [startedChallengeId, setStartedChallengeId] = useState<
    string | undefined
  >();

  return (
    <Layout maxWidth="sm">
      {startedChallengeId ? (
        <ChallengeStartedMessage id={startedChallengeId} />
      ) : (
        <ChallengeStartForm
          onSuccess={(startedChallengeId) => {
            setStartedChallengeId(startedChallengeId);
            window.scrollTo(0, 0);
          }}
        />
      )}
    </Layout>
  );
}
