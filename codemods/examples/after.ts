// After migration - using MiniApps
import { miniAppHost } from '@farcaster/miniapp-sdk';
import type { MiniAppContext } from '@farcaster/miniapp-core';

async function initializeApp() {
  // Get miniapp context
  const context: MiniAppContext = await miniAppHost.getMiniAppContext();
  
  // Check if we're in a miniapp
  if (!miniAppHost.isInMiniApp()) {
    console.log('Not running in a miniapp');
    return;
  }
  
  // Add miniapp button click handler
  document.getElementById('add-btn')?.addEventListener('click', async () => {
    try {
      await miniAppHost.addMiniApp({
        url: window.location.href
      });
      console.log('MiniApp added successfully');
    } catch (error) {
      console.error('Failed to add miniapp:', error);
    }
  });
  
  // Listen for miniapp events
  miniAppHost.on('miniapp_added', (event) => {
    console.log('MiniApp was added:', event);
  });
  
  miniAppHost.on('miniapp_removed', (event) => {
    console.log('MiniApp was removed:', event);
  });
}

// Initialize when ready
initializeApp();