import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import WaitlistInfo from "./Components/WaitlistInfo.jsx";
import WaitlistForm from "./Components/WaitlistForm";
import SuccessModal from "./Components/SuccessModal";
import { verifyWaitlist } from "./service/service.js";

function App() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDismissed, setIsDismissed] = useState(false);
  const [verifiedUserData, setVerifiedUserData] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email || verifiedUserData) return;

    let isMounted = true;

    const runVerification = async () => {
      try {
        setIsVerifying(true);
        setVerificationError("");

        const res = await verifyWaitlist({ token, email });

if (isMounted) {
  const userData = res.data || res;

  // Map backend response attributes cleanly
  setVerifiedUserData({
    userName: userData.firstName || userData.name || email.split("@")[0],
    position: userData.waitlistPosition || userData.position || 1,
    // Dynamic fallback so total is never less than position:
    totalPeople:
      userData.totalPeople ||
      userData.totalCount ||
      userData.waitlistPosition ||
      1,
    referralLink: userData.referralLink || "",
    referralReward: userData.referralReward || "1 USDT",
  });
}
} catch (err) {
  if (isMounted) {
    const msg =
      err?.response?.data?.message ||
      "Verification link is invalid or has expired.";
    setVerificationError(msg);
  }
} finally {
  if (isMounted) {
    setIsVerifying(false);
  }
}
};

runVerification();

return () => {
  isMounted = false;
};
}, [token, email, verifiedUserData]);

  const isSuccessModalOpen = Boolean(verifiedUserData) && !isDismissed;

  const handleCloseModal = () => {
    setIsDismissed(true);
    // Clear URL parameters
    setSearchParams({}, { replace: true });
  };

  return (
    <div style={{ margin: 0, padding: 0, boxSizing: "border-box" }}>
      <Header />
      <main>
        <WaitlistInfo />
        <WaitlistForm />
      </main>
      <Footer />

      {/* Processing Status Indicator */}
      {isVerifying && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#111827",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "0.9rem",
          }}
        >
          Verifying your waitlist spot...
        </div>
      )}

      {/* Verification Error Toast */}
      {verificationError && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#ef4444",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            zIndex: 9999,
            fontSize: "0.9rem",
          }}
        >
          {verificationError}
        </div>
      )}

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseModal}
        userName={verifiedUserData?.userName || "Friend"}
        position={verifiedUserData?.position || 1}
        totalPeople={verifiedUserData?.totalPeople || 1}
        referralLink={verifiedUserData?.referralLink || "https://hedge-nest.vercel.app/"}
        referralReward={verifiedUserData?.referralReward || "1 USDT"}
      />
    </div>
  );
}

export default App;