import React, { useState, useEffect } from 'react';
import { Users, LogOut, RotateCcw, Search, Trash2 } from 'lucide-react';

export default function SeatingSystem() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [seats, setSeats] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [loading, setLoading] = useState(true);

  // โหลดข้อมูล
  useEffect(() => {
    fetchSeats();
    const interval = setInterval(fetchSeats, 2000);
    return () => clearInterval(interval);
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await fetch('/api/seats');
      const data = await response.json();
      setSeats(data.seats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const updateSeats = async (newSeats) => {
    try {
      await fetch('/api/seats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats: newSeats }),
      });
      setSeats(newSeats);
    } catch (error) {
      console.error('Error updating seats:', error);
      alert('❌ อัปเดตไม่ได้ ลองใหม่อีกครั้ง');
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

  const handleSeatClick = (seatId) => {
    if (!isLoggedIn) {
      alert('⚠️ ต้อง login ก่อนจองที่นั่ง');
      return;
    }

    const newSeats = [...seats];
    const seat = newSeats[seatId - 1];

    if (seat.occupant === username) {
      newSeats[seatId - 1] = { ...seat, occupied: false, occupant: null };
    } else if (!seat.occupied) {
      const userSeat = newSeats.findIndex(s => s.occupant === username);
      if (userSeat !== -1) {
        newSeats[userSeat] = { ...newSeats[userSeat], occupied: false, occupant: null };
      }
      newSeats[seatId - 1] = { ...seat, occupied: true, occupant: username };
    } else {
      alert('❌ ที่นั่งนี้ถูกจองแล้ว');
      return;
    }

    updateSeats(newSeats);
  };

  const handleResetAll = () => {
    if (window.confirm('🔄 ต้องการ reset ทั้งระบบใช่ไหม?')) {
      const reset = Array(36).fill(null).map((_, i) => ({
        id: i + 1,
        occupied: false,
        occupant: null,
      }));
      updateSeats(reset);
    }
  };

  const handleDeleteSeat = (seatId) => {
    const seat = seats[seatId - 1];
    if (seat.occupant) {
      const newSeats = [...seats];
      newSeats[seatId - 1] = { ...seat, occupied: false, occupant: null };
      updateSeats(newSeats);
    }
  };

  const userSeat = seats.find(s => s.occupant === username);
  const occupiedCount = seats.filter(s => s.occupied).length;
  const filteredSeats = searchName
    ? seats.filter(s => s.occupant?.toLowerCase().includes(searchName.toLowerCase()))
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
        {/* Header */}
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
        }}>
          <h1 style={{
            fontSize: '3em',
            fontWeight: 'bold',
            marginBottom: '10px',
            background: 'linear-gradient(45deg, #60a5fa, #fbbf24, #34d399)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            🎮 Classroom Seating System
          </h1>
          <p style={{ fontSize: '1.1em', color: '#cbd5e1' }}>
            36 ที่นั่ง | {occupiedCount} ที่จอง | {36 - occupiedCount} ว่าง
          </p>
        </div>

        {/* Login Section */}
        {!isLoggedIn ? (
          <div style={{
            background: 'rgba(30, 27, 75, 0.8)',
            border: '2px solid #60a5fa',
            padding: '30px',
            borderRadius: '15px',
            marginBottom: '30px',
            textAlign: 'center',
          }}>
            <h2 style={{ fontSize: '1.5em', marginBottom: '20px' }}>เข้าสู่ระบบ</h2>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <input
                type="text"
                placeholder="กรอกชื่อของคุณ..."
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
                  fontSize: '1em',
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
            {/* User Info */}
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
                <p style={{ margin: 0, fontSize: '0.9em', color: '#cbd5e1' }}>👤 ชื่อผู้ใช้</p>
                <p style={{
                  margin: '5px 0 0 0',
                  fontSize: '1.5em',
                  fontWeight: 'bold',
                  color: '#34d399',
                }}>
                  {username}
                </p>
                {userSeat && (
                  <p style={{ margin: '5px 0 0 0', color: '#fbbf24' }}>
                    📍 ที่นั่งของคุณ: <strong>ที่ {userSeat.id}</strong>
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

            {/* Search */}
            <div style={{
              background: 'rgba(30, 27, 75, 0.8)',
              border: '2px solid #a78bfa',
              padding: '15px',
              borderRadius: '12px',
              marginBottom: '30px',
              display: 'flex',
              gap: '10px',
            }}>
              <input
                type="text"
                placeholder="🔍 ค้นหาชื่อ..."
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 15px',
                  fontSize: '1em',
                  border: '2px solid #a78bfa',
                  borderRadius: '8px',
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            {/* Seating Grid */}
            <div style={{
              background: 'rgba(30, 27, 75, 0.8)',
              border: '2px solid #60a5fa',
              padding: '25px',
              borderRadius: '15px',
            }}>
              <h3 style={{ marginTop: 0, color: '#60a5fa', textAlign: 'center', marginBottom: '20px' }}>
                📍 โต๊ะเรียน (6 แถว × 6 คอลัมน์)
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)',
                gap: '12px',
                marginBottom: '20px',
              }}>
                {filteredSeats.map((seat) => {
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
                          transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (!isOccupied || isUserSeat) {
                            e.target.style.transform = 'translateY(-5px)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ fontSize: '1.2em', marginBottom: '5px' }}>
                          {isUserSeat ? '👑' : isOccupied ? '❌' : '🪑'}
                        </div>
                        <div style={{ fontSize: '0.8em' }}>#{seatNum}</div>
                        {isOccupied && (
                          <div style={{ fontSize: '0.7em', marginTop: '5px', opacity: 0.8 }}>
                            {seat.occupant}
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
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '30px',
                marginTop: '20px',
                paddingTop: '15px',
                borderTop: '1px solid #475569',
              }}>
                <div>🪑 ว่าง</div>
                <div>❌ จองแล้ว</div>
                <div>👑 ที่นั่งของคุณ</div>
              </div>
            </div>

            {/* Stats */}
            <div style={{
              marginTop: '30px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
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
                <p style={{ margin: 0, color: '#cbd5e1' }}>จองแล้ว</p>
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
                <p style={{ margin: 0, color: '#cbd5e1' }}>อัตราการจอง</p>
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
