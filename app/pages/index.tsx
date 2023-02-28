import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@mui/lab";
import { Container, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { Box } from "@mui/system";
import Layout from "components/layout";
import {
  CentralizedBox,
  LandingTimelineDot,
  XxlLoadingButton,
} from "components/styled";

/**
 * Landing page.
 */
export default function Landing() {
  return (
    <Layout
      maxWidth={false}
      disableGutters={true}
      hideToolbar={true}
      sx={{ pt: 0 }}
    >
      <CentralizedBox sx={{ mt: 0 }}>
        {/* Header */}
        <Box
          sx={{
            backgroundImage: `url(/images/header.png)`,
            backgroundSize: "cover",
            minHeight: "100vh",
            width: 1,
          }}
        >
          {/* Header content */}
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: "md",
              color: "#FFFFFF",
            }}
          >
            <Typography
              variant="h1"
              fontWeight={700}
              textAlign="center"
              sx={{ mt: 36, mb: 2 }}
            >
              Boost engagement
            </Typography>
            <Typography
              variant="h4"
              fontWeight={700}
              textAlign="center"
              color="white"
              gutterBottom
            >
              in your web3 community with challenges!
            </Typography>
            <XxlLoadingButton
              variant="contained"
              href="/challenges/start"
              sx={{
                color: "red",
                background: "#FFFFFF",
                ":hover": { background: "#FFFFFF" },
                mt: 4,
                mb: 12,
              }}
            >
              Start Challenge
            </XxlLoadingButton>
          </Container>
        </Box>
        {/* Content */}
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "md",
          }}
        >
          {/* How it works */}
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mt: 12, mb: 3 }}
            textAlign="center"
          >
            How does it work?
          </Typography>
          <Timeline position="alternate" sx={{ width: 1, mt: 2 }}>
            {/* Step one */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "blue" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>🏆</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Start a challenge
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step two */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "purpleLight" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>🔗</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Share the link
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step three */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "purpleDark" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>👥</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  People join the challenge
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step four */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "green" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>✔</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Each participant must verify his result
                </Typography>
                <Typography variant="h6" fontWeight={700} color={grey[600]}>
                  to receive a prize
                </Typography>
              </TimelineContent>
            </TimelineItem>
            {/* Step five */}
            <TimelineItem>
              <TimelineSeparator>
                <TimelineConnector sx={{ height: 12 }} />
                <LandingTimelineDot
                  sx={{ borderColor: "red" }}
                  variant="outlined"
                >
                  <Typography fontSize={32}>🍾</Typography>
                </LandingTimelineDot>
                <TimelineConnector sx={{ height: 12 }} />
              </TimelineSeparator>
              <TimelineContent sx={{ py: "48px", px: 2 }}>
                <Typography variant="h6" fontWeight={700}>
                  Finalize the challenge after deadline
                </Typography>
              </TimelineContent>
            </TimelineItem>
          </Timeline>
        </Container>
      </CentralizedBox>
    </Layout>
  );
}
