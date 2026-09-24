import { useState } from "react";
import "../Css/SuccessModal.css";
import WhiteLogo from "../assets/whitelogo.png"; // Update path if needed
import { FaCheck, FaCopy, FaWhatsapp, FaTelegram, FaTimes } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const SuccessModal = ({
  isOpen,
  onClose,
  userName = "Tijani",
  position = 1,
  totalPeople = 9,
  referralLink = "https://hedge-nest.vercel.app/waitlist?r=123",
  referralReward = "1 USDT",
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Top Header Row */}
        <div className="modal-header">
          <div className="modal-brand">
            <img src={WhiteLogo} alt="HedgeNest Logo" className="modal-logo-img" />
            <span className="modal-brand-name">HedgeNest</span>
          </div>
          <div className="modal-header-right">
            <div className="verified-badge">
              <FaCheck className="check-icon" /> EMAIL VERIFIED
            </div>
            <button className="close-x-btn" onClick={onClose} type="button" aria-label="Close">
              <FaTimes />
            </button>
          </div>
        </div>

        {/* Hero Title Area */}
        <div className="modal-title-area">
          <span className="party-emoji">🎉</span>
          <h2 className="congrats-text">CONGRATULATIONS!</h2>
          <h1 className="secured-text">You’re in. Spot secured! 🎉</h1>
          <p className="welcome-text">
            Hi {userName}, your email has been verified. You're officially on the HedgeNest waitlist!
          </p>
        </div>

        {/* Waitlist Position Box */}
        <div className="position-box">
          <p className="position-label">YOUR WAITLIST POSITION</p>
          <h2 className="position-number">#{position}</h2>
          <p className="total-people">Out of <strong>{totalPeople}</strong> people on the waitlist.</p>
          <div className="position-divider" />
          <p className="position-subtext">We’ll reach out when HedgeNest is ready for you.</p>
        </div>

        {/* Single Referral Reward Box */}
        <div className="reward-container">
          <div className="reward-card">
            <p className="reward-label">🤝 REFERRAL REWARD</p>
            <h3 className="reward-amount">{referralReward}</h3>
            <p className="reward-subtext">Stand a chance to earn {referralReward} at launch</p>
          </div>
        </div>

        {/* Share & Link Section */}
        <div className="share-box">
          <h4 className="share-title">🚀 Want to move up the waitlist?</h4>
          <p className="share-description">
            Share your referral link with friends. For every friend who signs up, you will climb higher on the list!
          </p>

          <div className="copy-link-group">
            <input type="text" readOnly value={referralLink} className="link-input" />
            <button onClick={handleCopy} className="copy-btn" type="button">
              <FaCopy /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="social-share-buttons">
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noreferrer"
              className="social-btn whatsapp"
            >
              <FaWhatsapp /> WhatsApp
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noreferrer"
              className="social-btn twitter"
            >
              <FaXTwitter /> Share on X
            </a>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(referralLink)}`}
              target="_blank"
              rel="noreferrer"
              className="social-btn telegram"
            >
              <FaTelegram /> Telegram
            </a>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <p className="email-notice">
          We've also emailed you a confirmation of your spot and referral link.
        </p>
      </div>
    </div>
  );
};

export default SuccessModal;