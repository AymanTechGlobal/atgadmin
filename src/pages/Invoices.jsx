import React from "react";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

const Invoices = () => {
  return (
    <Box sx={{ width: 600 }}>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton animation="wave" />
      <Skeleton animation={true} />

      <Stack spacing={1}>
        {/* For variant="text", adjust the height via font-size */}
        <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
        {/* For other variants, adjust the size with `width` and `height` */}

        <Skeleton variant="rectangular" width={410} height={340} />
      </Stack>

      <Skeleton />
      <Skeleton />
      <Skeleton />
    </Box>
  );
};

export default Invoices;
