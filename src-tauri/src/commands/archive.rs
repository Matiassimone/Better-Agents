use std::fs::{self, File};
use std::io::{Read, Write};
use std::path::Path;
use tauri::command;
use walkdir::WalkDir;
use zip::write::FileOptions;
use zip::{ZipArchive, ZipWriter};

/// Export files to a ZIP archive
#[command]
pub fn export_zip(paths: Vec<String>, output_path: String) -> Result<(), String> {
    let file = File::create(&output_path)
        .map_err(|e| format!("Failed to create ZIP file: {}", e))?;
    
    let mut zip = ZipWriter::new(file);
    let options = FileOptions::default()
        .compression_method(zip::CompressionMethod::Deflated)
        .unix_permissions(0o755);

    for path_str in paths {
        let path = Path::new(&path_str);
        
        if !path.exists() {
            continue;
        }

        if path.is_file() {
            let name = path.file_name()
                .and_then(|n| n.to_str())
                .ok_or_else(|| "Invalid file name".to_string())?;
            
            zip.start_file(name, options)
                .map_err(|e| format!("Failed to start file in ZIP: {}", e))?;
            
            let mut file = File::open(path)
                .map_err(|e| format!("Failed to open file: {}", e))?;
            let mut buffer = Vec::new();
            file.read_to_end(&mut buffer)
                .map_err(|e| format!("Failed to read file: {}", e))?;
            
            zip.write_all(&buffer)
                .map_err(|e| format!("Failed to write to ZIP: {}", e))?;
        } else if path.is_dir() {
            let base_path = path.parent().unwrap_or(path);
            
            for entry in WalkDir::new(path) {
                let entry = entry.map_err(|e| format!("Failed to walk directory: {}", e))?;
                let entry_path = entry.path();
                
                let relative_path = entry_path.strip_prefix(base_path)
                    .map_err(|e| format!("Failed to get relative path: {}", e))?;
                let name = relative_path.to_string_lossy().to_string();

                if entry_path.is_file() {
                    zip.start_file(&name, options)
                        .map_err(|e| format!("Failed to start file in ZIP: {}", e))?;
                    
                    let mut file = File::open(entry_path)
                        .map_err(|e| format!("Failed to open file: {}", e))?;
                    let mut buffer = Vec::new();
                    file.read_to_end(&mut buffer)
                        .map_err(|e| format!("Failed to read file: {}", e))?;
                    
                    zip.write_all(&buffer)
                        .map_err(|e| format!("Failed to write to ZIP: {}", e))?;
                } else if entry_path.is_dir() && !name.is_empty() {
                    zip.add_directory(&name, options)
                        .map_err(|e| format!("Failed to add directory to ZIP: {}", e))?;
                }
            }
        }
    }

    zip.finish()
        .map_err(|e| format!("Failed to finish ZIP: {}", e))?;

    Ok(())
}

/// Import files from a ZIP archive
#[command]
pub fn import_zip(zip_path: String, target_root: String) -> Result<(), String> {
    let file = File::open(&zip_path)
        .map_err(|e| format!("Failed to open ZIP file: {}", e))?;
    
    let mut archive = ZipArchive::new(file)
        .map_err(|e| format!("Failed to read ZIP archive: {}", e))?;

    let target_path = Path::new(&target_root);
    fs::create_dir_all(target_path)
        .map_err(|e| format!("Failed to create target directory: {}", e))?;

    for i in 0..archive.len() {
        let mut file = archive.by_index(i)
            .map_err(|e| format!("Failed to read file from ZIP: {}", e))?;
        
        let outpath = match file.enclosed_name() {
            Some(path) => target_path.join(path),
            None => continue,
        };

        if file.is_dir() {
            fs::create_dir_all(&outpath)
                .map_err(|e| format!("Failed to create directory: {}", e))?;
        } else {
            if let Some(parent) = outpath.parent() {
                fs::create_dir_all(parent)
                    .map_err(|e| format!("Failed to create parent directory: {}", e))?;
            }
            
            let mut outfile = File::create(&outpath)
                .map_err(|e| format!("Failed to create file: {}", e))?;
            
            std::io::copy(&mut file, &mut outfile)
                .map_err(|e| format!("Failed to extract file: {}", e))?;
        }
    }

    Ok(())
}
