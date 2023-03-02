import {
  AlternateEmail,
  Instagram,
  Language,
  Person,
  Telegram,
  Twitter,
} from "@mui/icons-material";
import { Avatar, Box, Divider, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { FullWidthSkeleton, XlLoadingButton } from "components/styled";
import { DialogContext } from "context/dialog";
import { profileContractAbi } from "contracts/abi/profileContract";
import ProfileUriDataEntity from "entities/ProfileUriDataEntity";
import { ethers } from "ethers";
import useError from "hooks/useError";
import useIpfs from "hooks/useIpfs";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { getProfileContractAddress } from "utils/chains";
import { addressToShortAddress } from "utils/converters";
import { useAccount, useContractRead, useNetwork } from "wagmi";

/**
 * A component with account profile.
 */
export default function AccountProfile(props: { address: string }) {
  const { showDialog, closeDialog } = useContext(DialogContext);
  const { handleError } = useError();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { loadJsonFromIpfs, ipfsUriToHttpUri } = useIpfs();
  const [profileData, setProfileData] = useState<
    ProfileUriDataEntity | null | undefined
  >();

  // Contract states
  const { status, error, data } = useContractRead({
    address: getProfileContractAddress(chain),
    abi: profileContractAbi,
    functionName: "getURI",
    args: [ethers.utils.getAddress(props.address)],
  });

  /**
   * Load profile data from ipfs when contract reading is successed.
   */
  useEffect(() => {
    if (status === "success") {
      if (data) {
        loadJsonFromIpfs(data)
          .then((result) => setProfileData(result))
          .catch((error) => handleError(error, true));
      } else {
        setProfileData(null);
      }
    }
    if (status === "error" && error) {
      setProfileData(null);
    }
  }, [status, error, data]);

  if (profileData !== undefined) {
    return (
      <>
        {/* Image */}
        <Box sx={{ mb: 3 }}>
          <Avatar
            sx={{
              width: 164,
              height: 164,
              borderRadius: 164,
            }}
            src={
              profileData?.image
                ? ipfsUriToHttpUri(profileData.image)
                : undefined
            }
          >
            <Person sx={{ fontSize: 64 }} />
          </Avatar>
        </Box>
        {/* Name */}
        {profileData?.attributes?.[0]?.value && (
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 0.5 }}
          >
            {profileData.attributes[0].value}
          </Typography>
        )}
        {/* Description */}
        {profileData?.attributes?.[1]?.value && (
          <Typography textAlign="center" sx={{ maxWidth: 480, mb: 1.5 }}>
            {profileData.attributes[1].value}
          </Typography>
        )}
        {/* Links and other data */}
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          alignItems="center"
        >
          {/* Links */}
          <Stack direction="row" alignItems="center">
            {profileData?.attributes?.[2]?.value && (
              <IconButton
                href={`mailto:${profileData.attributes[2].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <AlternateEmail />
              </IconButton>
            )}
            {profileData?.attributes?.[3]?.value && (
              <IconButton
                href={profileData.attributes[3].value}
                target="_blank"
                component="a"
                color="primary"
              >
                <Language />
              </IconButton>
            )}
            {profileData?.attributes?.[4]?.value && (
              <IconButton
                href={`https://twitter.com/${profileData.attributes[4].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Twitter />
              </IconButton>
            )}
            {profileData?.attributes?.[5]?.value && (
              <IconButton
                href={`https://t.me/${profileData.attributes[5].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Telegram />
              </IconButton>
            )}
            {profileData?.attributes?.[6]?.value && (
              <IconButton
                href={`https://instagram.com/${profileData.attributes[6].value}`}
                target="_blank"
                component="a"
                color="primary"
              >
                <Instagram />
              </IconButton>
            )}
            {(profileData?.attributes?.[2]?.value ||
              profileData?.attributes?.[3]?.value ||
              profileData?.attributes?.[4]?.value ||
              profileData?.attributes?.[5]?.value ||
              profileData?.attributes?.[6]?.value) && (
              <Divider
                flexItem
                orientation="vertical"
                variant="middle"
                sx={{
                  display: { xs: "none", md: "block" },
                  borderRightWidth: 4,
                  ml: 1.3,
                  mr: 2,
                }}
              />
            )}
          </Stack>
          {/* Address */}
          <Stack
            direction="row"
            alignItems="center"
            sx={{ mb: { xs: 1, md: 0 } }}
          >
            <Typography fontWeight={700} sx={{ mr: 1.5 }}>
              {addressToShortAddress(props.address)}
            </Typography>
          </Stack>
        </Stack>
        {/* Owner buttons */}
        {address === props.address && (
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            {/* Edit button */}
            <Link href="/accounts/edit" legacyBehavior>
              <XlLoadingButton variant="contained">Edit</XlLoadingButton>
            </Link>
          </Stack>
        )}
      </>
    );
  }

  return <FullWidthSkeleton />;
}
