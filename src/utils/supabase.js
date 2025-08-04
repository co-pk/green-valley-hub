import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kpcuazrupxhlzktjtkzr.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwY3VhenJ1cHhobHprdGp0a3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMDY4NDYsImV4cCI6MjA2OTg4Mjg0Nn0.ejzMPZLsCI_xpojhreXrsCS_EEsoDT7oZje773s9ZNo";
const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadFileAndGetPublicUrl = async (file, path) => {
  const { data, error } = await supabase.storage
    .from("files")
    .upload(path, file);
  if (error) {
    throw error;
  }
  return data.path;
};
