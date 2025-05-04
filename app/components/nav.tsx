import Link from "next/link";

const Nav = () => {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="flex justify-between">
        <div>
            logo
        </div>
        <div>
      <ul className="flex space-x-4">
        <li>
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link href="/login" className="hover:text-gray-300">
            login
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-gray-300">
            Contact
          </Link>
        </li>
      </ul></div>
      </div>
    </nav>
  );
};

export default Nav;
