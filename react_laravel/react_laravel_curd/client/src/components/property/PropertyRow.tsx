import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { IProperty } from "../../interface/Property.interface";
import React from "react";
interface PropertyRowProps {
  rowData: IProperty;
  handleDelete: (id: number) => void;
  srNo: number;
}

function PropertyRow({ rowData, handleDelete, srNo }: PropertyRowProps) {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/property/add/${rowData.id}`);
  };

  return (
    <div className="grid items-center grid-cols-7 gap-4 px-6 py-4 text-sm text-gray-600 transition-all duration-200 hover:bg-gray-50">
      <div>{srNo}</div>
      <div className="font-semibold">{rowData.property_name}</div>
      <div>{rowData.property_type}</div>
      <div>{rowData.property_size || "-"}</div>
      <div>{rowData.owner?.name || "-"}</div>
      <div className="flex flex-wrap gap-1">
        {rowData.amenities?.map((item) => (
          <span
            key={item.id}
            className="px-2 py-1 text-xs text-blue-700 bg-blue-100 rounded-full"
          >
            {item.name}
          </span>
        ))}
      </div>
      {/* Actions */}
      <div className="flex items-center justify-center gap-2">
        <button
          aria-label="Edit property"
          onClick={handleEdit}
          className="p-2 text-blue-600 transition rounded-lg hover:bg-blue-100"
        >
          <Pencil size={18} />
        </button>

        <button
          aria-label="Delete property"
          onClick={() => handleDelete(rowData.id!)}
          className="p-2 text-red-600 transition rounded-lg hover:bg-red-100"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}

export default React.memo(PropertyRow);
