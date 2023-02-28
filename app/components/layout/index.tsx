import { Breakpoint, Container, SxProps, Toolbar } from "@mui/material";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Head from "next/head";
import Footer from "./Footer";
import Navigation from "./Navigation";

/**
 * Component with layout.
 */
export default function Layout(props: {
  maxWidth?: Breakpoint | false;
  hideToolbar?: boolean;
  disableGutters?: boolean;
  sx?: SxProps;
  children: any;
}) {
  return (
    <Box>
      <CssBaseline />
      <Head>
        <title>
          Web3 Challenges - Boost engagement in your web3 community with
          challenges!
        </title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Navigation />
      <Container
        maxWidth={props.maxWidth !== undefined ? props.maxWidth : "md"}
        disableGutters={props.disableGutters || false}
        sx={{ minHeight: "100vh" }}
      >
        <Box sx={{ py: 4, ...props.sx }}>
          {!props.hideToolbar && <Toolbar />}
          {props.children}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
}
