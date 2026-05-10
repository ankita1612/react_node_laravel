import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IEmployee } from "../../interface/employee.interface";
import React from "react";
interface EmployeeRowProps {
  employeeData: IEmployee;
  handleDelete: (id: string) => void;
  srNo: number;
}

function EmployeeRow({ employeeData, handleDelete, srNo }: EmployeeRowProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/employee/add/${employeeData._id}`);
  };

  return (
    <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_120px] items-center  gap-4 px-6 py-4 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50">
      {/* First Name */}
      <div>{srNo}</div>
      <div className="font-semibold truncate">{employeeData.first_name}</div>

      {/* Last Name */}
      <div className="truncate">{employeeData.last_name || "-"}</div>

      {/* Salary */}
      <div>₹ {employeeData.salary}</div>

      {/* DOB */}
      <div>
        {employeeData.dob
          ? new Date(employeeData.dob).toLocaleDateString()
          : "-"}
      </div>

      {/* DOJ */}
      <div>
        {employeeData.DOJ
          ? new Date(employeeData.DOJ).toLocaleDateString()
          : "-"}
      </div>

      {/* Hobby */}
      <div className="text-sm text-gray-700">{employeeData.hobbies}</div>

      {/* Status */}
      <div>
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            employeeData.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {employeeData.status}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-2">
        <button
          aria-label="Edit employee"
          onClick={handleEdit}
          className="p-2 text-blue-600 transition rounded-lg hover:bg-blue-100"
        >
          <Pencil size={18} />
        </button>

        <button
          aria-label="Delete employee"
          onClick={() => handleDelete(employeeData._id!)}
          className="p-2 text-red-600 transition rounded-lg hover:bg-red-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(EmployeeRow);
