import { supabase } from "../supabase/config";

/**
 * Deletes a single file and its metadata from Supabase storage and database.
 * @param {string} filename - Full path of the file (e.g., '1234/myfile.pdf')
 * @param {string} otp - The 4-digit OTP used to identify the file in metadata
 * @returns {Object} - Success status and a message
 */
export async function cleanupSingleFile(filename, otp) {
  const BUCKET = "snappybucket"; // 🔐 Supabase storage bucket name

  // 🔥 Step 1: Remove file from Supabase storage
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([filename]); // 🧹 Delete file by path

  if (storageError) {
    // ❌ Log and return error if file deletion failed
    console.error(`❌ Failed to delete file ${filename}:`, storageError.message);
    return { success: false, message: storageError.message };
  }

  // 🗃️ Step 2: Remove associated metadata from 'file_metadata' table
  const { error: dbError } = await supabase
    .from("file_metadata")
    .delete()
    .eq("otp", otp); // Delete row where OTP matches

  if (dbError) {
    // ❌ Log and return error if DB row deletion failed
    console.error(`❌ Failed to delete metadata for OTP ${otp}:`, dbError.message);
    return { success: false, message: dbError.message };
  }

  // ✅ Cleanup success
  console.log(`✅ File "${filename}" with OTP "${otp}" deleted successfully.`);
  return { success: true, message: "Deleted successfully" };
}
