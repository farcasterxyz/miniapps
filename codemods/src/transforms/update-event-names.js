/**
 * Codemod to update event names from frame to miniapp
 */

const eventMappings = {
  'frame_added': 'miniapp_added',
  'frame_removed': 'miniapp_removed',
  'frame_add_rejected': 'miniapp_add_rejected',
};

export default function transformer(fileInfo, api) {
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  let hasChanges = false;

  // Update string literals
  root.find(j.Literal).forEach((path) => {
    if (typeof path.node.value === 'string' && eventMappings[path.node.value]) {
      path.node.value = eventMappings[path.node.value];
      hasChanges = true;
    }
  });

  // Update template literals that might contain event names
  root.find(j.TemplateLiteral).forEach((path) => {
    path.node.quasis.forEach((quasi) => {
      Object.keys(eventMappings).forEach((oldEvent) => {
        if (quasi.value.raw.includes(oldEvent)) {
          quasi.value.raw = quasi.value.raw.replace(
            new RegExp(oldEvent, 'g'),
            eventMappings[oldEvent]
          );
          quasi.value.cooked = quasi.value.cooked.replace(
            new RegExp(oldEvent, 'g'),
            eventMappings[oldEvent]
          );
          hasChanges = true;
        }
      });
    });
  });

  // Update event handler method names (e.g., onFrameAdded → onMiniAppAdded)
  const eventHandlerMappings = {
    'onFrameAdded': 'onMiniAppAdded',
    'onFrameRemoved': 'onMiniAppRemoved',
    'onFrameAddRejected': 'onMiniAppAddRejected',
    'handleFrameAdded': 'handleMiniAppAdded',
    'handleFrameRemoved': 'handleMiniAppRemoved',
    'handleFrameAddRejected': 'handleMiniAppAddRejected',
  };

  root.find(j.Identifier).forEach((path) => {
    if (eventHandlerMappings[path.node.name]) {
      // Skip if it's a property key in an object literal
      const parent = path.parent.node;
      if (parent.type === 'Property' && parent.key === path.node) {
        return;
      }
      
      path.node.name = eventHandlerMappings[path.node.name];
      hasChanges = true;
    }
  });

  // Update object property names in event listeners
  root.find(j.Property).forEach((path) => {
    if (path.node.key.type === 'Identifier' && eventHandlerMappings[path.node.key.name]) {
      path.node.key.name = eventHandlerMappings[path.node.key.name];
      hasChanges = true;
    }
  });

  return hasChanges ? root.toSource() : null;
}