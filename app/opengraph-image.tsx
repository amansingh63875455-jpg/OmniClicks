import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'OmniClicks - Daily Fintech Intelligence';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    fontSize: 128,
                    background: 'linear-gradient(to bottom right, #0f172a, #1e293b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontFamily: 'serif',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    OmniClicks
                </div>
                <div
                    style={{
                        fontSize: 48,
                        marginTop: 40,
                        background: '#3b82f6',
                        color: 'white',
                        padding: '10px 40px',
                        borderRadius: 50,
                        fontFamily: 'sans-serif',
                    }}
                >
                    FinTech News
                </div>
            </div>
        ),
        {
            ...size,
        }
    );
}
