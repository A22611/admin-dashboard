import Sidebar from "./Sidebar";
import Header from "./Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        
        {/* Main Content Area */}
        <main className="p-4 md:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}