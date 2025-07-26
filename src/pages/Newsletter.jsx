import { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "react-toastify";

const FooterNewsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter an email");

    setLoading(true);

    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert([{ email }]);

    if (error) {
      toast.error("You may already be subscribed or something went wrong.");
    } else {
      toast.success("Subscribed successfully!");
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <div  className="mt-12 mb-12  bg-white dark:bg-gray-950 text-black dark:text-white">
      <h4 className="text-lg font-semibold mb-3">Join our newsletter</h4>
      <p className="text-sm mb-3">Stay updated on internships, jobs, and more.</p>
      <form
        onSubmit={handleSubscribe}
        className="flex flex-col sm:flex-row items-center gap-2"
      >
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-sm"
          required
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
  );
};

export default FooterNewsletter;
