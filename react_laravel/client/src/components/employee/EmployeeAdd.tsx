import toast from "react-hot-toast";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router";
import type { IEmployee } from "../../interface/employee.interface";
import apiClient, { initializeCsrfToken } from "../../utils/apiClient";
import axios from "axios";

type FormDataType = {
  multiple_image: File[];
};
const schema = yup.object().shape({
  first_name: yup.string().required("First name is required"),

  last_name: yup.string().nullable(),

  salary: yup
    .number()
    .typeError("Salary must be a number")
    .required("Salary is required"),

  age: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),

  dob: yup
    .date()
    .typeError("Please select valid DOB")
    .required("DOB is required"),

  DOJ: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),

  description: yup.string().required("Description is required"),

  hobbies: yup.string().required("Hobby is required"),

  status: yup.string().required("Status is required"),

  profile_image: yup.mixed().required("Profile image is required"),

  logo: yup.mixed().nullable(),
});

const editSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),

  last_name: yup.string().nullable(),

  salary: yup
    .number()
    .typeError("Salary must be a number")
    .required("Salary is required"),

  age: yup
    .number()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),

  dob: yup
    .date()
    .typeError("Please select valid DOB")
    .required("DOB is required"),

  DOJ: yup
    .date()
    .nullable()
    .transform((value, originalValue) => (originalValue === "" ? null : value)),

  description: yup.string().required("Description is required"),

  hobbies: yup.string().required("Hobby is required"),

  status: yup.string().required("Status is required"),

  profile_image: yup.mixed().nullable(),

  logo: yup.mixed().nullable(),
});
function EmployeeAdd() {
  const { id } = useParams();
  const topRef = useRef<HTMLHeadingElement>(null);
  const [mode, setMode] = useState("add");
  let navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImagesPreview, setNewImagesPreview] = useState<string[]>([]);
  useEffect(() => {
    if (id) setMode("edit");
  }, [id]);
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
      newImagesPreview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview, newImagesPreview]);

  useEffect(() => {
    if (!id) return;
    const fetchEmployee = async () => {
      setLoading(true);
      const stored = JSON.parse(localStorage.getItem("auth_data") || "{}");
      const accessToken = stored?.accessToken;
      try {
        const { data } = await apiClient.get(`api/employee/${id}`, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setValue("first_name", data.data.first_name);
        setValue("last_name", data.data.last_name);
        setValue("salary", data.data.salary);
        setValue("age", data.data.age);
        setValue("description", data.data.description);
        setValue("hobbies", data.data.hobbies);
        setValue("status", data.data.status);

        setExistingImage(data.data.profile_image);

        if (data.data.logo) {
          setPreview(`${BACKEND_URL}/storage/${data.data.logo}`);
        }

        if (data.data.dob) {
          setValue("dob", data.data.dob.split("T")[0]);
        }

        if (data.data.DOJ) {
          setValue("DOJ", data.data.DOJ.split("T")[0]);
        }
        setExistingImage(data.data.single_image);
        setExistingImages(data.data.multiple_image || []); // array of paths
        if (data?.data?.title) {
          const date = new Date(data.data.DOB);
          setValue("DOB", date.toISOString().split("T")[0]);
        }
      } catch (error: any) {
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Something went wrong",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IEmployee>({
    resolver: yupResolver(mode == "edit" ? editSchema : schema),
    defaultValues: {},
  });
  // const formValues = watch();
  // console.log(formValues);

  const onSubmit = async (data: IEmployee) => {
    setLoading(true);
    await initializeCsrfToken();

    try {
      const stored = JSON.parse(localStorage.getItem("auth_data") || "{}");
      const accessToken = stored?.accessToken;
      const header = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const formData = new FormData();

      formData.append("first_name", data.first_name);

      formData.append("last_name", data.last_name || "");

      formData.append("salary", String(data.salary));

      formData.append("age", data.age ? String(data.age) : "");

      formData.append(
        "dob",
        typeof data.dob === "string"
          ? data.dob
          : new Date(data.dob).toISOString().split("T")[0],
      );

      formData.append(
        "DOJ",
        data.DOJ
          ? typeof data.DOJ === "string"
            ? data.DOJ
            : new Date(data.DOJ).toISOString().split("T")[0]
          : "",
      );

      formData.append("description", data.description);

      formData.append("hobbies", data.hobbies);

      formData.append("status", data.status);

      if (data.profile_image instanceof File) {
        formData.append("profile_image", data.profile_image);
      }

      if (data.logo instanceof File) {
        formData.append("logo", data.logo);
      }
      // if (mode === "edit") {
      //   formData.append("existingImages", JSON.stringify(existingImages));
      // }

      let res: any;
      if (mode === "add") {
        res = await apiClient.post(`/api/employee`, formData, header);
      } else {
        //res = await apiClient.put(`/api/employee/${id}`, formData, header);
        formData.append("_method", "PUT");
        res = await apiClient.post(`/api/employee/${id}`, formData, header);
      }
      toast.success(res.data.message);
      navigate("/employee/list");
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

  return (
    <div className="min-h-screen px-4 py-10 bg-gray-100">
      <div className="max-w-2xl p-6 mx-auto bg-white shadow-md rounded-xl">
        <h2
          className="mb-6 text-2xl font-bold text-left text-gray-800"
          ref={topRef}
          tabIndex={-1}
        >
          Employee Add
        </h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-5 ${
            loading ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block mb-1 text-sm font-medium">
                First Name
              </label>

              <input
                type="text"
                {...register("first_name")}
                className="w-full px-4 py-2 border rounded-lg"
              />

              {errors.first_name && (
                <p className="text-sm text-red-500">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                Last Name
              </label>

              <input
                type="text"
                {...register("last_name")}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Salary</label>

            <input
              type="number"
              {...register("salary")}
              className="w-full px-4 py-2 border rounded-lg"
            />

            {errors.salary && (
              <p className="text-sm text-red-500">{errors.salary.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Age</label>

            <input
              type="number"
              {...register("age")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">DOB</label>

            <input
              type="date"
              {...register("dob")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">DOJ</label>

            <input
              type="date"
              {...register("DOJ")}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Description
            </label>

            <textarea
              rows={4}
              {...register("description")}
              className="w-full px-4 py-2 border rounded-lg"
            />

            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Hobbies</label>

            <select
              {...register("hobbies")}
              className="w-full px-4 py-2 border rounded-lg"
              defaultValue="Football"
            >
              <option value="Cricket">Cricket</option>
              <option value="Football">Football</option>
              <option value="Basket ball">Basket ball</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Status</label>

            <div className="flex items-center gap-6">
              {/* Active */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="active"
                  {...register("status")}
                  defaultChecked
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Active</span>
              </label>

              {/* Inactive */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="inactive"
                  {...register("status")}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Inactive</span>
              </label>
            </div>

            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">
              Profile Image
            </label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setValue("profile_image", file);
                  setPreview(URL.createObjectURL(file));
                }
              }}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Logo</label>

            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setValue("logo", file);
                }
              }}
              className="w-full p-2 border rounded-lg"
            />
          </div>
          {/* Buttons */}
          <div className="flex justify-center gap-3 pt-3">
            <button
              type="submit"
              // disabled={loading}
              className="px-5 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Save
              {/* {loading ? "Saving..." : "Save"} */}
            </button>

            <button
              type="button"
              onClick={() => navigate("/employee/list")}
              className="px-5 py-2 text-white bg-gray-600 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default EmployeeAdd;
