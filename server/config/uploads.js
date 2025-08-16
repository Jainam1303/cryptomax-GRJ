const path = require('path');
const os = require('os');
const fs = require('fs');

function getUploadsDir() {
  // Prefer explicit env; otherwise default to OS temp (writable on PaaS); project dir only if explicitly requested
  const envDir = process.env.UPLOADS_DIR && process.env.UPLOADS_DIR.trim();
  const defaultTmp = path.join(os.tmpdir(), 'cryptomax-uploads');
  const projectDir = path.join(__dirname, '..', 'uploads');

  const primary = envDir || defaultTmp;
  try {
    fs.mkdirSync(primary, { recursive: true });
    return primary;
  } catch (e) {
    console.error('Failed to create primary uploads dir at', primary, e);
    // Try project dir as fallback if tmp failed (unlikely)
    try {
      fs.mkdirSync(projectDir, { recursive: true });
      return projectDir;
    } catch (e2) {
      console.error('Failed to create project uploads dir at', projectDir, e2);
      // Last resort: bare OS tmp
      return os.tmpdir();
    }
  }
}

module.exports = { getUploadsDir };
