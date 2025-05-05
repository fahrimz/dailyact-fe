import { Link } from "@tanstack/react-router";
import type { User } from "@/lib/api";
import { appMenu } from "@/data/appMenu";
import { cn } from "@/lib/utils";

export default function Header({ user }: { user: User | null }) {
  return (
    <header className="border-b bg-white sticky top-0 h-(--h-header) flex items-center z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              DailyAct
            </Link>

            {user && (
              <nav className="hidden md:flex items-center space-x-4">
                {appMenu
                  .filter((x) => x.roles ? x.roles?.includes(user.role) : true)
                  .map((x, i) => (
                    <Link
                      key={i}
                      to={x.href}
                      className={cn(
                        "text-sm font-medium text-gray-700 hover:text-gray-900 [&.active]:text-blue-500 [&.active]:font-bold"
                      )}
                    >
                      {x.label}
                    </Link>
                  ))}
              </nav>
            )}
          </div>

          <div className="hidden md:flex items-center gap-4">
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

          {/* mobile nav */}
          {user && (
            <div className="flex md:hidden gap-3 rtl:space-x-reverse">
              <label className="cursor-pointer z-30 relative inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-black rounded-lg md:hidden dark:text-black">
                <input
                  className="peer hidden"
                  type="checkbox"
                  id="mobile-menu"
                />
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
                <div className="peer-checked:translate-x-0 peer-checked:*:translate-y-0 fixed w-full left-0 top-(--h-header) -mt-0.5 z-10 overflow-hidden pointer-events-none peer-checked:pointer-events-auto">
                  <div className="-translate-y-full relative transition-transform duration-150 ease-in-out font-normal divide-y bg-white">
                    <ul className="py-2 block text-sm text-gray-700 dark:text-gray-200">
                      {appMenu
                      .filter((x) => x.roles ? x.roles?.includes(user.role) : true)
                      .map((x, i) => (
                        <li key={i} className="px-4 py-2">
                          <Link
                            to={x.href}
                            className={cn(
                              "block text-sm font-medium text-gray-700 hover:text-gray-900 [&.active]:text-blue-500 [&.active]:font-bold"
                            )}
                          >
                            {x.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </label>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
