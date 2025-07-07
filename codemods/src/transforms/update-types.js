/**
 * Codemod to update TypeScript type names from Frame to MiniApp
 */

const typeMappings = {
  // Core types
  'FrameContext': 'MiniAppContext',
  'FrameHost': 'MiniAppHost',
  'WireFrameHost': 'WireMiniAppHost',
  'FrameConfig': 'MiniAppConfig',
  'FrameManifest': 'MiniAppManifest',
  'FrameEmbed': 'MiniAppEmbed',
  
  // Event types
  'FrameClientEvent': 'MiniAppClientEvent',
  'FrameServerEvent': 'MiniAppServerEvent',
  'EventFrameAdded': 'EventMiniAppAdded',
  'EventFrameRemoved': 'EventMiniAppRemoved',
  'EventFrameAddRejected': 'EventMiniAppAddRejected',
  
  // Notification types
  'FrameNotificationDetails': 'MiniAppNotificationDetails',
  'FrameNotificationDetailsV1': 'MiniAppNotificationDetailsV1',
  'FrameNotificationDetailsV2': 'MiniAppNotificationDetailsV2',
  'FrameNotificationTargetDetails': 'MiniAppNotificationTargetDetails',
  
  // Action types
  'AddFrameRejectedReason': 'AddMiniAppRejectedReason',
  'AddFrameResult': 'AddMiniAppResult',
  'RemoveFrameResult': 'RemoveMiniAppResult',
  
  // Provider types
  'FrameEthereumProvider': 'MiniAppEthereumProvider',
  'FrameEthereumProviderError': 'MiniAppEthereumProviderError',
  
  // SDK types
  'FrameSDK': 'MiniAppSDK',
  
  // Schema types
  'FrameEmbedSchema': 'MiniAppEmbedSchema',
  'DomainFrameConfigSchema': 'DomainMiniAppConfigSchema',
};

export default function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let hasChanges = false;

  // Update TypeScript type references
  root.find(j.TSTypeReference).forEach((path) => {
    if (path.node.typeName.type === 'Identifier' && typeMappings[path.node.typeName.name]) {
      path.node.typeName.name = typeMappings[path.node.typeName.name];
      hasChanges = true;
    }
  });

  // Update type imports/exports
  root.find(j.ImportSpecifier).forEach((path) => {
    const importedName = path.node.imported.name;
    if (typeMappings[importedName]) {
      // If there's a local alias, keep it but update the imported name
      if (path.node.local && path.node.local.name !== importedName) {
        path.node.imported.name = typeMappings[importedName];
      } else {
        path.node.imported.name = typeMappings[importedName];
        path.node.local.name = typeMappings[importedName];
      }
      hasChanges = true;
    }
  });

  // Update export specifiers
  root.find(j.ExportSpecifier).forEach((path) => {
    const exportedName = path.node.exported.name;
    if (typeMappings[exportedName]) {
      path.node.exported.name = typeMappings[exportedName];
      if (path.node.local && path.node.local.name === exportedName) {
        path.node.local.name = typeMappings[exportedName];
      }
      hasChanges = true;
    }
  });

  // Update type aliases and interfaces
  root.find(j.TSTypeAliasDeclaration).forEach((path) => {
    if (typeMappings[path.node.id.name]) {
      path.node.id.name = typeMappings[path.node.id.name];
      hasChanges = true;
    }
  });

  root.find(j.TSInterfaceDeclaration).forEach((path) => {
    if (typeMappings[path.node.id.name]) {
      path.node.id.name = typeMappings[path.node.id.name];
      hasChanges = true;
    }
  });

  // Update generic type parameters
  root.find(j.TSTypeParameter).forEach((path) => {
    if (path.node.name && typeMappings[path.node.name]) {
      path.node.name = typeMappings[path.node.name];
      hasChanges = true;
    }
  });

  // Update type annotations
  root.find(j.Identifier).forEach((path) => {
    // Check if this identifier is used as a type (not a value)
    const parent = path.parent.node;
    if (parent && (
      parent.type === 'TSTypeReference' ||
      (parent.type === 'TSTypeAnnotation' && parent.typeAnnotation === path.node) ||
      (parent.type === 'TSAsExpression' && parent.typeAnnotation === path.node)
    )) {
      if (typeMappings[path.node.name]) {
        path.node.name = typeMappings[path.node.name];
        hasChanges = true;
      }
    }
  });

  return hasChanges ? root.toSource() : null;
}