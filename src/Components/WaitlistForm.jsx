import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../Css/WaitlistForm.css";
import { registerWaitlist, resendWaitlistVerification } from "../service/service.js";
import { FaEnvelope, FaTimes } from "react-icons/fa";

const WaitlistForm = () => {
  const [searchParams] = useSearchParams();
  const referralCodeFromUrl = searchParams.get("ref"); // Capture ?ref= from URL

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    amountRange: "5000-100000-annually",
  });

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submittedEmail, setSubmittedEmail] = useState("");

  // State for resending verification link
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState({ text: "", isError: false });

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

  const handleCloseModal = () => {
    setShowModal(false);
    setResendMessage({ text: "", isError: false });
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

      // Pass referralCode along with form data
      const res = await registerWaitlist({
        ...formData,
        referralCode: referralCodeFromUrl || null,
      });

      if (res?.success) {
        setSubmittedEmail(formData.email);
        setShowModal(true);
        setResendMessage({ text: "", isError: false });
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          amountRange: "5000-100000-annually",
        });
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

  const handleResend = async () => {
    if (!submittedEmail) return;

    setIsResending(true);
    setResendMessage({ text: "", isError: false });

    try {
      const res = await resendWaitlistVerification(submittedEmail);
      setResendMessage({
        text: res?.message || "Verification email resent successfully!",
        isError: false,
      });
    } catch (err) {
      const serverMsg =
        err.response?.status === 404
          ? "Email not found on waitlist."
          : err.response?.data?.message || "Failed to resend email. Please try again.";

      setResendMessage({
        text: serverMsg,
        isError: true,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <section className="waitlist-form">
      <h1>Join the waitlist</h1>
      <p className="form-description">
        Earn an entry into our 1 USDT raffle draw for every friend who joins using your link. The more friends you refer, the higher your chances of winning!
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

      {/* VERIFY EMAIL MODAL */}
      {showModal && (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={handleCloseModal}>
          <div className="verify-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="close-button"
              onClick={handleCloseModal}
              aria-label="Close modal"
              type="button"
            >
              <FaTimes />
            </button>

            <div className="verify-icon" aria-hidden="true">
              <FaEnvelope />
            </div>

            <h2>Check Your Email</h2>

            <p className="verify-message">
              We've sent a verification link to <strong>{submittedEmail}</strong>. 
              Please click the link in your email to confirm your spot on the waitlist!
            </p>

            {/* RESEND VERIFICATION SECTION */}
            <div style={{ margin: "16px 0", textAlign: "center" }}>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "6px" }}>
                Didn't receive the email? Check your spam folder or
              </p>
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                style={{
                  background: "none",
                  border: "none",
                  color: "#2563eb",
                  fontWeight: "600",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.875rem",
                }}
              >
                {isResending ? "Resending..." : "Click here to resend"}
              </button>

              {resendMessage.text && (
                <p
                  style={{
                    fontSize: "0.8rem",
                    marginTop: "8px",
                    color: resendMessage.isError ? "#ef4444" : "#10b981",
                    fontWeight: "500",
                  }}
                >
                  {resendMessage.text}
                </p>
              )}
            </div>

            <button
              type="button"
              className="got-it-button"
              onClick={handleCloseModal}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default WaitlistForm;