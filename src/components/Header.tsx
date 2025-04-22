import { Link } from "@tanstack/react-router";
import type { User } from "@/lib/api";

export default function Header({user}: {user: User | null}) {
  return (
    <header className="border-b bg-white sticky top-0 h-(--h-header) flex items-center">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-xl font-bold text-gray-900"
            >
              DailyAct
            </Link>

            {user && (
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>
                <Link
                  to="/activities"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Activities
                </Link>
                <Link
                  to="/categories"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Categories
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
            {user && (
              <Link
                to={"/profile"}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2"
              >
                {user ? (
                  <>
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                    <span>{user.name}</span>
                  </>
                ) : (
                  "Login"
                )}
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
