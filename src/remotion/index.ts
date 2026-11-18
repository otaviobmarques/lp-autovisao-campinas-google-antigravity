import React from 'react';
import { Composition, registerRoot } from 'remotion';
import { AutoVisaoShowreel } from './AutoVisaoShowreel';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="AutoVisaoCampinasShowreel"
        component={AutoVisaoShowreel}
        durationInFrames={450}
        fps={30}
        width={1120}
        height={540}
        defaultProps={{
          activeSceneOverride: null,
        }}
      />
    </>
  );
};

registerRoot(RemotionRoot);
