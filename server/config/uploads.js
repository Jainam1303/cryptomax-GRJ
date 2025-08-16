const path = require('path');
const os = require('os');
const fs = require('fs');

function getUploadsDir() {
  // Prefer explicit env, else use project-local uploads, else OS temp dir
  const envDir = process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.trim();
  const defaultProjectDir = path.join(__dirname, '..', 'uploads');
  const fallbackTmp = path.join(os.tmpdir(), 'cryptomax-uploads');

  const candidate = envDir || defaultProjectDir;
  try {
    fs.mkdirSync(candidate, { recursive: true });
    return candidate;
  } catch (e) {
    console.error('Failed to create uploads dir at', candidate, '- falling back to tmp dir', fallbackTmp, e);
    try {
      fs.mkdirSync(fallbackTmp, { recursive: true });
      return fallbackTmp;
    } catch (e2) {
      console.error('Failed to create tmp uploads dir:', fallbackTmp, e2);
      // As a last resort, return OS tmp (already exists)
      return os.tmpdir();
    }
  }
}

module.exports = { getUploadsDir };
