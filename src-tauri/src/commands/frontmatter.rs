use serde::{Deserialize, Serialize};
use std::fs;
use tauri::command;

#[derive(Debug, Serialize, Deserialize)]
pub struct FrontmatterResult {
    pub frontmatter: Option<serde_json::Value>,
    pub body: String,
}

/// Read a file and parse YAML frontmatter
#[command]
pub fn read_frontmatter(path: String) -> Result<FrontmatterResult, String> {
    let content = fs::read_to_string(&path)
        .map_err(|e| format!("Failed to read file {}: {}", path, e))?;

    // Manual frontmatter parsing
    // Frontmatter is between --- markers at the start of the file
    if content.starts_with("---\n") || content.starts_with("---\r\n") {
        let rest = if content.starts_with("---\r\n") {
            &content[5..]
        } else {
            &content[4..]
        };
        
        if let Some(end_pos) = rest.find("\n---\n").or_else(|| rest.find("\r\n---\r\n")) {
            let yaml_str = &rest[..end_pos];
            let body_start = if rest[end_pos..].starts_with("\r\n---\r\n") {
                end_pos + 7
            } else {
                end_pos + 5
            };
            let body = rest[body_start..].to_string();
            
            // Parse YAML frontmatter
            let frontmatter = match serde_yaml::from_str::<serde_json::Value>(yaml_str) {
                Ok(value) => Some(value),
                Err(_) => None,
            };
            
            return Ok(FrontmatterResult { frontmatter, body });
        }
    }
    
    // No frontmatter found
    Ok(FrontmatterResult {
        frontmatter: None,
        body: content,
    })
}
