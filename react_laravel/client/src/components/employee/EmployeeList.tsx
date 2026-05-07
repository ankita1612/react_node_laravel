import toast from "react-hot-toast";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import type { IEmployee } from "../../interface/employee.interface";
import EmployeeRow from "./EmployeeRow";
import apiClient from "../../utils/apiClient";
import { Search } from "lucide-react";

function EmployeeList() {
  const [employeeData, setEmployeeData] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });

  const [sortField, setSortField] = useState("id");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  // Fetch employees
  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await apiClient.get("/api/employee", {
        params: {
          page: pagination.current_page,
          search,
          sort_by: sortField,
          sort_order: sortOrder,
          per_page: pagination.per_page,
        },
      });

      setEmployeeData(data.data.data);

      setPagination((prev) => ({
        ...prev,
        current_page: data.data.current_page,
        last_page: data.data.last_page,
        total: data.data.total,
      }));
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current_page,
    pagination.per_page,
    search,
    sortField,
    sortOrder,
  ]);
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Delete employee
  const handleDelete = async (id: number) => {
    const previousData = employeeData;

    setEmployeeData((prev) => prev.filter((item) => item.id !== id));

    try {
      await apiClient.delete(`/api/employee/${id}`);
      toast.success("Employee deleted successfully");
    } catch (error: any) {
      setEmployeeData(previousData);
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employees</h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2"
            />

            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => {
                setPagination((prev) => ({
                  ...prev,
                  current_page: 1,
                }));

                setSearch(e.target.value);
              }}
              className="w-full py-2 pl-10 pr-4 bg-white border border-gray-300 outline-none rounded-xl sm:w-72 focus:ring-2 focus:ring-blue-300"
            />
          </div>

          <Link to="/employee/add">
            <button className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition">
              + Create Employee
            </button>
          </Link>
        </div>

        {/* Grid */}
        {employeeData.length === 0 ? (
          <div className="py-20 text-center bg-white shadow rounded-2xl">
            <p className="text-gray-500">No employees found</p>
          </div>
        ) : (
          <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-2xl">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-4 px-6 py-4 text-xs font-semibold tracking-wide text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
              <div
                onClick={() => handleSort("first_name")}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-800"
              >
                First Name
                {sortField === "first_name" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div
                onClick={() => handleSort("last_name")}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-800"
              >
                Last Name
                {sortField === "last_name" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div
                onClick={() => handleSort("salary")}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-800"
              >
                Salary
                {sortField === "salary" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div
                onClick={() => handleSort("DOB")}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-800"
              >
                DOB
                {sortField === "DOB" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div
                onClick={() => handleSort("DOJ")}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-800"
              >
                DOJ
                {sortField === "DOJ" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div
                onClick={() => handleSort("hobby")}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-800"
              >
                Hobby
                {sortField === "hobby" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div
                onClick={() => handleSort("status")}
                className="flex items-center gap-1 cursor-pointer select-none hover:text-gray-800"
              >
                Status
                {sortField === "status" && (
                  <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                )}
              </div>
              <div className="text-center">Actions</div>
            </div>

            {/* Rows */}
            <div className="divide-y divide-gray-100">
              {employeeData.length === 0 ? (
                <div className="py-16 text-center">
                  <p className="text-gray-500">No employees found</p>
                </div>
              ) : (
                employeeData.map((item) => (
                  <EmployeeRow
                    key={item.id}
                    employeeData={item}
                    handleDelete={handleDelete}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* Loader */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-white rounded-full border-t-transparent animate-spin"></div>

              <p className="text-sm text-white">Loading...</p>
            </div>
          </div>
        )}
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between mt-6">
        <button
          disabled={pagination.current_page === 1}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              current_page: prev.current_page - 1,
            }))
          }
          className="px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-50"
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Page {pagination.current_page} of {pagination.last_page}
        </div>

        <button
          disabled={pagination.current_page === pagination.last_page}
          onClick={() =>
            setPagination((prev) => ({
              ...prev,
              current_page: prev.current_page + 1,
            }))
          }
          className="px-4 py-2 text-sm bg-white border rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Loader */}
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

export default EmployeeList;
