import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import img1 from '@/public/product.png'

// Utility function to format price with a comma for thousands
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const pageSize = 10; // Number of serviceAgent per page

export default function ServiceAgent() {
  const [serviceAgent, setServiceAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios.get('/api/serviceAgents').then(response => {

      setServiceAgents(response.data);
      setLoading(false);
    });
  }, []);

  // Calculate the total number of pages
  const totalPages = Math.ceil(serviceAgent.length / pageSize);

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(currentPage * pageSize, serviceAgent.length);

  const productsToDisplay = serviceAgent.slice(startIndex, endIndex);

  const changePage = (page) => {
    setCurrentPage(page);
    setLoading(false)
  };

  return (
    <>
      <header>
        <div className="px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8 max-md:flex-col">
          <div className="sm:flex sm:items-center sm:justify-between">
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl">
                All Service Agents
              </h1>
              <p className="mt-1.5 text-md text-gray-500">
                Let&apos;s create a new Service Agnet! 👷
              </p>
            </div>

            <div className="flex flex-col max-w-md gap-4 mt-4 sm:mt-0 sm:flex-row sm:items-center">
              <Link
                href={'/products/new'}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-green-600 px-5 py-3 text-green-600 transition hover:bg-green-50 hover:text-green-700 focus:outline-none focus:ring"
                type="button"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium"> Add Service Agnet</span>
              </Link>
            </div>
          </div>
          <hr className="h-px my-8 bg-gray-300 border-0" />
        </div>
      </header>

      <div className="px-4 mx-auto overflow-x-auto">
        {serviceAgent.length === 0 ? (
          <p className="w-full text-center">No Service Agent available.</p>
        ) : (
          <>
            <table className="min-w-full bg-white border divide-y-2 divide-gray-200 rounded text-md">
              <thead>
                {/* Table headers here */}
              </thead>
              {productsToDisplay.map((product, index) => (
                <tbody className="divide-y divide-gray-200" key={serviceAgent._id}>
                  <tr>
                    <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      {index + 1}
                    </td>
                    <td className="flex items-center gap-1 px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                      <div class="h-10 w-10">
                        <img
                          class="h-full w-full rounded-full object-cover object-center bg-gray-200"
                          src={product.images?.[0] || img1}
                          alt={product.name}
                        />

                      </div>
                      {product.name}
                    </td>
                    <td className="max-w-md px-4 py-2 text-gray-700 truncate whitespace-nowrap">{product.description}</td>
                    <td className="px-4 py-2 text-gray-700 whitespace-nowrap">Rps. {formatPrice(product.price)}</td>
                    <td className="flex gap-4 px-4 py-2 whitespace-nowrap">
                      <Link
                        href={'/products/edit/' + product._id}
                        className="inline-block px-4 py-2 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-700"
                      >
                        Edit
                      </Link>
                      <Link
                        href={'/products/delete/' + product._id}
                        className="inline-block px-4 py-2 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                      >
                        Delete
                      </Link>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>

            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => changePage(i + 1)}
                    className={`mx-2 px-3 py-2 rounded ${i + 1 === currentPage
                        ? 'bg-blue-300 text-slate-900'
                        : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
