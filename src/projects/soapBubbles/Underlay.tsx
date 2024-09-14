import { Box, Text } from "@chakra-ui/react";
import React from "react";

export default function Underlay() {
  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      p={0}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-between"
      zIndex={1}
      background={"#fff"}
    >
      <Text
        fontSize="100px"
        fontWeight="bold"
        color="#2d3436"
        position="absolute"
        top={"20px"}
        left={"40px"}
        style={{
          fontFamily: "'Montserrat', sans-serif",
          textShadow: "1px 1px 2px rgba(0, 0, 0, 0.2)",
          animation: "fadeIn 2s ease-in-out",
        }}
      >
        Soap Bubbles
      </Text>
    </Box>
  );
}
