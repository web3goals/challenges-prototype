import { Dialog, DialogContent } from "@mui/material";
import { useState } from "react";
import ChallengeShareActions from "./ChallengeShareActions";

/**
 * Dialog to share a challenge.
 */
export default function ChallengeShareDialog(props: {
  id: string;
  isClose?: boolean;
  onClose?: Function;
}) {
  const [isOpen, setIsOpen] = useState(!props.isClose);

  async function close() {
    setIsOpen(false);
    props.onClose?.();
  }

  return (
    <Dialog open={isOpen} onClose={close} maxWidth="sm" fullWidth>
      <DialogContent sx={{ my: 2 }}>
        <ChallengeShareActions id={props.id} />
      </DialogContent>
    </Dialog>
  );
}
