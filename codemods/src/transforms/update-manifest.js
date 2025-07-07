/**
 * Codemod to update manifest files from frame to miniapp
 * This handles JSON files specifically
 */

import fs from 'fs';
import path from 'path';

export function transformManifest(manifestPath) {
  try {
    const content = fs.readFileSync(manifestPath, 'utf8');
    const manifest = JSON.parse(content);
    
    let hasChanges = false;
    
    // If manifest has 'frame' property, duplicate it as 'miniapp'
    if (manifest.frame && !manifest.miniapp) {
      manifest.miniapp = manifest.frame;
      hasChanges = true;
      
      // Add a comment to indicate dual support
      console.log(`✓ Added 'miniapp' property to manifest at ${manifestPath}`);
      console.log(`  Note: Both 'miniapp' and 'frame' properties are kept for backward compatibility`);
    }
    
    if (hasChanges) {
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing manifest at ${manifestPath}:`, error.message);
    return false;
  }
}

// For use with jscodeshift when processing JS/TS files that might contain manifest objects
export default function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let hasChanges = false;

  // Find object properties named 'frame' that look like manifest configs
  root.find(j.ObjectExpression).forEach((path) => {
    const properties = path.node.properties;
    
    // Check if this object has typical manifest properties
    const hasManifestProperties = properties.some(prop => 
      prop.key && prop.key.name && ['accountAssociation', 'frame'].includes(prop.key.name)
    );
    
    if (hasManifestProperties) {
      const frameProperty = properties.find(prop => 
        prop.key && prop.key.name === 'frame'
      );
      
      const miniappProperty = properties.find(prop => 
        prop.key && prop.key.name === 'miniapp'
      );
      
      // If has 'frame' but not 'miniapp', add 'miniapp' as a copy
      if (frameProperty && !miniappProperty) {
        const miniappProp = j.property(
          'init',
          j.identifier('miniapp'),
          frameProperty.value
        );
        
        // Add miniapp property right after frame property
        const frameIndex = properties.indexOf(frameProperty);
        properties.splice(frameIndex + 1, 0, miniappProp);
        
        hasChanges = true;
      }
    }
  });

  // Update action types in manifest objects
  root.find(j.Literal).forEach((path) => {
    if (path.node.value === 'launch_frame') {
      // Check if this is likely in a manifest context
      const ancestors = j(path).parents();
      const inManifestContext = ancestors.some((ancestor) => {
        if (ancestor.value.type === 'ObjectExpression') {
          return ancestor.value.properties.some(prop => 
            prop.key && prop.key.name && ['action', 'button', 'imageUrl'].includes(prop.key.name)
          );
        }
        return false;
      });
      
      if (inManifestContext) {
        path.node.value = 'launch_miniapp';
        hasChanges = true;
      }
    }
  });

  return hasChanges ? root.toSource() : null;
}