mod commands;

use commands::{archive, frontmatter, fs};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            // Filesystem commands
            fs::read_text_file,
            fs::write_text_file,
            fs::ensure_dir,
            fs::list_dir,
            fs::exists,
            fs::copy_dir_recursive,
            // Frontmatter commands
            frontmatter::read_frontmatter,
            // Archive commands
            archive::export_zip,
            archive::import_zip,
        ])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

