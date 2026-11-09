use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct DirEntry {
    pub name: String,
    pub is_dir: bool,
    pub path: String,
}

/// Select multiple folders using native dialog
#[command]
pub fn select_folders(app: tauri::AppHandle) -> Result<Vec<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    use std::sync::mpsc;
    
    let (tx, rx) = mpsc::channel();
    
    app.dialog()
        .file()
        .set_title("Select Folders")
        .pick_folders(move |folders| {
            let _ = tx.send(folders);
        });
    
    // Wait for the dialog to complete with a timeout
    match rx.recv_timeout(std::time::Duration::from_secs(300)) {
        Ok(Some(paths)) => {
            Ok(paths.iter()
                .filter_map(|p| p.as_path())
                .map(|p| p.to_string_lossy().to_string())
                .collect())
        }
        Ok(None) => Ok(Vec::new()), // User cancelled
        Err(_) => Err("Dialog timeout".to_string()),
    }
}


/// Read a text file and return its contents
#[command]
pub fn read_text_file(path: String) -> Result<String, String> {
    fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file {}: {}", path, e))
}

/// Write content to a text file
#[command]
pub fn write_text_file(path: String, content: String) -> Result<(), String> {
    fs::write(&path, content)
        .map_err(|e| format!("Failed to write file {}: {}", path, e))
}

/// Ensure a directory exists, creating it if necessary
#[command]
pub fn ensure_dir(path: String) -> Result<(), String> {
    fs::create_dir_all(&path)
        .map_err(|e| format!("Failed to create directory {}: {}", path, e))
}

/// List directory entries
#[command]
pub fn list_dir(path: String) -> Result<Vec<DirEntry>, String> {
    let entries = fs::read_dir(&path)
        .map_err(|e| format!("Failed to read directory {}: {}", path, e))?;

    let mut result = Vec::new();
    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read entry: {}", e))?;
        let metadata = entry.metadata()
            .map_err(|e| format!("Failed to read metadata: {}", e))?;
        
        result.push(DirEntry {
            name: entry.file_name().to_string_lossy().to_string(),
            is_dir: metadata.is_dir(),
            path: entry.path().to_string_lossy().to_string(),
        });
    }

    Ok(result)
}

/// Check if a path exists
#[command]
pub fn exists(path: String) -> bool {
    Path::new(&path).exists()
}

/// Copy a directory recursively
#[command]
pub fn copy_dir_recursive(src: String, dst: String) -> Result<(), String> {
    use walkdir::WalkDir;

    let src_path = Path::new(&src);
    let dst_path = Path::new(&dst);

    if !src_path.exists() {
        return Err(format!("Source path does not exist: {}", src));
    }

    for entry in WalkDir::new(src_path) {
        let entry = entry.map_err(|e| format!("Failed to walk directory: {}", e))?;
        let path = entry.path();
        
        let relative_path = path.strip_prefix(src_path)
            .map_err(|e| format!("Failed to get relative path: {}", e))?;
        let target_path = dst_path.join(relative_path);

        if path.is_dir() {
            fs::create_dir_all(&target_path)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            if let Some(parent) = target_path.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create parent directory: {}", e))?;
            }
            fs::copy(path, &target_path)
                .map_err(|e| format!("Failed to copy file: {}", e))?;
        }
    }

    Ok(())
}
