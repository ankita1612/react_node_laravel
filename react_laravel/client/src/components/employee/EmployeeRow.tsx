import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IEmployee } from "../../interface/employee.interface";

interface EmployeeRowProps {
  employeeData: IEmployee;
  handleDelete: (id: number) => void;
}

function EmployeeRow({ employeeData, handleDelete }: EmployeeRowProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/employee/add/${employeeData.id}`);
  };

  const confirmDelete = () => {
    const confirmBox = window.confirm(
      "Are you sure you want to delete this employee?",
    );

    if (confirmBox) {
      handleDelete(employeeData.id!);
    }
  };

  return (
    <div className="grid items-center grid-cols-8 gap-4 px-6 py-4 text-sm text-gray-600 transition hover:bg-gray-50">
      {/* First Name */}
      <div className="font-semibold ">{employeeData.first_name}</div>

      {/* Last Name */}
      <div className="">{employeeData.last_name || "-"}</div>

      {/* Salary */}
      <div className="">₹ {employeeData.salary}</div>

      {/* DOB */}
      <div className="">
        {employeeData.dob
          ? new Date(employeeData.dob).toLocaleDateString()
          : "-"}
      </div>

      {/* DOJ */}
      <div className="">
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
          onClick={handleEdit}
          className="p-2 text-blue-600 transition rounded-lg hover:bg-blue-100"
        >
          <Pencil size={18} />
        </button>

        <button
          onClick={confirmDelete}
          className="p-2 text-red-600 transition rounded-lg hover:bg-red-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default EmployeeRow;
