/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FiUsers, FiBriefcase, FiTrendingUp, FiPlus } from 'react-icons/fi';
import { EmployerData, ProjectStats } from '../types';

const EmployerDashboard: React.FC = () => {
  // Mock Data (Integrasikan dengan API backend nantinya)
  const stats: EmployerData = {
    name: "Syahriza",
    company: "KaryaMandiri Corp",
    totalProjects: 120,
    activeWorkers: 450,
    totalInvestment: 25000000, // Rp 25.000.000
  };

  const projects: ProjectStats[] = [
    { id: '1', title: 'Produksi Tas Daur Ulang', status: 'active', contributors: 15, budget: 5000000 },
    { id: '2', title: 'Kurir Logistik Crowd', status: 'pending', contributors: 0, budget: 3000000 },
    { id: '3', title: 'Pengolahan Bahan Baku Serat', status: 'completed', contributors: 30, budget: 12000000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Employer</h1>
          <p className="text-gray-600">Selamat datang kembali, {stats.name}</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md">
          <FiPlus /> Buat Proyek Baru
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard icon={<FiBriefcase />} title="Total Proyek" value={stats.totalProjects} color="bg-blue-500" />
        <StatCard icon={<FiUsers />} title="Tenaga Kerja Aktif" value={stats.activeWorkers} color="bg-green-500" />
        <StatCard icon={<FiTrendingUp />} title="Investasi Sosial" value={`Rp${(stats.totalInvestment / 1000000).toFixed(1)}M`} color="bg-purple-500" />
      </div>

      {/* Project Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Status Proyek Crowdsourcing</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-medium">Judul Proyek</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Kontributor</th>
              <th className="px-6 py-4 font-medium">Anggaran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-800">{project.title}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(project.status)}`}>
                    {project.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{project.contributors} Orang</td>
                <td className="px-6 py-4 font-semibold text-gray-700">Rp{project.budget.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Sub-komponen StatCard
const StatCard = ({ icon, title, value, color }: { icon: any, title: string, value: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`${color} p-4 rounded-lg text-white text-2xl`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

// Helper function untuk style status
const getStatusStyle = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-700';
    case 'pending': return 'bg-yellow-100 text-yellow-700';
    case 'completed': return 'bg-gray-100 text-gray-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

export default EmployerDashboard;