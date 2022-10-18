import { useCallback, useEffect, useState } from "react";

type IUseAudioProps = {
  initVolume?: number;
};

export const useAudio = ({ initVolume = 0.5 }: IUseAudioProps) => {
  const [volume, setVolume] = useState(initVolume);
  const [messageAudio, setMessageAudio] = useState<HTMLAudioElement | null>(
    null
  );

  useEffect(() => {
    if (!messageAudio) {
      setMessageAudio(new Audio(`/audio/click.mp3`));
    }
  }, [messageAudio]);

  if (messageAudio) {
    messageAudio.volume = volume;
  }

  const playOnNewMessage = useCallback(async () => {
    if (messageAudio) {
      await messageAudio.play();
    }
  }, [messageAudio]);

  return { playOnNewMessage, setVolume };
};
