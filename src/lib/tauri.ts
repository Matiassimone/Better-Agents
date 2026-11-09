import { invoke } from '@tauri-apps/api/core';

export interface DirEntry {
  name: string;
  is_dir: boolean;
  path: string;
}

export interface FrontmatterResult {
  frontmatter: Record<string, any> | null;
  body: string;
}

// Filesystem operations
export async function selectFolders(): Promise<string[]> {
  return await invoke('select_folders');
}

export async function readTextFile(path: string): Promise<string> {
  return await invoke('read_text_file', { path });
}

export async function writeTextFile(path: string, content: string): Promise<void> {
  return await invoke('write_text_file', { path, content });
}

export async function ensureDir(path: string): Promise<void> {
  return await invoke('ensure_dir', { path });
}

export async function listDir(path: string): Promise<DirEntry[]> {
  return await invoke('list_dir', { path });
}

export async function exists(path: string): Promise<boolean> {
  return await invoke('exists', { path });
}

export async function copyDirRecursive(src: string, dst: string): Promise<void> {
  return await invoke('copy_dir_recursive', { src, dst });
}

// Frontmatter operations
export async function readFrontmatter(path: string): Promise<FrontmatterResult> {
  return await invoke('read_frontmatter', { path });
}

// Archive operations
export async function exportZip(paths: string[], outputPath: string): Promise<void> {
  return await invoke('export_zip', { paths, outputPath });
}

export async function importZip(zipPath: string, targetRoot: string): Promise<void> {
  return await invoke('import_zip', { zipPath, targetRoot });
}
