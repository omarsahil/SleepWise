import Link from "next/link";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md border border-gray-200">
        <nav className="mb-4">
          <Link className="text-blue-600 hover:underline" href="/">
            Home
          </Link>
        </nav>
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Privacy Statement
        </h2>
        <p className="text-gray-700 text-center">
          Your sleep data is private and only accessible to you. Data is stored
          securely in Supabase and protected by your Clerk account. We do not
          share your data with third parties.
        </p>
      </div>
    </div>
  );
}
