import React, { useState } from 'react';

// Demo users
const DEMO_USERS = [
  { username: 'user1', password: 'pass123' },
  { username: 'user2', password: 'pass123' },
  { username: 'user3', password: 'pass123' },
];

// Simple Calendar (for demo)
function Calendar({ tasks, onDateClick }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold mb-2">Kalender (nächste 7 Tage)</h3>
      <div className="flex gap-2">
        {days.map((d, idx) => (
          <div
            key={idx}
            className="flex-1 border rounded p-2 cursor-pointer hover:bg-blue-100"
            onClick={() => onDateClick(d)}
          >
            <div className="text-xs text-gray-500">{d.toLocaleDateString()}</div>
            <div className="text-sm">
              {tasks.filter(t => t.date && new Date(t.date).toDateString() === d.toDateString()).map(t => (
                <div key={t.id} className="bg-blue-50 rounded px-1 my-1 text-xs">{t.title}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Login form
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = e => {
    e.preventDefault();
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Falscher Benutzername oder Passwort');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-xs">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Benutzername"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit">
            Login
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500">
          Demo-User: user1, user2, user3<br />Passwort: pass123
        </div>
      </div>
    </div>
  );
}

// File upload with drag & drop
function FileUpload({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const handleDrop = e => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };
  const handleChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };
  return (
    <div
      className={`border-2 border-dashed rounded p-4 text-center ${dragActive ? 'bg-blue-100' : 'bg-gray-50'}`}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        className="hidden"
        id="file-upload-input"
        onChange={handleChange}
      />
      <label htmlFor="file-upload-input" className="cursor-pointer">
        <div className="text-blue-600 font-bold">Dateien hierher ziehen oder klicken zum Hochladen</div>
      </label>
    </div>
  );
}

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Beispielaufgabe', date: null, files: [] },
  ]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Mobile nav
  const [nav, setNav] = useState('tasks');

  if (!user) return <Login onLogin={setUser} />;

  // Add new task
  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTaskTitle, date: null, files: [] }]);
      setNewTaskTitle('');
      setShowTaskModal(false);
    }
  };

  // Assign file to task
  const handleFileUpload = files => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, files: [...t.files, ...files] } : t));
    }
  };

  // Assign date to task
  const handleDateClick = date => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, date: date.toISOString() } : t));
    }
  };

  // Logout
  const handleLogout = () => setUser(null);

  // Responsive nav
  const navItems = [
    { key: 'tasks', label: 'Aufgaben' },
    { key: 'calendar', label: 'Kalender' },
    { key: 'files', label: 'Dateien' },
  ];

  // Collect all files
  const allFiles = tasks.flatMap(t => t.files.map(f => ({ ...f, task: t.title })));

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-sm">BB</span>
          </div>
          <span className="font-bold text-blue-700 text-lg">Bluebirdhub</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Eingeloggt als: <b>{user.username}</b></span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <nav className="flex justify-center gap-4 bg-blue-100 py-2 md:py-0 md:flex-row flex-col md:items-center">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`px-4 py-2 rounded ${nav === item.key ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'}`}
            onClick={() => setNav(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
        {nav === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-xl">Aufgaben</h2>
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowTaskModal(true)}>+ Neue Aufgabe</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-white rounded shadow p-4 cursor-pointer hover:bg-blue-50" onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}>
                  <div className="font-bold text-blue-700">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.date ? `Fällig: ${new Date(task.date).toLocaleDateString()}` : 'Kein Termin'}</div>
                  <div className="mt-2 text-xs text-gray-600">{task.files.length} Datei(en) angehängt</div>
                </div>
              ))}
            </div>
            {/* Task Modal */}
            {showTaskModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-600" onClick={() => { setShowTaskModal(false); setSelectedTask(null); }}>&times;</button>
                  {selectedTask ? (
                    <div>
                      <h3 className="font-bold text-lg mb-2">{selectedTask.title}</h3>
                      <div className="mb-2">
                        <b>Fälligkeitsdatum:</b> {selectedTask.date ? new Date(selectedTask.date).toLocaleDateString() : 'Kein Termin'}
                        <button className="ml-2 text-blue-600 underline text-xs" onClick={() => handleDateClick(new Date())}>Heute setzen</button>
                      </div>
                      <div className="mb-2">
                        <b>Dateien:</b>
                        <ul className="list-disc ml-5">
                          {selectedTask.files.map((f, i) => <li key={i}>{f.name || 'Datei'}</li>)}
                        </ul>
                      </div>
                      <FileUpload onUpload={handleFileUpload} />
                      <div className="mt-4">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowTaskModal(false)}>Schließen</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-lg mb-2">Neue Aufgabe</h3>
                      <input
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Titel der Aufgabe"
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        autoFocus
                      />
                      <button className="bg-blue-600 text-white px-3 py-1 rounded w-full" onClick={addTask}>Anlegen</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {nav === 'calendar' && (
          <Calendar
            tasks={tasks}
            onDateClick={date => {
              if (selectedTask) handleDateClick(date);
            }}
          />
        )}
        {nav === 'files' && (
          <div>
            <h2 className="font-bold text-xl mb-2">Dateimanager</h2>
            <div className="bg-white rounded shadow p-4">
              <div className="mb-2 text-xs text-gray-500">Alle Dateien, automatisch getaggt nach Aufgabe</div>
              <ul>
                {allFiles.length === 0 && <li className="text-gray-400">Keine Dateien hochgeladen</li>}
                {allFiles.map((f, i) => (
                  <li key={i} className="mb-1 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{f.task}</span>
                    <span>{f.name || 'Datei'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-white text-center text-xs text-gray-400 p-2">Bluebirdhub &copy; 2025</footer>
    </div>
  );
}

export default App;