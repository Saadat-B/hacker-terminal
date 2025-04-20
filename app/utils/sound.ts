'use client';

/**
 * Simple sound player that doesn't rely on external audio files
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize the sound manager
   */
  initialize() {
    if (this.isInitialized) return;
    
    if (typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.isInitialized = true;
      } catch (e) {
        console.error('Web Audio API is not supported in this browser', e);
      }
    }
  }
  
  /**
   * Play a random keyboard-like sound
   */
  playRandomSound() {
    if (!this.isInitialized || !this.audioContext) {
      return;
    }
    
    try {
      // Create oscillator for key press sound
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      // Random frequency for variety (higher pitch = keyboard click)
      oscillator.type = 'square';
      oscillator.frequency.value = 800 + Math.random() * 500;
      
      // Very short duration for click sound
      gainNode.gain.value = 0.1;
      gainNode.gain.exponentialRampToValueAtTime(
        0.001, this.audioContext.currentTime + 0.1
      );
      
      // Connect and play
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.1);
    } catch (e) {
      console.error('Error playing sound:', e);
    }
  }
} 