const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
          <input type="email" id="email" className="w-full px-3 py-2 border rounded" placeholder="Masukkan email Anda" />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">Kata Sandi</label>
          <input type="password" id="password" className="w-full px-3 py-2 border rounded" placeholder="Masukkan kata sandi Anda" />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Login</button>
      </form>
    </div>
  );
};

export default Login;