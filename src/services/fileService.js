import { supabase } from "../supabase/config";
import { v4 as uuidv4 } from "uuid";

const BUCKET_NAME = "snappybucket";              // 📦 Supabase storage bucket name
const EXPIRATION_MINUTES = 5;                    // ⏳ File expiry time (in minutes)

/**
 * 📤 Uploads a file to Supabase Storage and logs metadata into the `file_metadata` table.
 * @param {File} file - The file selected by the user from the browser.
 * @returns {Object} - Returns an object with upload success status, OTP, and metadata.
 */
export async function uploadFile(file) {
  const id = uuidv4();                            // 🔐 Unique ID for internal reference
  const otp = id.slice(0, 4);                     // 🔢 First 4 characters used as OTP
  const filename = `${otp}/${file.name}`;         // 📁 Stored under OTP folder
  const expiresAt = new Date(Date.now() + EXPIRATION_MINUTES * 60 * 1000).toISOString(); // 🕒 Expiry time in ISO format

  // 🗂️ Upload the file to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filename, file);

  if (uploadError) {
    return { success: false, error: uploadError.message }; // ❌ Upload failed
  }

  // 📝 Log file metadata into the database
  const { error: metaError } = await supabase
    .from("file_metadata")
    .insert([
      {
        id,
        otp,
        filename,
        original_name: file.name,
        type: file.type,
        size: file.size,
        expires_at: expiresAt,
      },
    ]);

  if (metaError) {
    return { success: false, error: metaError.message }; // ❌ Metadata insert failed
  }

  return {
    success: true,
    otp,
    originalName: file.name,
    size: file.size,
    type: file.type,
    expiresAt,
  };
}

/**
 * 🔍 Retrieves file metadata from DB using OTP and checks if the file is still valid.
 * @param {string} otp - The 4-digit code entered by user.
 * @returns {Object} - File details or error object.
 */
export async function retrieveFile(otp) {
  const { data, error } = await supabase
    .from("file_metadata")
    .select("*")
    .eq("otp", otp)
    .limit(1)
    .single(); // 🔎 Get first matching record

  if (error || !data) {
    return { success: false, error: "File not found" }; // ❌ No file found
  }

  // Convert expiry to local timezone
  const expiryUTC = new Date(data.expires_at); 
  const localExpiry = new Date(
    expiryUTC.getTime() - expiryUTC.getTimezoneOffset() * 60 * 1000
  );
  const nowLocal = new Date();

  const expired = localExpiry < nowLocal;

  if (expired) {
    return { success: false, error: "File has expired" }; // ⏰ File is too old
  }

  return {
    success: true,
    filename: data.filename,
    originalName: data.original_name,
    type: data.type,
    size: data.size,
    expiresAt: data.expires_at,
    otp: data.otp,
  };
}

/**
 * ⬇️ Generates a signed URL from Supabase to download the file securely.
 * @param {string} filename - Path in storage bucket (e.g., '1234/document.pdf').
 * @param {string} otp - OTP to validate file location.
 * @returns {Object} - Signed download URL or an error.
 */
export async function downloadFile(filename, otp) {
  if (!filename.startsWith(otp)) {
    return { success: false, error: "Invalid OTP" }; // ❌ OTP doesn't match file path
  }

  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .createSignedUrl(filename, EXPIRATION_MINUTES * 60); // 🔐 Create 5-min signed URL

  if (error || !data) {
    return { success: false, error: "Failed to generate download URL" };
  }

  return {
    success: true,
    url: data.signedUrl, // ✅ Safe URL to access the file
  };
}
