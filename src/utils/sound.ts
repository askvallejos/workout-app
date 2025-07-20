export const playBeep = async (): Promise<void> => {
  try {
    // Check if user has muted their device
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create two 440Hz beeps
    for (let i = 0; i < 2; i++) {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = 440; // A4 note
      oscillator.type = 'sine';
      
      const now = audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      
      oscillator.start(now + (i * 0.4));
      oscillator.stop(now + 0.3 + (i * 0.4));
      
      if (i === 0) {
        await new Promise(resolve => setTimeout(resolve, 400));
      }
    }
  } catch (error) {
    // Fallback to vibration if audio fails
    if (navigator.vibrate) {
      navigator.vibrate([300, 100, 300]);
    }
  }
};

export const triggerHaptic = (): void => {
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
};