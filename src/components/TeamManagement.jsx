import React, { useState } from 'react';

export default function TeamManagement({ initialPlayers, initialSpyCount, initialSpiesKnowEachOther, onStart, onCancel }) {
    const [players, setPlayers] = useState([...initialPlayers]);
    const [spyCount, setSpyCount] = useState(initialSpyCount);
    const [spiesKnowEachOther, setSpiesKnowEachOther] = useState(initialSpiesKnowEachOther);
    const [newName, setNewName] = useState('');

    const handleNameChange = (index, val) => {
        const newPlayers = [...players];
        newPlayers[index] = val;
        setPlayers(newPlayers);
    };

    const handleRemove = (index) => {
        const newPlayers = players.filter((_, i) => i !== index);
        setPlayers(newPlayers);
        if (spyCount > newPlayers.length) {
            setSpyCount(Math.max(1, Math.min(3, newPlayers.length - 1 || 1)));
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
        // Clean names: trim spaces and fallback to default if blank
        const cleanedPlayers = players.map((p, idx) => p.trim() || `Player ${idx + 1}`);
        if (cleanedPlayers.length >= 3) {
            onStart(cleanedPlayers, spyCount, spiesKnowEachOther);
        }
    };

    return (
        <div className="card" style={{ animation: 'fadeInUp 0.4s ease', maxWidth: '560px', margin: '0 auto' }}>
            <h2 className="title" style={{ marginBottom: '0.25rem' }}>👥 Manage Roster</h2>
            <p className="subtitle" style={{ marginBottom: '1.5rem' }}>
                Add, remove, or edit players for the next round
            </p>

            {/* Add New Player Input */}
            <form onSubmit={handleAdd} style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    ➕ ADD A NEW PLAYER
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        className="input-field"
                        style={{ flex: 1, marginBottom: 0 }}
                        placeholder="Enter name (e.g. Alex)..."
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        maxLength={20}
                        disabled={players.length >= 20}
                    />
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={!newName.trim() || players.length >= 20}
                        style={{ padding: '0 1.25rem', minWidth: '90px' }}
                    >
                        + Add
                    </button>
                </div>
            </form>

            {/* Active Roster List */}
            <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                        CURRENT PLAYERS ({players.length})
                    </label>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Click name to edit
                    </span>
                </div>

                <div style={{
                    maxHeight: '320px',
                    overflowY: 'auto',
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    {players.length === 0 ? (
                        <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem 0' }}>
                            No players remaining. Add at least 3 players.
                        </p>
                    ) : (
                        players.map((name, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: 'var(--bg-app)',
                                    padding: '0.35rem 0.6rem',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid var(--border-color)'
                                }}
                            >
                                <span style={{
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    color: 'var(--primary)',
                                    minWidth: '1.75rem',
                                    textAlign: 'center'
                                }}>
                                    #{index + 1}
                                </span>

                                <input
                                    type="text"
                                    className="input-field"
                                    style={{
                                        flex: 1,
                                        marginBottom: 0,
                                        padding: '0.4rem 0.6rem',
                                        fontSize: '0.95rem',
                                        background: 'var(--bg-surface)'
                                    }}
                                    value={name}
                                    onChange={(e) => handleNameChange(index, e.target.value)}
                                    placeholder={`Player ${index + 1} name`}
                                    maxLength={20}
                                />

                                <button
                                    type="button"
                                    onClick={() => handleRemove(index)}
                                    title="Remove Player"
                                    aria-label={`Remove player ${name || index + 1}`}
                                    style={{
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.3)',
                                        borderRadius: 'var(--radius-sm)',
                                        color: 'var(--danger)',
                                        cursor: 'pointer',
                                        fontSize: '1rem',
                                        padding: '0.35rem 0.55rem',
                                        lineHeight: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Game Settings: Spy Count */}
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    NUMBER OF SPIES
                </label>
                <div className="grid-selector" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
                    {[1, 2, 3].map(num => {
                        const isDisabled = num >= players.length;
                        return (
                            <button
                                key={num}
                                type="button"
                                className={`grid-btn ${spyCount === num ? 'selected' : ''}`}
                                onClick={() => {
                                    setSpyCount(num);
                                    if (num === 1) setSpiesKnowEachOther(false);
                                }}
                                disabled={isDisabled}
                                style={{ minWidth: '60px', padding: '0.5rem', opacity: isDisabled ? 0.3 : 1 }}
                            >
                                {num} {num === 1 ? 'Spy' : 'Spies'}
                            </button>
                        );
                    })}
                </div>

                {spyCount > 1 && (
                    <div
                        style={{
                            marginTop: '0.75rem',
                            padding: '0.75rem 1rem',
                            background: 'var(--bg-surface)',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer',
                            border: spiesKnowEachOther ? '2px solid var(--primary)' : '1px solid var(--border-color)'
                        }}
                        onClick={() => setSpiesKnowEachOther(!spiesKnowEachOther)}
                    >
                        <input
                            type="checkbox"
                            checked={spiesKnowEachOther}
                            onChange={() => { }}
                            style={{ cursor: 'pointer', width: '18px', height: '18px' }}
                        />
                        <span style={{
                            fontWeight: 600,
                            color: spiesKnowEachOther ? 'var(--primary)' : 'var(--text-main)',
                            fontSize: '0.95rem'
                        }}>
                            Spies know each other
                        </span>
                    </div>
                )}

                {players.length < 3 && (
                    <div style={{
                        marginTop: '0.75rem',
                        padding: '0.5rem 0.75rem',
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid var(--danger)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--danger)',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 600
                    }}>
                        ⚠️ Need at least 3 players to start a game.
                    </div>
                )}
            </div>

            {/* Navigation / Action buttons */}
            <div className="btn-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    onClick={handleStart}
                    disabled={players.length < 3}
                    style={{ width: '100%', opacity: players.length < 3 ? 0.5 : 1, fontSize: '1.1rem' }}
                >
                    🚀 Start Next Round ({players.length} Players)
                </button>
                <button
                    type="button"
                    className="btn btn-secondary btn-lg"
                    onClick={onCancel}
                    style={{ width: '100%' }}
                >
                    ← Back
                </button>
            </div>
        </div>
    );
}

