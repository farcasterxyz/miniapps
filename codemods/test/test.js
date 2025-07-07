import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fixtureFile = path.join(__dirname, 'fixtures', 'example.ts');
const originalContent = fs.readFileSync(fixtureFile, 'utf8');

console.log('🧪 Testing Frames to MiniApps codemods...\n');

// Run the CLI in dry-run mode
const cliPath = path.join(__dirname, '..', 'src', 'cli.js');
const testProcess = spawn('node', [cliPath, './test/fixtures', '--dry-run'], {
  cwd: path.join(__dirname, '..'),
  stdio: 'pipe'
});

let output = '';
testProcess.stdout.on('data', (data) => {
  output += data.toString();
  process.stdout.write(data);
});

testProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

testProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`\n❌ Test failed with exit code ${code}`);
    process.exit(code);
  }
  
  console.log('\n✅ Dry run completed successfully');
  
  // Verify file wasn't modified (dry run)
  const currentContent = fs.readFileSync(fixtureFile, 'utf8');
  if (currentContent !== originalContent) {
    console.error('❌ File was modified in dry-run mode!');
    process.exit(1);
  }
  
  console.log('✅ File was not modified (as expected in dry-run mode)');
  console.log('\n🎉 All tests passed!');
});