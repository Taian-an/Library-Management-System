import { useState } from 'react';
import AdminPanel from './components/AdminPanel';
import UserPanel from './components/UserPanel';
import type { User } from './types';

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
    }
  };

  if (!user) {
    return (
      <form onSubmit={handleLogin}>
        <input name="email" type="email" required />
        <input name="password" type="password" required />
        <button type="submit">Login</button>
      </form>
    );
  }

  return (
    <div>
      <nav>
        <span>Logged as: {user.email}</span>
        <button onClick={() => setUser(null)}>Logout</button>
      </nav>
      {user.role === 'ADMIN' ? <AdminPanel /> : <UserPanel />} [cite: 61, 153]
    </div>
  );
}

export default App;