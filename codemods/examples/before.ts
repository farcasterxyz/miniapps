// Before migration - using Frames
import { frameHost } from '@farcaster/frame-sdk';
import type { FrameContext } from '@farcaster/frame-core';

async function initializeApp() {
  // Get frame context
  const context: FrameContext = await frameHost.getFrameContext();
  
  // Check if we're in a frame
  if (!frameHost.isInFrame()) {
    console.log('Not running in a frame');
    return;
  }
  
  // Add frame button click handler
  document.getElementById('add-btn')?.addEventListener('click', async () => {
    try {
      await frameHost.addFrame({
        url: window.location.href
      });
      console.log('Frame added successfully');
    } catch (error) {
      console.error('Failed to add frame:', error);
    }
  });
  
  // Listen for frame events
  frameHost.on('frame_added', (event) => {
    console.log('Frame was added:', event);
  });
  
  frameHost.on('frame_removed', (event) => {
    console.log('Frame was removed:', event);
  });
}

// Initialize when ready
initializeApp();