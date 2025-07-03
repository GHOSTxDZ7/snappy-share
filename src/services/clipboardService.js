// services/clipboardService.js
import { supabase } from "../supabase/config";

/**
 * 📤 Uploads clipboard text to Supabase DB with a 4-digit OTP.
 * @param {string} text - The clipboard text content to be shared.
 * @returns {Object} - Upload status including OTP and text content.
 */
export async function uploadText(text) {
  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 🔢 Generate 4-digit OTP
  const timestamp = Date.now().toString(); // 🕒 Unique ID component
  const id = `${otp}-${timestamp}`;

  const { error } = await supabase.from("text_clipboard").insert([
    {
      id,
      otp,
      content: text,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    otp,
    content: text,
    id,
  };
}

/**
 * 🔍 Retrieves clipboard text by OTP.
 * @param {string} otp - 4-digit OTP to retrieve the shared text.
 * @returns {Object} - Retrieved text content or error.
 */
export async function retrieveText(otp) {
  const { data, error } = await supabase
    .from("text_clipboard")
    .select("*")
    .eq("otp", otp)
    .limit(1)
    .single();

  if (error || !data) {
    return { success: false, error: "Text not found" };
  }

  return {
    success: true,
    content: data.content,
    otp: data.otp,
    id: data.id,
  };
}
