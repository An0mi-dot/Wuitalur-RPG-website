const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function run(cmd){ return execSync(cmd, { encoding: 'utf8' }).trim(); }

try {
  // Count commits
  const commitCount = run('git rev-list --count HEAD');
  const latestRaw = run('git log -1 --pretty=%ad --date=short');
  // git returns YYYY-MM-DD for --date=short; convert to DD-MM-YYYY (dia-mês-ano)
  const latestParts = latestRaw.split('-');
  const latest = (latestParts.length === 3) ? `${latestParts[2]}-${latestParts[1]}-${latestParts[0]}` : latestRaw;
  const tag = `alpha-${commitCount}`;
  const version = { tag, major:1, minor:0, patch: Number(commitCount), display: `Alpha 1.0.${commitCount}`, date: latest };

  const repoRoot = process.cwd();
  fs.writeFileSync(path.join(repoRoot, 'version.json'), JSON.stringify(version, null, 2), 'utf8');
  console.log('Wrote version.json');

  // build updates.json from recent commits (e.g., last 100)
  const raw = run('git log -n 100 --pretty=format:%ad:::%s --date=short');
  const lines = raw.split('\n');
  const updates = lines.map(line => {
    const parts = line.split(':::');
    let d = parts[0]||'';
    // converte YYYY-MM-DD para DD-MM-YYYY
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)){
      const p = d.split('-'); d = `${p[2]}-${p[1]}-${p[0]}`;
    }
    let msg = parts[1]||'';
    try {
      // remove acentos/diacríticos
      msg = msg.normalize('NFD').replace(/\p{M}/gu, '');
    } catch (e) {
      // se normalize não suportado, manter original
    }
    return { date: d, message: msg };
  });
  fs.writeFileSync(path.join(repoRoot, 'updates.json'), JSON.stringify(updates, null, 2), 'utf8');
  console.log('Wrote updates.json');
} catch (err) {
  console.error('failed to generate metadata', err && err.message);
  process.exit(1);
}
