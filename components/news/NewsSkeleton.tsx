import React from "react";

const NewsSkeleton = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse transition-colors">
      <div className="w-full h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
      <div className="h-4 w-1/3 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="space-y-2">
        <div className="h-5 w-full bg-slate-300 dark:bg-slate-700 rounded" />
        <div className="h-5 w-5/6 bg-slate-300 dark:bg-slate-700 rounded" />
      </div>
      <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
  );
};

export default NewsSkeleton;