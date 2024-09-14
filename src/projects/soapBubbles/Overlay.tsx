import React from "react";
import { useGravity } from "./store/useGravity";
import { Box, Button, Icon, IconButton, VStack } from "@chakra-ui/react";
import { BsTwitterX } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { GrInstagram } from "react-icons/gr";
import { ImGithub } from "react-icons/im";

export default function Overlay() {
  const { gravity, setGravity } = useGravity((state) => state);

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      w="100%"
      h="100%"
      p={10}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="space-between"
      zIndex={3}
    >
      {/* ハンバーガーメニューアイコン */}
      <IconButton
        icon={<Icon as={GiHamburgerMenu} boxSize={7} />}
        aria-label="Menu"
        position="absolute"
        top={10}
        right={10}
        size="xl"
        variant="ghost"
        color="#2d3436"
        _hover={{ bg: "rgba(255,255,255,0.2)" }}
      />

      {/* 中央下部にToggle Gravityボタン */}
      <VStack
        w="100%"
        spacing={6}
        position="absolute"
        bottom={20}
        alignItems="center"
      >
        <Button
          size="lg"
          variant="outline"
          borderColor="#2d3436"
          color="#2d3436"
          onClick={() => setGravity(!gravity)}
          _hover={{ bg: "rgba(255,255,255,0.2)" }}
        >
          Toggle Gravity
        </Button>
      </VStack>

      {/* ソーシャルメディアアイコン */}
      <Box position="absolute" bottom={10} left={10} display="flex" gap={1}>
        <IconButton
          icon={<Icon as={BsTwitterX} boxSize={7} />}
          aria-label="Twitter"
          size="lg"
          variant="ghost"
          color="#2d3436"
          _hover={{ color: "#1DA1F2" }}
        />
        <IconButton
          icon={<Icon as={ImGithub} boxSize={7} />}
          aria-label="GitHub"
          size="lg"
          variant="ghost"
          color="#2d3436"
          _hover={{ color: "#333" }}
        />
        <IconButton
          icon={<Icon as={GrInstagram} boxSize={7} />}
          aria-label="Instagram"
          size="lg"
          variant="ghost"
          color="#2d3436"
          _hover={{ color: "#E1306C" }}
        />
      </Box>

      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}
