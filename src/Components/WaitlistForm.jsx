import { useState } from "react";
import "../Css/WaitlistForm.css";
import { registerWaitlist } from "../service/service.js";

const WaitlistForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    amountRange: "5000-100000-annually",
  });

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errorMessage) {
      setErrorMessage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.firstName.trim()) {
      setErrorMessage("First name is required.");
      return;
    }
    if (!formData.lastName.trim()) {
      setErrorMessage("Last name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage("Email address is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await registerWaitlist(formData);

      if (res?.success) {
        setResponseData(res.data);
        setShowModal(true);
      } else {
        setErrorMessage(res?.message || "Failed to join waitlist. Please try again.");
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred. Please try again.";
      setErrorMessage(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = async () => {
    const link =
      responseData?.referralLink ||
      (responseData?.referralCode
        ? `https://hedge-nest.vercel.app/waitlist?ref=${responseData.referralCode}`
        : "");

    if (!link) return;

    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const referralLinkDisplay =
    responseData?.referralLink ||
    (responseData?.referralCode
      ? `https://hedge-nest.vercel.app/waitlist?ref=${responseData.referralCode}`
      : "Link will be generated upon confirmation");

  return (
    <section className="waitlist-form">
      <h1>Join the waitlist</h1>
      <p className="form-description">
        Takes 20 seconds. We'll send your invite and referral reward link by
        email.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First name</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Adaeze"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last name</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Agnes"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="amountRange">
            What amount range do you want to save, invest or hold in stablecoin?
          </label>
          <select
            id="amountRange"
            name="amountRange"
            value={formData.amountRange}
            onChange={handleChange}
          >
            <option value="5000-100000-annually">₦5,000 - ₦100,000 annually</option>
            <option value="100000-500000-annually">₦100,000 - ₦500,000 annually</option>
            <option value="500000-1000000-annually">₦500,000 - ₦1,000,000 annually</option>
            <option value="1000000-5000000-annually">₦1,000,000 - ₦5,000,000 annually</option>
            <option value="5000000-above">₦5,000,000 and above annually</option>
          </select>
        </div>

        {errorMessage && <div className="form-error">{errorMessage}</div>}

        <button
          type="submit"
          className="reserve-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Reserving spot..." : "Reserve my spot →"}
        </button>
      </form>

      <p className="terms-text">
        By joining, you agree to our <a href="#terms">Terms</a> and <a href="#privacy">Privacy Policy</a>.
      </p>

      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="success-modal">
            <button
              className="close-button"
              onClick={() => setShowModal(false)}
              aria-label="Close modal"
              type="button"
            >
              x
            </button>

            <div className="success-icon" aria-hidden="true">
              ✓
            </div>
            <h2>You're on the list, {responseData?.firstName || formData.firstName}!</h2>

            <p className="success-message">
              We've reserved your spot. Your referral link and{" "}
              {responseData?.signupBonus
                ? `₦${responseData.signupBonus.toLocaleString()}`
                : "₦5,000"}{" "}
              bonus details are on their way to{" "}
              <strong>{responseData?.email || formData.email}.</strong>
            </p>

            <button
              type="button"
              className="whatsapp-button"
              onClick={() => window.open("https://chat.whatsapp.com/", "_blank")}
            >
              <span className="whatsapp-icon">◉</span>
              Join our WhatsApp Community
            </button>

            <div className="referral-card">
              <h3>
                Your referral link —{" "}
                {responseData?.referralReward
                  ? `₦${responseData.referralReward.toLocaleString()}`
                  : "₦2,000"}{" "}
                per friend
              </h3>
              <div className="referral-link-container">
                <p className="referral-link" title={referralLinkDisplay}>
                  {referralLinkDisplay}
                </p>

                <button
                  type="button"
                  className="copy-button"
                  onClick={handleCopy}
                >
                  {copied ? "✓ Copied" : "📋 Copy"}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="homepage-button"
              onClick={() => setShowModal(false)}
            >
              Back to Homepage
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default WaitlistForm;
