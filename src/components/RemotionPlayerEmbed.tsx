import React from 'react';
import { Player } from '@remotion/player';
import { AutoVisaoShowreel } from '../remotion/AutoVisaoShowreel';

export interface RemotionPlayerEmbedProps {
  activeSceneOverride: number | null;
}

export const RemotionPlayerEmbed: React.FC<RemotionPlayerEmbedProps> = ({
  activeSceneOverride,
}) => {
  return (
    <Player
      component={AutoVisaoShowreel}
      inputProps={{ activeSceneOverride }}
      durationInFrames={450}
      compositionWidth={1120}
      compositionHeight={540}
      fps={30}
      style={{ width: '100%', height: 'auto', aspectRatio: '1120 / 540' }}
      controls
      loop
      autoPlay
    />
  );
};

export default RemotionPlayerEmbed;
