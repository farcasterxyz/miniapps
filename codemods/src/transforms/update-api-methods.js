/**
 * Codemod to update API method calls from frame to miniapp
 */

const methodMappings = {
  'frameHost': 'miniAppHost',
  'addFrame': 'addMiniApp',
  'getFrameContext': 'getMiniAppContext',
  'createFrameAdapter': 'createMiniAppAdapter',
  'exposeToFrame': 'exposeToMiniApp',
  'isInFrame': 'isInMiniApp',
};

export default function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let hasChanges = false;

  // Update identifier names (e.g., frameHost → miniAppHost)
  root.find(j.Identifier).forEach((path) => {
    if (methodMappings[path.node.name]) {
      // Skip if it's a property of an object literal or a key in object pattern
      const parent = path.parent.node;
      if (parent.type === 'Property' && parent.key === path.node) {
        return;
      }
      
      path.node.name = methodMappings[path.node.name];
      hasChanges = true;
    }
  });

  // Update method calls (e.g., sdk.actions.addFrame → sdk.actions.addMiniApp)
  root.find(j.MemberExpression).forEach((path) => {
    if (path.node.property.type === 'Identifier' && methodMappings[path.node.property.name]) {
      path.node.property.name = methodMappings[path.node.property.name];
      hasChanges = true;
    }
  });

  // Update import specifiers
  root.find(j.ImportSpecifier).forEach((path) => {
    const importedName = path.node.imported.name;
    if (methodMappings[importedName]) {
      // If there's a local alias, keep it
      if (path.node.local && path.node.local.name !== importedName) {
        path.node.imported.name = methodMappings[importedName];
      } else {
        path.node.imported.name = methodMappings[importedName];
        path.node.local.name = methodMappings[importedName];
      }
      hasChanges = true;
    }
  });

  // Update export specifiers
  root.find(j.ExportSpecifier).forEach((path) => {
    const exportedName = path.node.exported.name;
    if (methodMappings[exportedName]) {
      path.node.exported.name = methodMappings[exportedName];
      if (path.node.local && path.node.local.name === exportedName) {
        path.node.local.name = methodMappings[exportedName];
      }
      hasChanges = true;
    }
  });

  return hasChanges ? root.toSource() : null;
}