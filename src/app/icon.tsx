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
                    fontSize: 18,
                    background: '#D9F24A', // Using the primary button color from CSS
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#0D1B1E', // Very dark green background color
                    fontWeight: 800,
                    borderRadius: '20%',
                    fontFamily: 'system-ui, sans-serif',
                }}
            >
                JB
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
