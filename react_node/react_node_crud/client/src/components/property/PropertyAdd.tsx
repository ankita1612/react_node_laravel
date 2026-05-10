import toast from "react-hot-toast";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import type { IProperty } from "../../interface/Property.interface";
import apiClient from "../../utils/apiClient";
import Select from "react-select";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const schema = yup.object().shape({
  property_name: yup.string().required("Property name is required"),

  property_detail: yup.string().required("Property detail is required"),

  property_type: yup.string().required("Property type is required"),

  property_size: yup.string().when("property_type", {
    is: "Residential",
    then: (schema) => schema.required("Property size is required"),
    otherwise: (schema) => schema.nullable(),
  }),

  owner_id: yup.string().required("Owner is required"),

  amenities: yup.array().min(1, "Please select at least one amenity"),

  property_address: yup.string().required("Property address is required"),

  brochure: yup
    .mixed<File>()
    .nullable()
    .test("fileType", "Only PDF allowed", (value: any) => {
      if (!value) return true;

      return value.type === "application/pdf";
    }),

  photos: yup
    .mixed<FileList>()
    .required("Property photos are required")
    .test("fileType", "Only JPG/PNG allowed", (value) => {
      if (!value) return true;

      return Array.from(value).every((file) =>
        ["image/jpeg", "image/png"].includes(file.type),
      );
    }),
});

