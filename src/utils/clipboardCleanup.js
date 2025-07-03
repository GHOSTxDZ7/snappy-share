import { supabase } from "../supabase/config";

/**
 * Deletes a clipboard text record from Supabase by ID.
 * @param {string} id - The full ID of the text record (e.g., '1234-162938493')
 * @returns {Object} - Success status and a message
 */
export async function cleanupSingleText(id) {
  const { error } = await supabase
    .from("text_clipboard")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`❌ Failed to delete clipboard text ID ${id}:`, error.message);
    return { success: false, message: error.message };
  }

  console.log(`✅ Clipboard text "${id}" deleted successfully.`);
  return { success: true, message: "Clipboard text deleted" };
}
