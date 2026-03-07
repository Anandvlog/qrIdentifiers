import React, { useState, type ChangeEvent, type FormEvent } from "react";

const ProfileCard = () => {
  const [image, setImage] = useState<string | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    console.log("Name:", formData.get("name"));
    console.log("Address:", formData.get("address"));
    console.log("Mobile:", formData.get("mobile"));
    console.log("Emergency:", formData.get("emergency"));
    console.log("Image:", formData.get("photo"));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* FORM START */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-28 h-28 rounded-full border-2 border-gray-300 overflow-hidden bg-gray-100 flex items-center justify-center">
              {image ? (
                <img
                  src={image}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-sm">Upload</span>
              )}
            </div>

            <label className="mt-3 cursor-pointer text-blue-500 text-sm">
              Upload Photo
              <input
                type="file"
                name="photo"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Form Fields */}
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <textarea
            name="address"
            placeholder="Enter Address"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="tel"
            name="emergency"
            placeholder="Emergency Contact"
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Save Details
          </button>
        </form>
        {/* FORM END */}

      </div>
    </div>
  );
};

export default ProfileCard;