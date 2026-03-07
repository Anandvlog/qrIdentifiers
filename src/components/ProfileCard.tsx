import React, { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  mobile: z
    .string()
    .min(10, "Mobile must be 10 digits")
    .max(10, "Mobile must be 10 digits"),
  emergency: z
    .string()
    .min(10, "Emergency contact must be 10 digits")
    .max(10, "Emergency contact must be 10 digits"),
  photo: z.any().optional(),
});

type FormData = z.infer<typeof schema>;

const ProfileCard = () => {
  const [image, setImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Image Upload */}
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
                {...register("photo")}
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Name */}
          <input
            type="text"
            placeholder="Enter Name"
            {...register("name")}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          {/* Address */}
          <textarea
            placeholder="Enter Address"
            {...register("address")}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}

          {/* Mobile */}
          <input
            type="tel"
            placeholder="Mobile Number"
            {...register("mobile")}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile.message}</p>
          )}

          {/* Emergency */}
          <input
            type="tel"
            placeholder="Emergency Contact"
            {...register("emergency")}
            className="w-full border border-gray-300 rounded-lg p-3"
          />
          {errors.emergency && (
            <p className="text-red-500 text-sm">{errors.emergency.message}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
          >
            Save Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileCard;