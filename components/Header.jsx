'use client';
import { useRouter } from "next/navigation";
import { FaUser, FaSignInAlt, FaSignOutAlt, FaBuilding } from 'react-icons/fa';
import destroySession from '@/app/actions/destroySession';
import { toast } from "react-toastify";
import { useAuth } from "@/context/authContext"; 


const Header = () => {
  const router = useRouter();
  
  const { isAuthenticated, setIsAuthenticated } = useAuth();

    

  const handleLogout = async () => {
    const { success, error } = await destroySession();

    if (success) {
      setIsAuthenticated(false);
      router.push('/login');
    } else {
      toast.error(error);
    }
  }

  return (
    <header className="bg-gray-100">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/">
              <img className="h-12 w-12" src="../assests/images/logo.jpg" alt="Bookit" />
            </a>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                >
                  Rooms
                </a>
                {/* Logged In Only */}
                { isAuthenticated && (
                  <>
                    <a
                      href="/bookings"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      Bookings
                    </a>
                    <a
                      href="/Rooms/add"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      Add Room
                    </a>
                    <a
                      href="/Rooms/my"
                      className="rounded-md px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
                    >
                      My Rooms
                    </a>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* Right Side Menu */}
          <div className="ml-auto">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Logged Out Only */}
              { !isAuthenticated && (
                <>
                  <a
                    href="/login"
                    className="mr-3 text-gray-800 hover:text-gray-600"
                  >
                    <FaSignInAlt className='inline mr-1'/> Login
                  </a>
                  <a
                    href="/register"
                    className="mr-3 text-gray-800 hover:text-gray-600"
                  >
                    <FaUser className='inline mr-1'/> Register
                  </a>
                </>
              )}

              { isAuthenticated && (
              <>
                <a href="/Rooms/my">
                  <FaBuilding className='inline mr-1'/> My Rooms
                </a>
                <button onClick={handleLogout} className="mx-3 text-gray-800 hover:text-gray-600">
                  <FaSignOutAlt className='inline mr-1'/> Sign Out
                </button>
              </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className="md:hidden">
        <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
          <a
            href="/"
            className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
          >
            Rooms
          </a>
          {/* Logged In Only */}
          { isAuthenticated && (
            <>
              <a
                href="/bookings"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
              >
                Bookings
              </a>
              <a
                href="/Rooms/add"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-800 hover:bg-gray-700 hover:text-white"
              >
                Add Room
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header;