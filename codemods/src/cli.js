#!/usr/bin/env node

import { glob } from 'glob';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import chalk from 'chalk';
import { fileURLToPath } from 'url';
import { transformManifest } from './transforms/update-manifest.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transforms = [
  {
    name: 'update-imports',
    description: 'Update package imports from @farcaster/frame-* to @farcaster/miniapp-*',
    filePattern: '**/*.{js,jsx,ts,tsx}',
  },
  {
    name: 'update-api-methods',
    description: 'Update API method names (e.g., frameHost → miniAppHost)',
    filePattern: '**/*.{js,jsx,ts,tsx}',
  },
  {
    name: 'update-types',
    description: 'Update TypeScript type names (e.g., FrameContext → MiniAppContext)',
    filePattern: '**/*.{ts,tsx}',
  },
  {
    name: 'update-event-names',
    description: 'Update event names (e.g., frame_added → miniapp_added)',
    filePattern: '**/*.{js,jsx,ts,tsx}',
  },
];

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 [options] <path>')
  .option('dry-run', {
    alias: 'd',
    type: 'boolean',
    description: 'Run in dry-run mode (no files will be modified)',
    default: false,
  })
  .option('transform', {
    alias: 't',
    type: 'string',
    description: 'Run only specific transform',
    choices: transforms.map(t => t.name),
  })
  .option('interactive', {
    alias: 'i',
    type: 'boolean',
    description: 'Run in interactive mode',
    default: false,
  })
  .demandCommand(1, 'You must provide a path to transform')
  .help('h')
  .alias('h', 'help')
  .argv;

async function runTransform(transformName, files, dryRun) {
  const transformPath = path.join(__dirname, 'transforms', `${transformName}.js`);
  
  return new Promise((resolve, reject) => {
    const args = [
      '--parser', 'tsx',
      '--extensions', 'js,jsx,ts,tsx',
      '--transform', transformPath,
    ];
    
    if (dryRun) {
      args.push('--dry');
    }
    
    args.push(...files);
    
    const jscodeshift = spawn('jscodeshift', args, {
      stdio: 'inherit',
      shell: true,
    });
    
    jscodeshift.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Transform ${transformName} exited with code ${code}`));
      }
    });
    
    jscodeshift.on('error', (err) => {
      // If jscodeshift is not installed globally, try using npx
      const npxArgs = ['jscodeshift', ...args];
      const npxProcess = spawn('npx', npxArgs, {
        stdio: 'inherit',
        shell: true,
      });
      
      npxProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Transform ${transformName} exited with code ${code}`));
        }
      });
      
      npxProcess.on('error', reject);
    });
  });
}

async function findManifestFiles(targetPath) {
  const patterns = [
    '**/farcaster.json',
    '**/.well-known/farcaster.json',
  ];
  
  const files = [];
  for (const pattern of patterns) {
    const matches = await glob(pattern, {
      cwd: targetPath,
      absolute: true,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    });
    files.push(...matches);
  }
  
  return files;
}

async function main() {
  const targetPath = path.resolve(argv._[0]);
  
  if (!fs.existsSync(targetPath)) {
    console.error(chalk.red(`Error: Path "${targetPath}" does not exist`));
    process.exit(1);
  }
  
  console.log(chalk.blue(`🔄 Migrating Farcaster Frames to MiniApps`));
  console.log(chalk.gray(`Target: ${targetPath}`));
  
  if (argv.dryRun) {
    console.log(chalk.yellow(`⚠️  Running in dry-run mode - no files will be modified`));
  }
  
  // Determine which transforms to run
  let transformsToRun = transforms;
  if (argv.transform) {
    transformsToRun = transforms.filter(t => t.name === argv.transform);
  }
  
  console.log('');
  
  // Run each transform
  for (const transform of transformsToRun) {
    console.log(chalk.cyan(`\n▶ Running transform: ${transform.name}`));
    console.log(chalk.gray(`  ${transform.description}`));
    
    const files = await glob(transform.filePattern, {
      cwd: targetPath,
      absolute: true,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    });
    
    if (files.length === 0) {
      console.log(chalk.gray(`  No files found matching ${transform.filePattern}`));
      continue;
    }
    
    console.log(chalk.gray(`  Found ${files.length} files to process`));
    
    try {
      await runTransform(transform.name, files, argv.dryRun);
      console.log(chalk.green(`  ✓ Transform completed`));
    } catch (error) {
      console.error(chalk.red(`  ✗ Transform failed: ${error.message}`));
      if (!argv.interactive) {
        process.exit(1);
      }
    }
  }
  
  // Handle manifest files separately
  console.log(chalk.cyan(`\n▶ Updating manifest files`));
  const manifestFiles = await findManifestFiles(targetPath);
  
  if (manifestFiles.length === 0) {
    console.log(chalk.gray(`  No manifest files found`));
  } else {
    console.log(chalk.gray(`  Found ${manifestFiles.length} manifest files`));
    
    for (const manifestFile of manifestFiles) {
      if (argv.dryRun) {
        console.log(chalk.gray(`  Would update: ${path.relative(targetPath, manifestFile)}`));
      } else {
        const updated = transformManifest(manifestFile);
        if (updated) {
          console.log(chalk.green(`  ✓ Updated: ${path.relative(targetPath, manifestFile)}`));
        } else {
          console.log(chalk.gray(`  - No changes needed: ${path.relative(targetPath, manifestFile)}`));
        }
      }
    }
  }
  
  console.log(chalk.green(`\n✅ Migration complete!`));
  
  if (!argv.dryRun) {
    console.log(chalk.yellow(`\n⚠️  Important notes:`));
    console.log(chalk.gray(`  1. Review the changes to ensure they're correct`));
    console.log(chalk.gray(`  2. The old frame packages still work but show deprecation warnings`));
    console.log(chalk.gray(`  3. Update your package.json dependencies to use @farcaster/miniapp-* packages`));
    console.log(chalk.gray(`  4. Test your application thoroughly after migration`));
  }
}

main().catch((error) => {
  console.error(chalk.red(`\n❌ Error: ${error.message}`));
  process.exit(1);
});