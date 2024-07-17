


export function Sidebar() {
  function handleLogout() {
    // Lógica de logout
  }
  return (
    <div className="flex h-screen">
      <div className="w-1/4 bg-gray-800">
        {/* Conteúdo da sidebar */}
        <button className="text-white" onClick={handleLogout}>Logout</button>
      </div>
      <div className="w-3/4 bg-gray-200">
        {/* Conteúdo principal */}
      </div>
    </div>
  );
}
