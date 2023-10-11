import { Badge, Box, Container, useTheme } from "@mui/material";

function Logo() {
  const theme = useTheme();

  return (
    <>
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          position="relative"
        >
          <img src="/public/assets/school.png" alt="logo" width={"80px"} />
          <Badge
            sx={{
              ".MuiBadge-badge": {
                fontSize: theme.typography.pxToRem(11),
                position: "absolute",
                right: 0,
                bottom: 10,
              },
            }}
            overlap="circular"
            color="success"
            badgeContent="1.0"
          ></Badge>
        </Box>
      </Container>
    </>
  );
}

export default Logo;
