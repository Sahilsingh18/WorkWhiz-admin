import axios from "axios";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Services() {
  const [name, setName] = useState('');
  const [services, setServices] = useState([]);
  const [parentService, setParentService] = useState('');
  const [editedService, setEditedService] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const closeModal = () => {
    setShowModal(false);
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  function fetchServices() {
    axios.get('/api/services').then(result => {
      setServices(result.data)
    })
  }

  async function saveService(ev) {
    ev.preventDefault();
    const data = { name, parentService }
    if (editedService) {
      data._id = editedService._id
      await axios.put('/api/services', data);
      setEditedService(null);
      toast.success('Service updated!!')
    } else {
      await axios.post('/api/services', data);
      toast.success('Service created successfully')
    }
    setName('')
    setParentService('')
    fetchServices();
  }

  function editService(service) {
    setEditedService(service);
    setName(service.name);
    setParentService(service.parent?._id)
  }

  async function deleteService(service) {
    const { _id } = service;
    await axios.delete('/api/services?_id=' + _id);
    closeModal();
    fetchServices();
    toast.success('Service deleted!!')
  }

  return <>
    <header>
      <div className="px-4 py-8 mx-auto sm:px-6 sm:py-12 lg:px-8">
        <div className="flex items-center max-sm:flex-col sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-3xl">
              All Services
            </h1>
            <p className="mt-1.5 text-md text-gray-500">
              <span>
                {editedService ? (
                  <>
                    Editing service,{' '}
                    <span className="font-bold text-green-600">{editedService.name}</span>  &nbsp;
                    <span className="font-bold text-blue-500">{editedService?.parent?.name}</span>
                  </>
                ) : (
                  'Create a new Service!'
                )}
              </span>

            </p>
          </div>

          <form onSubmit={saveService} className="flex gap-4 mt-4 max-sm:flex-col sm:mt-3 max-sm:px-4 sm:items-center">
            <div >
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2.5 text-gray-500">+</div>
                <div class="absolute inset-y-0 right-0 flex items-center text-gray-500">
                  <select class="h-full rounded-md border-transparent bg-transparent py-0 pl-3  pr-7 text-gray-500 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    value={parentService}
                    onChange={ev => setParentService(ev.target.value)}
                  >
                    <option>No parent</option>
                    {services.length > 0 && services.map(service => (
                      <option key={service._id} value={service._id}>{service.name}</option>
                    ))}
                  </select>
                </div>
                <input type="text" id="example11" class="block w-[400px] rounded-md border border-slate-300 py-2.5 pl-8 pr-16 shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500" placeholder="Service Name"
                  value={name}
                  onChange={ev => setName(ev.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" class="rounded-lg border border-blue-100 bg-blue-100 px-5 py-3 text-center text-sm font-medium text-blue-600 transition-all hover:border-blue-200 hover:bg-blue-200 focus:ring focus:ring-blue-50 disabled:border-blue-50 disabled:bg-blue-50 disabled:text-blue-400">
              {editedService ? 'Save changes' : 'Save Service'}
            </button>
          </form>
        </div>
        <hr className="h-px my-8 bg-gray-300 border-0" />
      </div>
    </header>

    <div className="p-4 mx-auto overflow-x-auto">
      <table className="min-w-full bg-white border divide-y-2 divide-gray-200 rounded text-md">
        <thead>
          <tr>
            <th className="px-4 py-2 font-bold text-gray-900 whitespace-nowrap text-start">
              #
            </th>
            <th className="px-4 py-2 font-bold text-gray-900 whitespace-nowrap text-start">
              Service Name
            </th>
            <th className="px-4 py-2 font-bold text-gray-900 whitespace-nowrap text-start">
              Parent Service
            </th>
            <th className="px-4 py-2 font-bold text-gray-900 whitespace-nowrap text-start">Status</th>
          </tr>
        </thead>
        {services.map((service, index) => (
          <tbody key={service._id} className="divide-y divide-gray-200" >
            <tr>
              <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                {index + 1}
              </td>
              <td className="px-4 py-2 text-gray-700 whitespace-nowrap"> {service.name} </td>
              <td className="px-4 py-2 text-gray-700 whitespace-nowrap"> {service?.parent?.name} </td>
              <td className="flex gap-4 px-4 py-2 whitespace-nowrap">
                <Link
                  onClick={() => editService(service)}
                  href={'/services'}
                  className="inline-block px-4 py-2 text-xs font-medium text-white bg-green-500 rounded hover:bg-green-700"
                >
                  Edit
                </Link>
                <div
                  onKeyDown={() => setShowModal(false)}
                  className="inline-block text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                >
                  <button onClick={toggleModal} className="px-4 py-2">
                    Delete
                  </button>
                  {showModal && (
                    <>
                      <div className="fixed inset-0 z-10 bg-gray-300/50"></div>
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
                        <div className="w-full mx-auto overflow-hidden bg-white rounded-lg shadow-xl sm:max-w-sm">
                          <div className="relative p-5">
                            <div className="text-center">
                              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-5 text-red-500 bg-red-100 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">Delete blog post</h3>
                                <div className="max-w-sm mt-2 text-sm text-gray-500">Are you sure you want to delete this {service?.name}?</div>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-5">
                              <button onClick={closeModal} className="flex-1 px-4 py-2 text-sm font-medium text-center text-gray-700 transition-all bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-100 focus:ring focus:ring-gray-100 disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-400">Cancel</button>
                              <button className="flex-1 px-4 py-2 text-sm font-medium text-center text-white transition-all bg-red-500 border border-red-500 rounded-lg shadow-sm hover:border-red-700 hover:bg-red-700 focus:ring focus:ring-red-200 disabled:cursor-not-allowed disabled:border-red-300 disabled:bg-red-300"
                                onClick={() => deleteService(service)}
                              >Delete</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        ))}
      </table>


    </div>


  </>
}