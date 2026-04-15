import useAuth from "../../features/auth/useAuth";

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.email}</p>

      <button type="button" onClick={logout}>
        Logout
      </button>
    </main>
  );
}

export default DashboardPage;