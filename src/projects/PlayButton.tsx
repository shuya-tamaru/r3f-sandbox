import { Button } from "@chakra-ui/react";
import React from "react";
import usePlay, { PlayState } from "../stores/usePlay";

export default function PlayButton() {
  const { playState, setPlayState } = usePlay((state) => state);
  const handlePlay = () => {
    if (playState === PlayState.PLAYING) {
      setPlayState(PlayState.STOPPED);
    } else {
      setPlayState(PlayState.PLAYING);
    }
  };
  return (
    <Button
      position={"absolute"}
      colorScheme="red"
      top={0}
      left={0}
      onClick={handlePlay}
    >
      {playState === PlayState.PLAYING ? "Stop" : "Play"}
    </Button>
  );
}
