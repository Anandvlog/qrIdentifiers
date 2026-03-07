import React, { useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import QRCode from "react-qr-code";

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

interface SubmittedData {
  name: string;
  address: string;
  mobile: string;
  emergency: string;
  photo?: string | null;
}

const ProfileCard = () => {
  const [image, setImage] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<SubmittedData | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Convert to base64 so it embeds directly into QR imageSettings
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormData) => {
    setSubmittedData({
      name: data.name,
      address: data.address,
      mobile: data.mobile,
      emergency: data.emergency,
      photo: image,
    });
    reset();
    setImage(null);
  };

  const handleBack = () => setSubmittedData(null);

  const qrValue = submittedData
    ? `Name: ${submittedData.name}\nAddress: ${submittedData.address}\nMobile: ${submittedData.mobile}\nEmergency Contact: ${submittedData.emergency}`
    : "";

  // ─── QR Result Screen ───────────────────────────────────────────────────────
  if (submittedData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 text-white text-center">
            <h1 className="text-2xl font-bold tracking-tight">Profile QR Code</h1>
            <p className="text-blue-100 text-sm mt-1">Scan to view contact details</p>
          </div>

          <div className="p-6 space-y-5">

            {/* Profile Photo + Name */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-24 h-24 rounded-full border-4 border-blue-100 overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">
                {submittedData.photo ? (
                  <img
                    src={submittedData.photo}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl text-gray-300">👤</span>
                )}
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-slate-800">{submittedData.name}</div>
                <div className="text-sm text-slate-400 mt-0.5">{submittedData.address}</div>
              </div>
            </div>

            {/* ── react-qr-code with embedded profile photo ── */}
            <div className="flex flex-col items-center bg-slate-50 rounded-xl p-5 border border-slate-100">
              <QRCode
                value={qrValue}
                size={220}
                bgColor="#ffffff"
                fgColor="#1e293b"
                level="H"
                style={{ height: "auto", maxWidth: "100%", width: "220px" }}
                // imageSettings embeds the profile photo in the center of the QR
                {...(submittedData.photo
                  ? {
                      imageSettings: {
                        src: submittedData.photo,
                        x: undefined,
                        y: undefined,
                        height: 48,
                        width: 48,
                        excavate: true, // clears QR modules behind image for clarity
                      },
                    }
                  : {})}
              />
              <p className="text-xs text-slate-400 mt-3 text-center">
                {submittedData.photo
                  ? "Profile photo is embedded in the center of the QR code"
                  : "Scan this QR code to get all profile details"}
              </p>
            </div>

            {/* Details Summary */}
            <div className="space-y-2 text-sm">
              {[
                { label: "📱 Mobile", value: submittedData.mobile },
                { label: "🚨 Emergency Contact", value: submittedData.emergency },
                { label: "🏠 Address", value: submittedData.address },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center bg-slate-50 rounded-lg px-4 py-2.5 border border-slate-100"
                >
                  <span className="text-slate-500 font-medium">{label}</span>
                  <span className="text-slate-700 font-semibold">{value}</span>
                </div>
              ))}
            </div>

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors text-white py-3 rounded-lg font-semibold"
            >
              ← Edit Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Form Screen ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 text-white text-center">
          <h1 className="text-2xl font-bold tracking-tight">Create Profile</h1>
          <p className="text-blue-100 text-sm mt-1">Fill in your details below</p>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* Image Upload */}
            <div className="flex flex-col items-center mb-2">
              <div className="w-28 h-28 rounded-full border-4 border-blue-100 overflow-hidden bg-gray-100 flex items-center justify-center shadow-md">
                {image ? (
                  <img src={image} alt="profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-300 text-5xl">👤</span>
                )}
              </div>
              <label className="mt-3 cursor-pointer text-blue-500 text-sm font-medium hover:text-blue-700 transition-colors">
                📷 Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  {...register("photo")}
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                {...register("name")}
                className="w-full border border-gray-200 rounded-lg p-3 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
              <textarea
                placeholder="Enter your address"
                rows={2}
                {...register("address")}
                className="w-full border border-gray-200 rounded-lg p-3 text-slate-700 placeholder-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Mobile Number</label>
              <input
                type="tel"
                placeholder="10-digit mobile number"
                {...register("mobile")}
                className="w-full border border-gray-200 rounded-lg p-3 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
              )}
            </div>

            {/* Emergency Contact */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Emergency Contact</label>
              <input
                type="tel"
                placeholder="10-digit emergency number"
                {...register("emergency")}
                className="w-full border border-gray-200 rounded-lg p-3 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-300 transition"
              />
              {errors.emergency && (
                <p className="text-red-500 text-xs mt-1">{errors.emergency.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 transition-colors text-white py-3 rounded-lg font-semibold mt-2"
            >
              Save & Generate QR Code →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;