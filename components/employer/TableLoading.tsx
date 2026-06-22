import React from 'react';

const TableLoading: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden animate-pulse">
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
        <div className="h-5 w-48 bg-gray-200 dark:bg-slate-700 rounded-md"></div>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50 dark:bg-slate-800/50 uppercase text-xs text-gray-400">
          <tr>
            <th className="px-6 py-4"><div className="h-3 w-20 bg-gray-200 dark:bg-slate-700 rounded"></div></th>
            <th className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div></th>
            <th className="px-6 py-4"><div className="h-3 w-24 bg-gray-200 dark:bg-slate-700 rounded"></div></th>
            <th className="px-6 py-4"><div className="h-3 w-16 bg-gray-200 dark:bg-slate-700 rounded"></div></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i}>
              <td className="px-6 py-4">
                <div className="h-4 w-40 bg-gray-100 dark:bg-slate-800 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-6 w-20 bg-gray-100 dark:bg-slate-800 rounded-full"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-28 bg-gray-100 dark:bg-slate-800 rounded"></div>
              </td>
              <td className="px-6 py-4">
                <div className="h-4 w-24 bg-gray-100 dark:bg-slate-800 rounded"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoading;