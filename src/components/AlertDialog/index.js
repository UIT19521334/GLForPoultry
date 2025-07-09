import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import OnMultiKeyEvent from '../Event/OnMultiKeyEvent';

export default function AlertDialog({ title, content, onOpen, onClose, onAgree }) {
    OnMultiKeyEvent(onClose, 'd');
    OnMultiKeyEvent(onAgree, 'a');
    return (
        <React.Fragment>
            <Dialog
                open={onOpen}
                // onClose={onClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ background: '#ffc696', marginBottom: 2, minWidth: 300 }}>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{content}</DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-around' }}>
                    <Button startIcon={<HighlightOffIcon />} variant="outlined" color="error" onClick={onClose}>
                        <u>D</u>isagree
                    </Button>
                    <Button
                        startIcon={<TaskAltIcon />}
                        variant="contained"
                        color="success"
                        onClick={onAgree}
                        sx={{ width: '70%' }}
                    >
                        <u>A</u>gree
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
