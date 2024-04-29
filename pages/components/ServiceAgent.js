import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";
import toast from "react-hot-toast";

export default function Product({
  _id,
  name: existingName,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  services: selectedService,
  details: existingDetails, // Added details
  experience: existingExperience,
  gender: existingGender,
  work: existingWork

}) {
  const [name, setName] = useState(existingName || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);
  const [details, setDetails] = useState(existingDetails || ''); // Added details
  const [experience, setExperience] = useState(existingExperience || '');
  const [gender, setGender] = useState(existingGender || '');
  const [work, setWork] = useState(existingWork|| '');
  const router = useRouter();
  const [redirect, setRedirect] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const uploadImagesQueue = [];
  const [services, setServices] = useState([]);
  const [service, setService] = useState(selectedService || '');

  useEffect(() => {
    axios.get('/api/services').then(result => {
      setServices(result.data)
    })
  }, [])

  async function createService(ev) {
    ev.preventDefault();


    // Check if there are new images to upload
    if (isUploading) {
      // Wait for the images to finish uploading
      await Promise.all(uploadImagesQueue);
    }

    // Now you can make the API request to save the product
    const data = { name, description, price, details, images, service, experience, gender, work};
    if (_id) {
      await axios.put('/api/serviceAgents', { ...data, _id });
      toast.success('Service Agent updated!!')
    } else {
      await axios.post('/api/serviceAgents', data);
      toast.success('Service Agent created!!')
    }
    setRedirect(true);
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);

      for (const file of files) {
        const data = new FormData();
        data.append('file', file);

        // Use the axios.post method and push the promise to the queue
        uploadImagesQueue.push(
          axios.post('/api/upload', data)
            .then(res => {
              setImages(oldImages => [...oldImages, ...res.data.links]);
            })
        );
      }

      // Wait for all images to finish uploading
      await Promise.all(uploadImagesQueue);

      setIsUploading(false);
      toast.success('Image uploaded')
    } else {
      toast.error('An error occurred!')
    }
  }

  if (redirect) {
    router.push('/');
    return null;
  }

  function updateImagesOrder(images) {
    setImages(images)
  }

  function handleDeleteImage(index) {
    const updatedImages = [...images];
    updatedImages.splice(index, 1);
    setImages(updatedImages);
    toast.success('image deleted successfully!!')
  }



  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={createService} className="space-y-5">
        {/* Title input */}
        <div className="grid items-center grid-cols-2 my-4">
          <label className="block col-span-1 mb-3 text-lg font-medium text-gray-700">Name</label>
          <div className="col-span-2">
            <input
              type="text"
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Name Of Agent"
              required
              value={name}
              onChange={ev => setName(ev.target.value)}
            />
          </div>
        </div>

        {/* Category select */}
        <div>
          <label htmlFor="category" className="block text-lg font-medium text-gray-900">
            Select Service
          </label>
          <select
            id="category"
            className="mt-1.5 p-3 w-full rounded-md border border-gray-300 text-gray-700"
            value={service}
            onChange={(ev) => setService(ev.target.value)}
          >
            <option value="0">No service selected</option>
            {services.length > 0 &&
              services.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
          </select>
        </div>

        {/* Images upload */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <label className="mr-2 text-lg font-medium text-gray-700">Images</label>
            <div className="flex items-center justify-center rounded-lg">
              <label htmlFor="fileInput" className="flex items-center gap-1.5 px-3 py-2 text-center text-sm font-medium text-gray-500 border cursor-pointer hover:border-primary-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                  <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                  <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                </svg>
                Upload
              </label>
              <input id="fileInput" type="file" className="hidden" accept="image/*" multiple onChange={uploadImages} />
            </div>
          </div>

          {/* Spinner during upload */}
          <div className="grid items-center grid-cols-2 rounded">
            {isUploading && (
              <Spinner className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" />
            )}
          </div>

          {/* Display uploaded images */}
          {!isUploading && (
            <div className="grid grid-cols-3 gap-4 mb-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              <ReactSortable list={images} setList={updateImagesOrder} className="w-[350px] h-auto  gap-2 flex  justify-between align-items-center">
                {images?.map((link, index) => (
                  <div key={link} className="relative group">
                    <img src={link} alt="image" className="object-cover h-32 p-2 transition-transform border rounded-md cursor-pointer w-44 transform-gpu group-hover:scale-105" />
                    <div className="absolute opacity-0 cursor-pointer top-2 right-2 group-hover:opacity-100">
                      <button onClick={() => handleDeleteImage(index)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 text-orange-600 bg-white rounded-full">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

              </ReactSortable>
            </div>
          )}

        </div>

        {/* Description input */}
        <div className="grid items-center grid-cols-2 my-4">
          <label className="block col-span-1 mb-3 text-lg font-medium text-gray-700">Description</label>
          <div className="col-span-2">
            <textarea
              type="text"
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Description about the Agent"
              rows={6}
              required
              value={description}
              onChange={ev => setDescription(ev.target.value)}
            />
          </div>
        </div>

        {/* Product Details input */}
        <div className="grid items-center grid-cols-2 my-4">
          <label className="block col-span-1 mb-3 text-lg font-medium text-gray-700">
            Service Agents Details
          </label>
          <div className="col-span-2">
            <textarea
              type="text"
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Product details"
              rows={6}
              required
              value={details}
              onChange={(ev) => setDetails(ev.target.value)}
            />
          </div>
        </div>

        {/* more details */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label>Experience</label>
            <input
              className="w-full p-3 text-sm border border-gray-200 rounded-lg"
              placeholder="1⭐ -to- 5⭐"
              type="text"
              value={experience}
              onChange={ev => setExperience(ev.target.value)}
            />
          </div>

          <div>
            <label>Gender</label>
            <input
              className="w-full p-3 text-sm border border-gray-200 rounded-lg"
              placeholder="Gender"
              type="text"
              value={gender}
              onChange={ev => setGender(ev.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label>Work</label>
            <input
              className="w-full p-3 text-sm border border-gray-200 rounded-lg"
              placeholder="Sizes, small, large"
              type="text"
              value={work}
              onChange={ev => setWork(ev.target.value)}
            />
          </div>

        </div>

        {/* Price input */}
        <div className="grid items-center grid-cols-2 my-4">
          <label className="block col-span-1 mb-3 text-lg font-medium text-gray-700">Price</label>
          <div className="col-span-2">
            <input
              type="number"
              className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:border-primary-400 focus:ring focus:ring-primary-200 focus:ring-opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500"
              placeholder="Price"
              required
              value={price}
              onChange={ev => setPrice(ev.target.value)}
            />
          </div>
        </div>

        {/* Save button */}
        <div className="items-center my-4">
          <div className="col-span-2 col-start-2">
            <button
              type="submit"
              className="rounded-lg border border-slate-500 bg-primary-500 px-5 py-2.5 text-center text-sm font-medium text-black shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
            >
              Save Product
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
