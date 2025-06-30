import { frameHost, FrameContext } from '@farcaster/frame-sdk';
import { FrameHost, WireFrameHost } from '@farcaster/frame-core';
import { farcasterFrame } from '@farcaster/frame-wagmi-connector';

// API usage
async function main() {
  const context: FrameContext = await frameHost.getFrameContext();
  
  await frameHost.addFrame({
    url: 'https://example.com'
  });
  
  // Event handling
  frameHost.on('frame_added', (event) => {
    console.log('Frame added:', event);
  });
  
  frameHost.on('frame_removed', (event) => {
    console.log('Frame removed:', event);
  });
}

// Type usage
interface CustomFrameHost extends FrameHost {
  customMethod(): void;
}

type MyEventType = 'frame_added' | 'frame_removed' | 'other';

const eventHandlers = {
  onFrameAdded: () => console.log('added'),
  onFrameRemoved: () => console.log('removed'),
};

// Manifest object
const manifest = {
  accountAssociation: {
    header: "...",
    payload: "...",
    signature: "..."
  },
  frame: {
    version: "1",
    name: "My App",
    iconUrl: "https://example.com/icon.png",
    action: {
      type: "launch_frame",
      url: "https://example.com"
    }
  }
};