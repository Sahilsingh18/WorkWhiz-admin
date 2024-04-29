import Link from "next/link";

export default function Footer() {
  return <>
    <footer className="border-t bg-gray-50 border-zinc-200">
      <div className="px-4 py-8 mx-auto max-w-screen-2xl sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="flex justify-center text-teal-600 sm:justify-start">
            <Link className="flex items-center gap-2 font-bold text-teal-600 " href="/">
              <span className="sr-only">Home</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clip-rule="evenodd" />
              </svg>

              Admin
            </Link>
          </div>

          <p className="mt-4 text-sm text-center text-gray-500 lg:mt-0 lg:text-right">
            Copyright &copy; 2024. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  </>
}