const editSchema = yup.object().shape({
  property_name: yup.string().required("Property name is required"),
  property_detail: yup.string().required("Property detail is required"),
  property_type: yup.string().required("Property type is required"),
  property_size: yup.string().when("property_type", {
    is: "Residential",
    then: (schema) => schema.required("Property size is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  owner_id: yup.string().required("Owner is required"),
  amenities: yup.array().min(1, "Please select at least one amenity"),
  property_address: yup.string().required("Property address is required"),
  brochure: yup
    .mixed<File>()
    .nullable()
    .test("fileType", "Only PDF allowed", (value: any) => {
      if (!value) return true;
      return value.type === "application/pdf";
    })
    .test("fileSize", "File size must be less than 2MB", (value: any) => {
      if (!value) return true;
      return value.size <= 2 * 1024 * 1024;
    }),
  photos: yup
    .mixed<FileList>()
    .nullable()
    .test("fileType", "Only JPG/PNG allowed", (value) => {
      if (!value || value.length === 0) return true;

      return Array.from(value).every((file) =>
        ["image/jpeg", "image/png"].includes(file.type),
      );
    }),
});

function PropertyAdd() {
  const { id } = useParams();
  const topRef = useRef<HTMLHeadingElement>(null);
  const [mode, setMode] = useState<"add" | "edit">("add");
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [newImagesPreview, setNewImagesPreview] = useState<string[]>([]);
  const [owners, setOwners] = useState<any[]>([]);
  const [amenitiesList, setAmenitiesList] = useState<any[]>([]);
  const [existingBrochure, setExistingBrochure] = useState<string | null>(null);

  const [existingImages, setExistingImages] = useState<string[]>([]);
  useEffect(() => {
    if (id) setMode("edit");
  }, [id]);

  useEffect(() => {
    // const fetchDropdowns = async () => {
    //   try {
    //     const [ownersRes, amenitiesRes] = await Promise.all([
    //       apiClient.get("/api/owners"),
    //       apiClient.get("/api/amenities"),
    //     ]);

    //     setOwners(ownersRes.data.data || ownersRes.data);

    //     setAmenitiesList(amenitiesRes.data.data || amenitiesRes.data);
    //   } catch (error) {
    //     toast.error("Failed to load dropdowns");
    //   }
    // };

    // fetchDropdowns();

    if (!id) return;

    // const fetchProperty = async () => {
    //   setLoading(true);
    //   try {
    //     const { data } = await apiClient.get(`/api/property/${id}`);
    //     const property = data.data || data;
    //     setExistingBrochure(property.brochure || null);
    //     setExistingImages(property.photos || []);
    //     setValue("property_name", property.property_name);
    //     setValue("property_detail", property.property_detail);
    //     setValue("property_type", property.property_type);
    //     setValue("property_size", property.property_size);
    //     setValue("owner_id", String(property.owner_id));
    //     setValue("property_address", property.property_address);
    //     setValue(
    //       "amenities",
    //       property.amenities.map((item: any) => String(item.id)),
    //     );
    //   } catch (error: any) {
    //     toast.error(
    //       error?.response?.data?.message ||
    //         error?.message ||
    //         "Something went wrong",
    //     );
    //   } finally {
    //     setLoading(false);
    //   }
    // };

    //fetchProperty();
  }, [id]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IProperty>({
    resolver: yupResolver(mode === "edit" ? editSchema : schema),
    defaultValues: {
      property_type: "Commercial",
      amenities: [],
    },
  });
  const propertyType = watch("property_type");
  // const formValues = watch();
  // console.log(formValues);

  const onSubmit = async (data: IProperty) => {
    setLoading(true);

    try {
      const header = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();

      formData.append("property_name", data.property_name);

      formData.append("property_detail", data.property_detail);

      formData.append("property_type", data.property_type);

      formData.append("property_size", data.property_size || "");

      formData.append("owner_id", data.owner_id);

      formData.append("property_address", data.property_address);

      data.amenities.forEach((item) => {
        formData.append("amenities[]", item);
      });

      if (data.brochure instanceof File) {
        formData.append("brochure", data.brochure);
      }

      if (data.photos) {
        Array.from(data.photos).forEach((photo) => {
          formData.append("photos[]", photo);
        });
      }

      let res: any;
      // if (mode === "add") {
      //   res = await apiClient.post(`/api/property`, formData, header);
      // } else {
      //   //res = await apiClient.put(`/api/property/${id}`, formData, header);
      //   formData.append("_method", "PUT");
      //   res = await apiClient.post(`/api/property/${id}`, formData, header);
      // }
      toast.success(res.data.message);
      navigate("/property/list");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Something went wrong",
      );

      window.scrollTo({ top: 0, behavior: "smooth" });

      requestAnimationFrame(() => {
        topRef.current?.focus();
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (propertyType !== "Residential") {
      setValue("property_size", "");
    }
  }, [propertyType, setValue]);
  useEffect(() => {
    return () => {
      newImagesPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagesPreview]);
  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-md shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-3 bg-blue-400">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Accent line touching left border */}
          <div className="w-1 h-6 -ml-6 rounded-r-full bg-slate-900" />

          {/* Title */}

          <h2 className="text-xl font-semibold">
            {mode === "edit" ? "Edit Property" : "Add Property"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:px-6 sm:py-8">
        <div className="space-y-5">
          {/* Property Name + Property Type */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Property Name */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Property Name <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                {...register("property_name")}
                className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
              />

              {errors.property_name && (
                <p className="text-sm text-red-500">
                  {errors.property_name.message}
                </p>
              )}
            </div>

            {/* Property Type */}
            <div>
              <label className="block mb-2 text-sm font-medium">
                Property Type <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-6 mt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Residential"
                    {...register("property_type")}
                    className="w-4 h-4 text-blue-600"
                  />

                  <span className="text-sm text-gray-700">Residential</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="Commercial"
                    {...register("property_type")}
                    className="w-4 h-4 text-blue-600"
                  />

                  <span className="text-sm text-gray-700">Commercial</span>
                </label>
              </div>

              {errors.property_type && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.property_type.message}
                </p>
              )}
            </div>
          </div>

          {/* Property Size + Owner */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Property Size */}
            {propertyType === "Residential" && (
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Property Size <span className="text-red-500">*</span>
                </label>

                <select
                  {...register("property_size")}
                  className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Select Size</option>

                  <option value="2 BHK">2 BHK</option>

                  <option value="3 BHK">3 BHK</option>
                </select>

                {errors.property_size && (
                  <p className="text-sm text-red-500">
                    {errors.property_size.message}
                  </p>
                )}
              </div>
            )}

            {/* Property Owner */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Property Owner <span className="text-red-500">*</span>
              </label>

              <select
                {...register("owner_id")}
                className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Select Owner</option>

                {owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name}
                  </option>
                ))}
              </select>

              {errors.owner_id && (
                <p className="text-sm text-red-500">
                  {errors.owner_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Property Detail */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Property Detail <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={4}
              {...register("property_detail")}
              className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
            />

            {errors.property_detail && (
              <p className="text-sm text-red-500">
                {errors.property_detail.message}
              </p>
            )}
          </div>

          {/* Amenities */}
          {/* Amenities */}
          <div>
            <label className="block mb-2 text-sm font-medium">
              Property Amenities <span className="text-red-500">*</span>
            </label>

            <Select
              isMulti
              options={amenitiesList.map((item) => ({
                value: String(item.id),
                label: item.name,
              }))}
              value={amenitiesList
                .filter((item) => watch("amenities")?.includes(String(item.id)))
                .map((item) => ({
                  value: String(item.id),
                  label: item.name,
                }))}
              onChange={(selectedOptions) => {
                setValue(
                  "amenities",
                  selectedOptions.map((item) => item.value),
                  { shouldValidate: true },
                );
              }}
              className="text-sm"
              classNamePrefix="react-select"
              placeholder="Select amenities"
            />

            {errors.amenities && (
              <p className="mt-1 text-sm text-red-500">
                {errors.amenities.message as string}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block mb-1 text-sm font-medium">
              Property Address <span className="text-red-500">*</span>
            </label>

            <textarea
              rows={3}
              {...register("property_address")}
              className="w-full py-2 pl-3 pr-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
            />

            {errors.property_address && (
              <p className="text-sm text-red-500">
                {errors.property_address.message}
              </p>
            )}
          </div>

          {/* Brochure + Photos */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* Brochure */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Property Brochure (PDF)
              </label>

              <input
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];

                  if (file) {
                    setValue("brochure", file);
                  }
                }}
                className="w-full py-2 pl-2 pr-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
              />

              {errors.brochure && (
                <p className="text-sm text-red-500">
                  {errors.brochure.message as string}
                </p>
              )}
              {mode === "edit" && existingBrochure && (
                <div className="mt-3">
                  <a
                    href={`${BACKEND_URL}/storage/${existingBrochure}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-blue-600 underline hover:text-blue-800"
                  >
                    View Existing Brochure
                  </a>
                </div>
              )}
            </div>

            {/* Property Photos */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                Property Photos <span className="text-red-500">*</span>
              </label>

              <input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png"
                onChange={(e) => {
                  const files = e.target.files;

                  if (files) {
                    setValue("photos", files);

                    const previewUrls = Array.from(files).map((file) =>
                      URL.createObjectURL(file),
                    );

                    setNewImagesPreview(previewUrls);
                  }
                }}
                className="w-full py-2 pl-2 pr-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
              />

              {errors.photos && (
                <p className="text-sm text-red-500">
                  {errors.photos.message as string}
                </p>
              )}
            </div>
          </div>

          {/* Photo Preview */}
          {newImagesPreview.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {newImagesPreview.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="preview"
                  className="object-cover w-24 h-24 border rounded-lg"
                />
              ))}
            </div>
          )}
          {/* Existing Images */}
          {mode === "edit" && existingImages.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-medium">Existing Images</p>

              <div className="flex flex-wrap gap-3">
                {existingImages.map((img, index) => (
                  <>
                    <img
                      key={index}
                      src={`${BACKEND_URL}/storage/${img.photo}`}
                      alt="property"
                      className="object-cover w-24 h-24 border rounded-lg"
                    />
                  </>
                ))}
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/property/list")}
              className="px-5 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white rounded-full border-t-transparent animate-spin"></div>

            <p className="text-sm text-white">Loading...</p>
          </div>
        </div>
      )}
    </div>
  );
}
export default PropertyAdd;
