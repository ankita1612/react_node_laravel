import toast from "react-hot-toast";
import React, { useRef, useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import type { IEmployee } from "../../interface/employee.interface";
import EmployeeRow from "./EmployeeRow";
import apiClient from "../../utils/apiClient";

import { FiSearch } from "react-icons/fi";
import { MdClose } from "react-icons/md";

function EmployeeList() {
  const [employeeData, setEmployeeData] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState("");

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
      const response = await apiClient.get("/api/employee", {
        params: {
          page: pagination.current_page,
          search: debouncedSearch,
          sort_by: sortField,
          sort_order: sortOrder,
          per_page: pagination.per_page,
        },
      });

      setEmployeeData(response.data.data.data);

      setPagination((prev) => ({
        ...prev,
        current_page: response.data.data.current_page,
        last_page: response.data.data.last_page,
        total: response.data.data.total,
      }));
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }, [
    pagination.current_page,
    pagination.per_page,
    debouncedSearch,
    sortField,
    sortOrder,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      // setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);
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

  //const handleDelete = (id: string) => {
  const handleDelete = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };
  // Delete employee
  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    const previousData = employeeData;
    setEmployeeData((prev) => prev.filter((p) => p.id !== deleteId));

    try {
      await apiClient.delete(`/api/employee/${deleteId}`);
      toast.success("Employee deleted successfully");
    } catch (error: any) {
      setEmployeeData(previousData);
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-md shadow-sm">
      <div className="flex items-center justify-between px-6 py-3 bg-blue-400">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* Accent line touching left border */}
          <div className="w-1 h-6 -ml-6 rounded-r-full bg-slate-900" />

          {/* Title */}

          <h2 className="text-xl font-semibold">Employee</h2>
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            ref={searchRef}
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

          <FiSearch className="absolute w-4 h-4 text-gray-400 -translate-y-1/2 left-3 top-1/2" />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                searchRef.current?.focus();
              }}
              className="absolute text-gray-400 -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
            >
              <MdClose size={18} />
            </button>
          )}
        </div>

        {/* Button */}
        <Link to="/employee/add">
          <button className="w-full px-5 py-2.5 text-sm font-medium  bg-blue-500 hover:bg-blue-600 rounded-xl  sm:w-auto">
            Create Employee
          </button>
        </Link>
      </div>

      {/* Grid */}
      {!loading && employeeData.length === 0 ? (
        <div className="py-5 text-center bg-white">
          <p className="text-gray-500">No employees found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[1000px] p-3 bg-white">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-4 px-6 py-4 text-base font-semibold tracking-wide text-gray-900 border-b border-gray-200 bg-gray-50">
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
              {employeeData.map((item) => (
                <EmployeeRow
                  key={item._id}
                  employeeData={item}
                  handleDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="flex flex-col gap-4 p-5 border-t border-gray-200 sm:flex-row sm:items-center sm:justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Rows per page</span>

          <select
            value={pagination.per_page}
            onChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                current_page: 1,
                per_page: Number(e.target.value),
              }))
            }
            className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>

          <div className="text-sm text-gray-500">
            {pagination.total === 0 ? (
              "Showing 0 entries"
            ) : (
              <>
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {(pagination.current_page - 1) * pagination.per_page + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold text-gray-700">
                  {Math.min(
                    pagination.current_page * pagination.per_page,
                    pagination.total,
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {pagination.total}
                </span>{" "}
                entries
              </>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* First */}
          <button
            disabled={pagination.current_page === 1}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                current_page: 1,
              }))
            }
            className="flex items-center justify-center w-10 h-10 text-sm transition bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {"<<"}
          </button>

          {/* Previous */}
          <button
            disabled={pagination.current_page === 1}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                current_page: prev.current_page - 1,
              }))
            }
            className="flex items-center justify-center w-10 h-10 text-sm transition bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {"<"}
          </button>

          {/* Current Page */}
          <div className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm">
            {pagination.current_page}
          </div>

          {/* Next */}
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                current_page: prev.current_page + 1,
              }))
            }
            className="flex items-center justify-center w-10 h-10 text-sm transition bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {">"}
          </button>

          {/* Last */}
          <button
            disabled={pagination.current_page === pagination.last_page}
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                current_page: pagination.last_page,
              }))
            }
            className="flex items-center justify-center w-10 h-10 text-sm transition bg-white border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {">>"}
          </button>
        </div>
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 bg-black/60 backdrop-blur-md">
          {/* Modal */}
          <div className="relative w-full max-w-lg overflow-hidden transition-all duration-300 transform bg-white shadow-2xl rounded-2xl animate-in fade-in zoom-in-95">
            {/* Close Icon */}
            <button
              onClick={() => setShowDeleteModal(false)}
              className="absolute z-10 flex items-center justify-center w-10 h-10 transition-all duration-200 bg-white top-4 right-4 hover:text-gray-600 group"
            >
              <MdClose className="w-5 h-5 transition-transform group-hover:scale-110" />
            </button>

            {/* Header - Kept as requested */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-800">
                Employee Delete
              </h2>
            </div>

            {/* Warning Content */}
            <div className="flex-1 px-6 py-4 overflow-y-auto">
              <p className="text-sm ">
                Are you sure you want to delete employee?
              </p>
            </div>

            {/* Divider */}
            <div className="px-6 py-2 border-t border-slate-200"></div>

            {/* Actions */}
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-white border border-gray-500 rounded-lg shadow-sm hover:bg-gray-100 over:border-gray-400 hover:shadow-md active:scale-95 active:translate-y-0 transition-all duration-200 ease-in-out"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white transition bg-red-500 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeList;
