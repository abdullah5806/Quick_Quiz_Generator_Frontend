import React from "react";

const CommonTable = ({
    columns = [],
    data = [],
    loading = false,
    emptyMessage = "No data found",
    tableClassName = "w-full",
    headerClassName = "bg-blue-600 text-white",
    rowClassName = "border-b hover:bg-gray-100",
}) => {
    if (loading) {
        return (
            <div className="w-full py-10 text-center">
                <p className="text-gray-500">Loading...</p>
            </div>
        );
    }
    
    return (
        <div className="w-full overflow-x-auto">
            <table className={`border-collapse ${tableClassName}`}>
                <thead className={headerClassName}>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                className={`p-4 ${column.align === "center" ? "text-center" : "text-left" }`}
                            >
                                {column.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length || 1}
                                className="p-6 text-center text-gray-500"
                            >
                                {emptyMessage}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={row.id || rowIndex}
                                className={rowClassName}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`p-3 ${
                                            column.align === "center"
                                                ? "text-center"
                                                : "text-left"
                                        }`}
                                    >
                                        {column.render
                                            ? column.render(row, rowIndex)
                                            : row[column.key]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default CommonTable;