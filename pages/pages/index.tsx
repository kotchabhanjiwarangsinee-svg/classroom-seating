import React, { useState, useEffect } from 'react';

export default function SeatingSystem() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [seats, setSeats] = useState<any[]>([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await fetch('/api/seats');
      const data = await response.json();
      setSeats(data.seats || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const updateSeats = async (newSeats: any[]) => {
    try {
      await fetch('/api/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats: newSeats }),
      });
      setSeats(newSeats);
    } catch (error) {
      console.error('Error updating seats:', error);
      alert('❌ อัปเดตไม่ได้ ลองใหม่');
    }
  };

  const handleLogin = () => {
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setSearchName('');
  };

  const handleSeatClick = (seatId: number) => {
    if (!isLoggedIn) {
      alert('⚠️ ต้อง login ก่อน');
      return;
    }

    const newSeats = [...seats];
    const seat = newSeats[seatId - 1];

    if (seat.occupant === username) {
      newSeats[seatId - 1] = { ...seat, occupied: false, occupant: null };
    } else if (!seat.occupied) {
      const userSeat = newSeats.findIndex((s: any) => s.occupant === username);
      if (userSeat !== -1) {
        newSeats[userSeat] = { ...newSeats[userSeat], occupied: false, occupant: null };
      }
      newSeats[seatId - 1] = { ...seat, occupied: true, occupant: username };
    } else {
      alert('❌ ที่นั่งนี้จองแล้ว');
      return;
    }

    updateSeats(newSeats);
  };

  const handleResetAll = () => {
    if (window.confirm('🔄 Reset ทั้งระบบ?')) {
      const reset = Array(36).fill(null).map((_, i) => ({
        id: i + 1,
        occupied: false,
        occupant: null,
      }));
      updateSeats(reset);
    }
  };

  const handleDeleteSeat = (seatId: number) => {
    const seat = seats[seatId - 1];
    if (seat.occupant) {
      const newSeats = [...seats];
      newSeats[seatId - 1] = { ...seat, occupied: false, occupant: null };
      updateSeats(newSeats);
    }
  };

  const userSeat = seats.find((s: any) => s.occupant === username);
  const occupiedCount = seats.filter((s: any) => s.occupied).length;
  const filteredSeats = searchName
    ? seats.filter((s: any) => s.occupant?.toLowerCase().includes(searchName.toLowerCase()))
    : seats;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #2d1b69 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: '1.5em',
      }}>
        ⏳ Loading...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #2d1b69 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{
            fontSize: '2.5em',
            fontWeight: 'bold',
            marginBottom: '10px',
            background: 'linear-gradient(45deg, #60a5fa, #fbbf24, #34d399)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🎮 Classroom Seating
          </h1>
          <p style={{ fontSize: '1.1em', color: '#cbd5e1' }}>
            36 ที่นั่ง | {occupiedCount} จอง | {36 - occupiedCount} ว่าง
          </p>
        </div>

        {!isLoggedIn ? (
          <div style={{
            background: 'rgba(30, 27, 75, 0.8)',
            border: '2px solid #60a5fa',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '30px',
            textAlign: 'center',
          }}>
            <h2 style={{ marginBottom: '20px' }}>เข้าสู่ระบบ</h2>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <input
                type="text"
                placeholder="ชื่อของคุณ..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                style={{
                  padding: '12px 15px',
                  fontSize: '1em',
                  border: '2px solid #60a5fa',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#fff',
                  outline: 'none',
                  width: '250px',
                }}
              />
              <button
                onClick={handleLogin}
                style={{
                  padding: '12px 30px',
                  background: 'linear-gradient(45deg, #60a5fa, #3b82f6)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                LOGIN 🔑
              </button>
            </div>
          </div>
        ) : (
          <>
            <div style={{
              background: 'rgba(30, 27, 75, 0.8)',
              border: '2px solid #34d399',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <p style={{ margin: 0, color: '#cbd5e1' }}>👤 {username}</p>
                {userSeat && (
                  <p style={{ margin: '5px 0 0 0', color: '#fbbf24' }}>
                    📍 ที่ {userSeat.id}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleResetAll}
                  style={{
                    padding: '10px 15px',
                    background: '#f97316',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  🔄 Reset
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '10px 15px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Logout
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(30, 27, 75, 0.8)',
              border: '2px solid #a78bfa',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '30px',
            }}>
              <input
                type="text"
                placeholder="🔍 ค้นหา..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 15px',
                  fontSize: '1em',
                  border: '2px solid #a78bfa',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#fff',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{
              background: 'rgba(30, 27, 75, 0.8)',
              border: '2px solid #60a5fa',
              padding: '25px',
              borderRadius: '15px',
            }}>
              <h3 style={{ marginTop: 0, color: '#60a5fa', textAlign: 'center', marginBottom: '20px' }}>
                📍 โต๊ะเรียน
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}>
                {filteredSeats.map((seat: any) => {
                  const seatNum = seats.indexOf(seat) + 1;
                  const isUserSeat = seat.occupant === username;
                  const isOccupied = seat.occupied;

                  return (
                    <div key={seatNum} style={{ position: 'relative' }}>
                      <button
                        onClick={() => handleSeatClick(seatNum)}
                        style={{
                          width: '100%',
                          padding: '20px',
                          fontSize: '0.9em',
                          fontWeight: 'bold',
                          border: isUserSeat ? '3px solid #fbbf24' : isOccupied ? '2px solid #ef4444' : '2px solid #60a5fa',
                          borderRadius: '10px',
                          background: isUserSeat
                            ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                            : isOccupied
                            ? 'linear-gradient(135deg, #7f1d1d, #991b1b)'
                            : 'linear-gradient(135deg, #1e3a8a, #1e40af)',
                          color: isOccupied && !isUserSeat ? '#fca5a5' : '#fff',
                          cursor: isOccupied && !isUserSeat ? 'not-allowed' : 'pointer',
                        }}
                      >
                        <div style={{ fontSize: '1.2em', marginBottom: '5px' }}>
                          {isUserSeat ? '👑' : isOccupied ? '❌' : '🪑'}
                        </div>
                        <div>#{seatNum}</div>
                        {isOccupied && (
                          <div style={{ fontSize: '0.6em', marginTop: '5px' }}>
                            {seat.occupant?.slice(0, 8)}
                          </div>
                        )}
                      </button>
                      {isOccupied && (
                        <button
                          onClick={() => handleDeleteSeat(seatNum)}
                          style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            width: '24px',
                            height: '24px',
                            padding: 0,
                            background: '#ef4444',
                            border: 'none',
                            borderRadius: '50%',
                            color: '#fff',
                            cursor: 'pointer',
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{
              marginTop: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '15px',
            }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.2)',
                border: '2px solid #22c55e',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, color: '#cbd5e1' }}>ว่าง</p>
                <p style={{ margin: '10px 0 0 0', fontSize: '2em', fontWeight: 'bold', color: '#22c55e' }}>
                  {36 - occupiedCount}
                </p>
              </div>
              <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '2px solid #ef4444',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, color: '#cbd5e1' }}>จอง</p>
                <p style={{ margin: '10px 0 0 0', fontSize: '2em', fontWeight: 'bold', color: '#ef4444' }}>
                  {occupiedCount}
                </p>
              </div>
              <div style={{
                background: 'rgba(96, 165, 250, 0.2)',
                border: '2px solid #60a5fa',
                padding: '20px',
                borderRadius: '10px',
                textAlign: 'center',
              }}>
                <p style={{ margin: 0, color: '#cbd5e1' }}>อัตรา</p>
                <p style={{ margin: '10px 0 0 0', fontSize: '2em', fontWeight: 'bold', color: '#60a5fa' }}>
                  {Math.round((occupiedCount / 36) * 100)}%
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
