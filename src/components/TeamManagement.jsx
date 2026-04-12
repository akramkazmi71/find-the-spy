import React, { useState } from 'react';

export default function TeamManagement({ initialPlayers, initialSpyCount, initialSpiesKnowEachOther, onStart, onCancel }) {
    const [players, setPlayers] = useState([...initialPlayers]);
    const [spyCount, setSpyCount] = useState(initialSpyCount);
    const [spiesKnowEachOther, setSpiesKnowEachOther] = useState(initialSpiesKnowEachOther);
    const [newName, setNewName] = useState('');

    const handleRemove = (index) => {
        const newPlayers = players.filter((_, i) => i !== index);
        setPlayers(newPlayers);
        if (spyCount > newPlayers.length) {
            setSpyCount(Math.min(3, newPlayers.length));
        }
    };

    const handleAdd = (e) => {
        e.preventDefault();
        const trimmed = newName.trim();
        if (trimmed && players.length < 20) {
            setPlayers([...players, trimmed]);
            setNewName('');
        }
    };

    const handleStart = () => {
        if (players.length >= 3) {
            onStart(players, spyCount, spiesKnowEachOther);
        }
    };

    return (
        <div className="card" style={{ animation: 'fadeInUp 0.6s ease' }}>
            <h2 className="card-title">Manage Team</h2>

            <form onSubmit={handleAdd} style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        style={{ flex: 1, marginBottom: 0 }}
                        placeholder="Add new player..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        maxLength={20}
                        disabled={players.length >= 20}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!newName.trim() || players.length >= 20}
                        style={{ padding: '0 1rem' }}
                    >
                        ➕ Add
                    </button>
                </div>
            </form>

            <div style={{
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: 'var(--spacing-xl)',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                border: '1px solid var(--border-color)'
            }}>
                {players.length === 0 ? (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No players remaining.</p>
                ) : (
                    players.map((name, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.5rem',
                            borderBottom: index < players.length - 1 ? '1px solid var(--border-color)' : 'none'
                        }}>
                            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{name}</span>
                            <button
                                onClick={() => handleRemove(index)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'var(--danger)',
                                    cursor: 'pointer',
                                    fontSize: '1.25rem',
                                    padding: '0.25rem 0.5rem'
                                }}
                            >
                                ❌
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>Number of Spies</h3>
                <div className="number-selector" style={{ justifyContent: 'center' }}>
                    {[1, 2, 3].map(num => (
                        <button
                            key={num}
                            type="button"
                            className={`number-btn ${spyCount === num ? 'selected' : ''}`}
                            onClick={() => {
                                setSpyCount(num);
                                if (num === 1) setSpiesKnowEachOther(false);
                            }}
                            disabled={num > players.length}
                            style={{ minWidth: '60px', padding: '0.5rem', opacity: num > players.length ? 0.3 : 1 }}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {spyCount > 1 && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '1rem',
                        background: 'var(--bg-surface)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer',
                        border: spiesKnowEachOther ? '2px solid var(--primary)' : '2px solid transparent'
                    }}
                        onClick={() => setSpiesKnowEachOther(!spiesKnowEachOther)}
                    >
                        <input
                            type="checkbox"
                            checked={spiesKnowEachOther}
                            onChange={() => { }}
                            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
                        />
                        <span style={{ fontWeight: 700, color: spiesKnowEachOther ? 'var(--primary)' : 'var(--text-main)' }}>
                            🤝 Spies know each other
                        </span>
                    </div>
                )}
                {players.length < 3 && (
                    <p style={{ color: 'var(--danger)', marginTop: '0.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                        Need at least 3 players to start.
                    </p>
                )}
            </div>

            <div className="btn-group" style={{ flexDirection: 'column', gap: '1rem' }}>
                <button
                    className="btn btn-primary btn-lg"
                    onClick={handleStart}
                    disabled={players.length < 3}
                    style={{ width: '100%', opacity: players.length < 3 ? 0.5 : 1 }}
                >
                    🚀 Start Next Round
                </button>
                <button
                    className="btn btn-secondary btn-lg"
                    onClick={onCancel}
                    style={{ width: '100%' }}
                >
                    ⬅️ Back
                </button>
            </div>
        </div>
    );
}
