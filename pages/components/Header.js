import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router";
import { useState } from "react";


export default function Header() {
  const { data: session } = useSession()
  const router = useRouter();
  const { pathname } = router;
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const active = 'text-green-600 transition hover:text-green-500/75 p-3 rounded-md bg-gray-200'
  const inActive = 'text-gray-500 transition hover:text-gray-500/75 p-3'

  if (session) {
    return <>
      <header className="sticky top-0 z-30 mx-auto bg-white border-b border-zinc-200">
        <div className="px-4 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-1 md:flex md:items-center md:gap-12">
              <Link className="flex items-center gap-2 font-bold text-teal-600 " href="/">
                <span className="sr-only">Home</span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                  <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
                </svg>

                Admin
              </Link>
            </div>

            <div className="md:flex md:items-center md:gap-8">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-3 text-lg">
                  <li>
                    <Link
                      className={pathname === '/' ? active : inActive}
                      href="/"
                    >
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={pathname === '/products' ? active : inActive}
                      href="/products"
                    >
                      Service Agent
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={pathname === '/servies' ? active : inActive}
                      href="/services"
                    >
                      Service
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={pathname === '/orders' ? active : inActive}
                      href="/orders"
                    >
                      Orders
                    </Link>
                  </li>

                  <li>
                    <Link
                      className={pathname === '/settings' ? active : inActive}
                      href="/settings"
                    >
                      Settings
                    </Link>
                  </li>
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                  <div className="w-10 h-10">
                    <Image class="h-full w-full rounded-full object-contain object-center" src={session.user.image} alt={session.user.email} width={34} height={34} />
                  </div>
                </div>

                {/* Mobile navigation button */}
                <div className="block md:hidden">
                  <button
                    onClick={toggleMobileNav}
                    className="p-2 text-gray-600 transition bg-gray-100 rounded hover:text-gray-600/75"
                  >
                    {isMobileNavOpen ? (
                      // X icon for close
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    ) : (
                      // Menu icon for open
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Mobile navigation links */}
                {isMobileNavOpen && (
                  <div className="absolute right-0 p-6 text-lg bg-white border rounded shadow-lg md:hidden top-16 border-zinc-200">
                    <ul className="flex flex-col items-start gap-4">
                      <li>
                        <Link
                          onClick={toggleMobileNav}
                          className={pathname === '/' ? active : inActive}
                          href="/"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={toggleMobileNav}
                          className={pathname === '/products' ? active : inActive}
                          href="/products"
                        >
                          Products
                        </Link>
                      </li>

                      <li>
                        <Link
                          onClick={toggleMobileNav}
                          className={pathname === '/services' ? active : inActive}
                          href="/services"
                        >
                          Categories
                        </Link>
                      </li>

                      <li>
                        <Link
                          onClick={toggleMobileNav}
                          className={pathname === '/orders' ? active : inActive}
                          href="/orders"
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={toggleMobileNav}
                          className={pathname === '/settings' ? active : inActive}
                          href="/settings"
                        >
                          Settings
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  }
}