import axios from "axios";
import { API_BASE_URL, WAITLIST_API_ENDPOINT } from "../config/config.js";

/**
 * Register a user for the HedgeNest waitlist
 * @param {Object} data
 * @param {string} data.firstName - User's first name
 * @param {string} data.lastName - User's last name
 * @param {string} data.email - User's email address
 * @param {string} data.amountRange - Selected savings/investment amount range slug
 * @param {string|null} [data.referralCode] - Optional referral code from URL
 * @returns {Promise<Object>} API response object containing success status, message, and data
 */
export const registerWaitlist = async ({
  firstName,
  lastName,
  email,
  amountRange,
  referralCode = null,
}) => {
  const response = await axios.post(
    WAITLIST_API_ENDPOINT,
    {
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      email: email?.trim(),
      amountRange,
      referralCode: referralCode || null,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * Verify waitlist email using verification token
 * @param {Object} data
 * @param {string} data.token - Verification token received via email
 * @param {string} [data.email] - Optional email address
 * @returns {Promise<Object>}
 */
export const verifyWaitlist = async ({ token, email }) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/waitlist/verify`,
    { token, email },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * Resend verification email to waitlist applicant
 * @param {string} email
 * @returns {Promise<Object>}
 */
export const resendWaitlistVerification = async (email) => {
  const response = await axios.post(
    `${API_BASE_URL}/api/v1/waitlist/resend-verification`,
    { email: email?.trim() },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};