import { ImageResponse } from 'next/og';
 
// Route segment config
export const runtime = 'edge';
 
// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';
 
// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 24,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: 'white',
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="32" height="32">
          {/* Strawberry body */}
          <path d="M256 90 C 180 150, 100 250, 100 350 C 100 430, 170 480, 256 480 C 342 480, 412 430, 412 350 C 412 250, 332 150, 256 90" fill="#e53e3e" />
          
          {/* Strawberry stem and leaves */}
          <path d="M256 90 C 256 70, 256 50, 256 30" stroke="#38a169" strokeWidth="10" fill="none" />
          
          {/* Left leaf */}
          <path d="M256 60 C 220 40, 180 50, 200 80 C 220 100, 240 80, 256 60" fill="#38a169" />
          
          {/* Right leaf */}
          <path d="M256 60 C 292 40, 332 50, 312 80 C 292 100, 272 80, 256 60" fill="#38a169" />
        </svg>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse options
      ...size,
    }
  );
}