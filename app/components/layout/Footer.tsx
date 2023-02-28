import { Box, SxProps, Typography } from "@mui/material";
import { Container } from "@mui/system";
import { ThickDivider } from "components/styled";

/**
 * Component with a footer.
 */
export default function Footer(props: { sx?: SxProps }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Copyright sx={{ mt: 0, mb: 4 }} />
    </Box>
  );
}

function Copyright(props: { sx?: SxProps }) {
  return (
    <Container sx={{ maxWidth: "md", ...props.sx }}>
      <ThickDivider sx={{ mb: 4 }} />
      <Typography color="text.secondary" variant="body2" textAlign="center">
        Web3 Challenges - Boost engagement in your web3 community with
        challenges!
      </Typography>
    </Container>
  );
}
