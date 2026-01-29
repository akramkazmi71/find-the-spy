import React from 'react';

export default function PlayerSetup({ onStart }) {
    const [selectedCount, setSelectedCount] = React.useState(null);

    const handleStart = () => {
        if (selectedCount) {
            onStart(selectedCount);
        }
    };

    return (
        <div className="card">
            <h2 className="card-title">How many players?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-md)' }}>
                Select the number of players (3-16)
            </p>

            <div className="number-selector">
                {[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map(num => (
                    <button
                        key={num}
                        className={`number-btn ${selectedCount === num ? 'selected' : ''}`}
                        onClick={() => setSelectedCount(num)}
                    >
                        {num}
                    </button>
                ))}
            </div>

            <div className="btn-group">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleStart}
                    disabled={!selectedCount}
                    style={{ opacity: selectedCount ? 1 : 0.5 }}
                >
                    Continue →
                </button>
            </div>
        </div>
    );
}
