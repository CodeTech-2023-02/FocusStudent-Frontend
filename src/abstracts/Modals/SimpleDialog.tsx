import {
    Box,
    IconButton,
    Modal,
    Typography,
    useMediaQuery,
    useTheme,
  } from "@mui/material";
  
  import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
  import PropTypes from "prop-types";
  import React from "react";
  
  export type BaseModalProps = {
    open: boolean;
    handleOnClose: (event?: unknown, reason?: string) => void;

    children?: React.ReactNode;
    title?: string;
    description?: string;
    minWidth?: number;
    width?: number;
    height?: number;
    minHeight?: number;
    isscroll?: boolean;
    actions?: React.ReactNode;
  };
  
  export const SimpleDialog: React.FC<BaseModalProps> = ({
    children,
    open,
    handleOnClose,
    title = "",
    minWidth = 400,
    width = "auto",
    height = 220,
    isscroll = true,
    actions = null,
  }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  
    return (
      <Modal
        open={open}
        onClose={(event, reason) => {
                handleOnClose(event, reason);
            }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            minWidth: isSmallScreen ? "100%" : `${minWidth}px`,
            width: isSmallScreen ? "100%" : `${width}px`,
            height: isSmallScreen ? "100%" : `${height}px`,
            borderRadius: "10px 10px 10px 10px", 
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            ":focus-visible": {
              outline: 0,
            },
            overflow: "hidden", 
            padding: "16px", 
          }}
        >
          <Box
            sx={{
              height: "100%",
              overflow: isscroll ? "auto" : "hidden",
            }}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
              paddingRight={1}
              color="white"
            >
              <IconButton
                disableRipple
                data-testid="close-icon"
                size="small"
                onClick={handleOnClose}
              >
                <CloseRoundedIcon />
              </IconButton>
            </Box>
            <Box sx={{ padding: "0px" }}>
              {title && (
                <Typography
                  sx={{ color: theme.palette.common.black }}
                  marginBottom={3}
                  textAlign="center"
                  fontWeight={600}
                  fontSize="2rem"
                >
                  {title}
                </Typography>
              )}
              {children}
              {actions && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "1em",
                    width: "100%",
                  }}
                >
                  {actions}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>
    );
  };
  
  SimpleDialog.propTypes = {
    actions: PropTypes.node, 
  };
  