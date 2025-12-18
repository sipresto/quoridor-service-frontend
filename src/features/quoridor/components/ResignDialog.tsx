import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material"

interface resignDialogProps {
    open: boolean
    onCancel: () => void
    onConfirm: () => void
}

export function ResignDialog({open, onCancel, onConfirm}: resignDialogProps) {
    return (
        <Dialog
            open={open}
            onClose={onCancel}
        >
            <DialogTitle>
                Resign Game?
            </DialogTitle>

            <DialogContent>
                <Typography>
                    Are you sure you want to resign? This will immediately end
                    the game and count as a loss.
                </Typography>
            </DialogContent>

            <DialogActions>
                <Button onClick={onCancel}>
                    Cancel
                </Button>

                <Button
                    color="error"
                    variant="contained"
                    onClick={onConfirm}
                >
                    Resign
                </Button>
            </DialogActions>
        </Dialog>
    )
}