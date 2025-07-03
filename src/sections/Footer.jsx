import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import logo from "../assets/Internsavvy.png";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      toast.error("Subscription failed. You may already be subscribed.");
    } else {
      toast.success("Subscribed successfully!");
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <footer className="bg-gray-400 dark:bg-gray-900 text-gray-700 dark:text-gray-300 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Logo & About */}
        <div>
          <img src={logo} alt="Logo" className="bg-white rounded-full h-12 w-12 mb-4" />
          <p className="text-sm">
            YEE Africa empowers youth with internships, jobs, entrepreneurship,
            and digital skills across the continent.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/internships" className="hover:text-blue-500">Internships</Link></li>
            <li><Link to="/jobs" className="hover:text-blue-500">Jobs</Link></li> 
             <li><Link to="/faq" className="hover:text-blue-500">FAQ</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-blue-500">About</Link></li>
            <li><Link to="/contact" className="hover:text-blue-500">Contact</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-blue-500">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-500">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="text-lg font-semibold mb-3">Join our newsletter</h4>
          <p className="text-sm mb-3">Stay updated on internships, jobs, and more.</p>
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm disabled:opacity-60"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 dark:border-gray-700 my-6" />

      {/* Bottom */}
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <p>&copy; {new Date().getFullYear()} YEE Africa. All rights reserved.</p>
        <div className="flex space-x-4 text-lg">
          <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
          <a href="#" className="hover:text-blue-500"><FaTwitter /></a>
          <a href="#" className="hover:text-blue-500"><FaLinkedinIn /></a>
          <a href="#" className="hover:text-blue-500"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
