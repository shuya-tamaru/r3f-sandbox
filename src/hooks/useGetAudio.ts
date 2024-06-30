import { useEffect, useRef, useState } from "react";
import { PlayState } from "../stores/usePlay";

export default function useGetAudio(play: PlayState) {
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [average, setAverage] = useState<number>(0);
  const [maximum, setMaximum] = useState<number>(0);

  useEffect(() => {
    const audioCtx = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const audioElement = new Audio("/audio/test.mp3");
    const audioSrc = audioCtx.createMediaElementSource(audioElement);
    const analyser = audioCtx.createAnalyser();

    audioSrc.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 1024;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    analyserRef.current = analyser;
    setDataArray(dataArray);
    audioElementRef.current = audioElement;

    const getData = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        setDataArray(dataArray);
        const sum = dataArray.reduce((acc, cur) => acc + cur, 0);
        setAverage(sum / bufferLength);
        setMaximum(Math.max(...dataArray));
      }
      requestAnimationFrame(getData);
    };

    getData();

    return () => {
      audioElement.pause();
      audioElement.src = "";
      audioElement.load();
    };
  }, [play]);

  useEffect(() => {
    if (play === PlayState.PLAYING) {
      audioElementRef.current
        ?.play()
        .catch((error) => console.error("Audio play error:", error));
    } else {
      audioElementRef.current?.pause();
    }
  }, [play]);

  return { dataArray, average, maximum };
}
