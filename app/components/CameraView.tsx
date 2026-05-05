'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import Webcam from 'react-webcam';

export interface CameraViewHandle {
  capture: () => string | null;
}

interface Props {
  filterCss: string;
  isFlashing: boolean;
  facingMode?: 'user' | 'environment';
}

const CameraView = forwardRef<CameraViewHandle, Props>(
  ({ filterCss, isFlashing, facingMode = 'user' }, ref) => {
    const webcamRef = useRef<Webcam>(null);

    useImperativeHandle(ref, () => ({
      capture: () => webcamRef.current?.getScreenshot() ?? null,
    }));

    // Mirror only if using front camera
    const isMirrored = facingMode === 'user';

    return (
      <div className="relative w-full h-full overflow-hidden rounded-2xl">
        {/* Webcam feed */}
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          screenshotQuality={0.95}
          mirrored={isMirrored}
          videoConstraints={{
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            facingMode: facingMode,
          }}
          style={{ filter: filterCss }}
          className="w-full h-full object-cover"
          onUserMediaError={() => {}}
        />

        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.45) 100%)',
          }}
        />

        {/* Flash overlay */}
        {isFlashing && <div className="flash-overlay" />}
      </div>
    );
  }
);

CameraView.displayName = 'CameraView';
export default CameraView;
