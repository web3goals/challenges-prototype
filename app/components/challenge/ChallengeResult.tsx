import { SxProps, Box } from "@mui/material";
import {
  ThickDivider,
  WidgetBox,
  WidgetSeparatorText,
  WidgetText,
  WidgetTitle,
} from "components/styled";
import { BigNumber } from "ethers";
import { palette } from "theme/palette";
import { bigNumberTimestampToLocaleDateString } from "utils/converters";

/**
 * A component with challenge result.
 */
export default function ChallengeResult(props: {
  isFinalized: boolean;
  finalizedTimestamp: BigNumber;
  winnersNumber: BigNumber;
  sx?: SxProps;
}) {
  if (props.isFinalized) {
    return (
      <Box sx={{ width: 1, ...props.sx }}>
        <ThickDivider />
        <WidgetSeparatorText mt={6}>
          and challenge was finalized
        </WidgetSeparatorText>
        {/* Finalized timestamp */}
        <WidgetBox bgcolor={palette.yellow} mt={2}>
          <WidgetTitle>On</WidgetTitle>
          <WidgetText>
            {bigNumberTimestampToLocaleDateString(props.finalizedTimestamp)}
          </WidgetText>
        </WidgetBox>
        <WidgetSeparatorText mt={2}>with</WidgetSeparatorText>
        {/* Winners number */}
        <WidgetBox bgcolor={palette.orange} mt={2}>
          <WidgetTitle>Winners</WidgetTitle>
          <WidgetText>{props.winnersNumber.toNumber()}</WidgetText>
        </WidgetBox>
      </Box>
    );
  }

  return <></>;
}
