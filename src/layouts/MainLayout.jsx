import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  );
}
export default MainLayout;
