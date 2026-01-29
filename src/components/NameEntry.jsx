import React from 'react';

export default function NameEntry({ playerCount, onComplete }) {
    const [names, setNames] = React.useState(Array(playerCount).fill(''));
    const [currentIndex, setCurrentIndex] = React.useState(0);

    const handleNameChange = (index, value) => {
        const newNames = [...names];
        newNames[index] = value;
        setNames(newNames);
    };

    const handleNext = () => {
        if (currentIndex < playerCount - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleSubmit = () => {
        const validNames = names.filter(name => name.trim() !== '');
        if (validNames.length === playerCount) {
            onComplete(names);
        }
    };

    const allNamesFilled = names.every(name => name.trim() !== '');
    const currentName = names[currentIndex];

    return (
        <div className="card">
            <h2 className="card-title">Enter Player Names</h2>
            <p className="subtitle" style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                Player {currentIndex + 1} of {playerCount}
            </p>

            {/* <div className="input-group">
                <input
                    type="text"
                    value={currentName}
                    onChange={(e) => handleNameChange(currentIndex, e.target.value)}
                    placeholder={`Name for Player ${currentIndex + 1}`}
                    autoFocus
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' && currentName.trim()) {
                            if (currentIndex < playerCount - 1) {
                                handleNext();
                            } else if (allNamesFilled) {
                                handleSubmit();
                            }
                        }
                    }}
                />
            </div> */}

            <div className="input-group">
            <input
                type="text"
                id={`player-${currentIndex}`}
                value={currentName}
                onChange={(e) => handleNameChange(currentIndex, e.target.value)}
                onKeyDown={(e) => {
                if (e.key === 'Enter' && currentName.trim()) {
                    if (currentIndex < playerCount - 1) {
                    handleNext();
                    } else if (allNamesFilled) {
                    handleSubmit();
                    }
                }
                }}
                required
            />
            <label htmlFor={`player-${currentIndex}`}>
                Player {currentIndex + 1} Name
            </label>
            </div>



            {/* Progress indicator */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
                {names.map((name, idx) => (
                    <div
                        key={idx}
                        style={{
                            flex: 1,
                            height: '6px',
                            borderRadius: '3px',
                            background: idx <= currentIndex
                                ? (name.trim() ? 'var(--success)' : 'var(--accent)')
                                : 'var(--bg-surface)',
                            transition: 'all 0.3s ease'
                        }}
                    />
                ))}
            </div>

            {/* <div className="btn-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <button
                    className="btn btn-secondary btn-lg"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    style={{ opacity: currentIndex === 0 ? 0.5 : 1 }}
                >
                    ← Back
                </button>

                {currentIndex < playerCount - 1 ? (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleNext}
                        disabled={!currentName.trim()}
                        style={{ opacity: currentName.trim() ? 1 : 0.5 }}
                    >
                        Next →
                    </button>
                ) : (
                    <button
                        className="btn btn-primary btn-lg"
                        onClick={handleSubmit}
                        disabled={!allNamesFilled}
                        style={{ opacity: allNamesFilled ? 1 : 0.5 }}
                    >
                        Start Game 🚀
                    </button>
                )}
            </div> */}

            <div
            className="btn-group"
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
            }}
            >
            <button
                className="btn btn-secondary btn-lg"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                style={{
                opacity: currentIndex === 0 ? 0.5 : 1,
                minWidth: 0
                }}
            >
                ← Back
            </button>

            {currentIndex < playerCount - 1 ? (
                <button
                className="btn btn-primary btn-lg"
                onClick={handleNext}
                disabled={!currentName.trim()}
                style={{
                    opacity: currentName.trim() ? 1 : 0.5,
                    minWidth: 0
                }}
                >
                Next →
                </button>
            ) : (
                <button
                className="btn btn-primary btn-lg"
                onClick={handleSubmit}
                disabled={!allNamesFilled}
                style={{
                    opacity: allNamesFilled ? 1 : 0.5,
                    minWidth: 0
                }}
                >
                Start Game 🚀
                </button>
            )}
            </div>


            {/* Simple list of added players */}
            {names.some(n => n.trim()) && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <p style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: 'var(--text-muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.5rem'
                    }}>
                        Lineup
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem' }}>
                        {names.map((name, idx) => name.trim() && (
                            <span key={idx} style={{
                                padding: '0.25rem 0.75rem',
                                background: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'var(--text-main)',
                                opacity: 0.8
                            }}>
                                {name}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
