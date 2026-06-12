export async function uploadMaterial(_file: File, _path: string): Promise<string> {
  return Promise.resolve("https://example.com/mock-upload");
}
export async function deleteMaterial(_path: string): Promise<void> {
  return Promise.resolve();
}