import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateDialogError } from "~/Redux/Reducer/Thunk";

export default function ErrorDialog() {
    const dispatch = useDispatch();
    const dialogError = useSelector((state) => state.FetchApi.dialogError);
    const handleClose = () => {
        dispatch(updateDialogError({ open: false, title: '', content: '' }));
    };

    return (
        <Dialog
            open={dialogError.open}
            onClose={handleClose}
            PaperProps={{
                style: { borderRadius: 12, padding: "16px", textAlign: "center" },
            }}
        >
            {/* Icon Error (hình tròn đỏ) */}
            <Box
                sx={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "#fdecea",
                    mx: "auto",
                    mt: 1,
                }}
            >
                <Close sx={{ fontSize: 32, color: "#d32f2f" }} />
            </Box>

            {/* Title */}
            <DialogTitle sx={{ fontWeight: "bold", p: 0, mt: 2 }}>Error</DialogTitle>

            {/* Subtitle */}
            <DialogContent sx={{ p: 0, mt: 1 }}>
                <Typography variant="body2" color="textSecondary">
                    {dialogError.content}
                </Typography>
            </DialogContent>

            {/* Action */}
            <DialogActions sx={{ justifyContent: "center", mt: 2 }}>
                <Button
                    variant="contained"
                    onClick={handleClose}
                    sx={{
                        bgcolor: "#d32f2f",
                        "&:hover": { bgcolor: "#b71c1c" },
                        px: 6,
                        borderRadius: "6px",
                    }}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    );
}
