import React, { useState, useEffect } from 'react';

interface LoadingOverlayProps {
    message?: string;
}

// Progressive messages to show during slow loads
const PROGRESSIVE_MESSAGES = [
    'Connecting securely...',
    'Verifying your session...',
    'Loading your workspace...',
    'Almost there...',
];

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [showingProgress, setShowingProgress] = useState(false);

    // Cycle through progressive messages every 3 seconds
    useEffect(() => {
        const progressTimer = setTimeout(() => {
            setShowingProgress(true);
        }, 1500);

        const messageTimer = setInterval(() => {
            setMessageIndex((prev) => Math.min(prev + 1, PROGRESSIVE_MESSAGES.length - 1));
        }, 3000);

        return () => {
            clearTimeout(progressTimer);
            clearInterval(messageTimer);
        };
    }, []);

    const displayMessage = message || (showingProgress ? PROGRESSIVE_MESSAGES[messageIndex] : 'Loading...');

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 flex flex-col items-center gap-6 shadow-2xl border border-white/20 max-w-sm mx-4">
                {/* Animated spinner */}
                <div className="relative">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-white/10 animate-pulse" />
                    </div>
                </div>

                {/* Message */}
                <div className="text-center space-y-2">
                    <p className="text-white font-semibold text-lg tracking-wide">
                        {displayMessage}
                    </p>
                    {showingProgress && messageIndex > 1 && (
                        <p className="text-white/60 text-sm">
                            This is taking longer than usual
                        </p>
                    )}
                </div>

                {/* Progress dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-2 w-2 rounded-full transition-all duration-300 ${i <= messageIndex ? 'bg-white' : 'bg-white/30'
                                }`}
                            style={{ animationDelay: `${i * 0.2}s` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
