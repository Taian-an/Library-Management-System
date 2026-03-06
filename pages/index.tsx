import { useState } from 'react';
import AdminPanel from '../src/components/AdminPanel';
import UserPanel from '../src/components/UserPanel';
import type { User } from '../src/types';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.fromEntries(formData)),
    });

    const data: unknown = await res.json();
    if (res.ok) {
      const typedData = data as { token: string; user: User };
      localStorage.setItem('token', typedData.token);
      setUser(typedData.user);
    } else {
      alert('Login failed');
    }
  };

  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
          <h2>Library System Login</h2>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <span>Logged as: {user.email} ({user.role})</span>
        <button onClick={() => setUser(null)}>Logout</button>
      </nav>
      {user.role === 'ADMIN' ? <AdminPanel /> : <UserPanel />}
    </div>
  );
}

export default App;