const WorkerCatalog: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Worker Catalog</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Example Worker Card */}
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-2">John Doe</h2>
                    <p className="text-gray-600 mb-4">Web Developer</p>
                    <p className="text-gray-800 mb-4">Experienced in React, Node.js, and MongoDB. Available for full-time and freelance projects.</p>
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">View Profile</button>
                </div>
                {/* Add more worker cards here */}
            </div>
        </div>
    );
};

export default WorkerCatalog;