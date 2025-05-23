// this component is used to create a flex container with space between the items

const { Box } = require("@mui/material");
const { styled } = require("@mui/system");

const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
