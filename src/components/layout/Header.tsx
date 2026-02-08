export default function Header() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#111] px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold text-white hidden md:inline-block">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleLogout}
          className="text-sm font-medium px-4 py-2 bg-purple-600 text-white rounded-lg transition-all hover:bg-purple-700 active:scale-95"
        >
          Logout
        </button>
      </div>
    </header>
  );
}