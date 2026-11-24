/**
 * Web Audio API synthesizer for Mega Coffee Smart Order sound effects
 * Zero external audio dependencies for instant, reliable audio playback.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
}

let isMutedState = false;

export function setMuted(muted: boolean) {
  isMutedState = muted;
  try {
    localStorage.setItem('mgc_sound_muted', muted ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export function getMuted(): boolean {
  try {
    const saved = localStorage.getItem('mgc_sound_muted');
    if (saved !== null) {
      isMutedState = saved === 'true';
    }
  } catch {
    // ignore
  }
  return isMutedState;
}

/**
 * 1. Pop Sound (장바구니 담기 효과음)
 */
export function playPopSound() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(450, now);
  osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);

  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.1);
}

/**
 * 2. Ding-Dong Chime (주문 접수 차임벨 "딩-동~")
 */
export function playDingDongSound() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  // First Tone: Ding (High, E5 ~659Hz)
  const osc1 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  osc1.type = 'triangle';
  osc1.frequency.setValueAtTime(659.25, now);

  gain1.gain.setValueAtTime(0.3, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

  osc1.connect(gain1);
  gain1.connect(ctx.destination);
  osc1.start(now);
  osc1.stop(now + 0.6);

  // Second Tone: Dong (Lower, C5 ~523Hz) with slight delay
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.type = 'triangle';
  osc2.frequency.setValueAtTime(523.25, now + 0.35);

  gain2.gain.setValueAtTime(0.35, now + 0.35);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.start(now + 0.35);
  osc2.stop(now + 1.2);
}

/**
 * 3. Pickup Call Bell (픽업 준비 완료 알림음 "띵-동-댕~")
 */
export function playPickupBellSound() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5 bright triad

  notes.forEach((freq, idx) => {
    const noteTime = now + idx * 0.18;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, noteTime);

    gain.gain.setValueAtTime(0.3, noteTime);
    gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(noteTime);
    osc.stop(noteTime + 0.6);
  });
}

/**
 * 4. Subtle UI Button Click
 */
export function playClickSound() {
  if (getMuted()) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);

  gain.gain.setValueAtTime(0.12, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.04);
}
