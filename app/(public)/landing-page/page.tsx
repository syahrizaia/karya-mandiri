import Link from "next/link";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-indigo-900 font-sans">
      <main className="flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white rounded-xl sm:items-start">
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-6xl font-bold text-center text-gray-900">
            Welcome to KaryaMandiri!
            </h1>
            <Link href="/employer" className="mt-8 px-4 py-2 rounded-xl text-lg font-medium bg-indigo-500 text-white transition delay-150 hover:bg-white hover:text-indigo-500 hover:border">
            Pemberi Kerja
            </Link>
            <Link href="/worker" className="mt-8 px-4 py-2 rounded-xl text-lg font-medium bg-indigo-500 text-white transition delay-150 hover:bg-white hover:text-indigo-500 hover:border">
            Pekerja
            </Link>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;