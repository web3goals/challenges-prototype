import { GitHub, MenuRounded } from "@mui/icons-material";
import {
  AppBar,
  Button,
  Container,
  Divider,
  IconButton,
  Link as MuiLink,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { CONTACTS } from "constants/contacts";
import Link from "next/link";
import packageJson from "package.json";
import { useState } from "react";
import { useAccount } from "wagmi";

/**
 * Component with navigation.
 */
export default function Navigation() {
  const { isConnected, address } = useAccount();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <AppBar
      color="inherit"
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo */}
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Link href="/" passHref legacyBehavior>
              <MuiLink variant="h6" fontWeight={700} color="#000000">
                Web3 Challenges
              </MuiLink>
            </Link>
            <Typography
              color="text.secondary"
              variant="body2"
              sx={{ ml: { md: 1 } }}
            >
              {packageJson.version}-dev
            </Typography>
          </Box>
          {/* Start challenge button */}
          <Box
            sx={{ display: { xs: "none", md: "block" }, flexGrow: 0, mr: 3.5 }}
          >
            <Link href="/challenges/start" legacyBehavior>
              <Button variant="contained">Start Challenge</Button>
            </Link>
          </Box>
          {/* Account link */}
          {isConnected && (
            <Box
              sx={{
                display: { xs: "none", md: "block" },
                flexGrow: 0,
                mr: 3.5,
              }}
            >
              <Link href={`/accounts/${address}`} passHref legacyBehavior>
                <Typography
                  component="a"
                  sx={{
                    fontWeight: 700,
                    color: "inherit",
                    textDecoration: "none",
                  }}
                >
                  Account
                </Typography>
              </Link>
            </Box>
          )}
          {/* Explore challenges link */}
          <Box
            sx={{ display: { xs: "none", md: "block" }, flexGrow: 0, mr: 3.5 }}
          >
            <Link href="/challenges" passHref legacyBehavior>
              <Typography
                component="a"
                sx={{
                  fontWeight: 700,
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Explore
              </Typography>
            </Link>
          </Box>
          {/* Connect button */}
          <Box sx={{ flexGrow: 0, mr: { xs: 0, md: 2 } }}>
            <ConnectButton
              showBalance={false}
              accountStatus={{ smallScreen: "address", largeScreen: "full" }}
            />
          </Box>
          {/* GitHub link */}
          <Box sx={{ display: { xs: "none", md: "block" }, flexGrow: 0 }}>
            <IconButton
              href={CONTACTS.github}
              target="_blank"
              component="a"
              sx={{ color: "#000000" }}
            >
              <GitHub />
            </IconButton>
          </Box>
          {/* Button to open mobile menu */}
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ display: { xs: "block", md: "none" }, ml: 1.5 }}
            aria-controls={open ? "mobile-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <MenuRounded />
          </IconButton>
          {/* Mobile menu */}
          <Menu
            anchorEl={anchorEl}
            id="mobile-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            {/* Start challenge button */}
            <Link href="/challenges/start" legacyBehavior>
              <MenuItem>
                <Button variant="contained">Start Challenge</Button>
              </MenuItem>
            </Link>
            {/* Account link */}
            {isConnected && (
              <Link href={`/accounts/${address}`} passHref legacyBehavior>
                <MenuItem>Account</MenuItem>
              </Link>
            )}
            {/* Explore challenges link */}
            <Link href="/challenges" passHref legacyBehavior>
              <MenuItem>Explore</MenuItem>
            </Link>
            <Divider />
            {/* GitHub link */}
            <MenuItem href={CONTACTS.github} target="_blank" component="a">
              <ListItemIcon>
                <GitHub fontSize="small" />
              </ListItemIcon>
              GitHub
            </MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
