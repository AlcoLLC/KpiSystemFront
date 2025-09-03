import { useState } from "react";
import useAuth from "../hooks/useAuth"; // -> Funksionallıq üçün hook import edilir
import "../assets/css/login.css";

const Login = () => {
  // -> 1. AuthContext-dən lazımi funksiya və state-lər alınır
  const { login, isLoading, error } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -> 2. Form submit edildikdə context-dəki login funksiyası çağırılır
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form.email, form.password);
  };

  return (
    // -> Orijinal class-lar və struktur qorunur
    <div className="flex items-center justify-center min-h-screen login-background">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-12">
        <h1 className="text-4xl font-bold text-center mb-8">Giriş</h1>

        {/* -> 3. Xəta mesajı bloku bura əlavə edilir */}
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-md font-medium mb-5">E-poçt</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-md font-medium mb-5">Şifrə</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Remember Me (Orijinal strukturdan qaldı) */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="remember"
              name="remember"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember"
              className="ml-2 block text-md text-gray-900"
            >
              Xatırla məni
            </label>
          </div>

          {/* Button */}
          {/* -> 4. Düyməyə yüklənmə məntiqi (disabled və mətn) əlavə edilir */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl text-lg hover:bg-blue-700 transition mb-5 disabled:bg-blue-300"
          >
            {isLoading ? "Gözləyin..." : "Giriş"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
