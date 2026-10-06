"use client";

/* ===== Web Audio API Sound Synthesizer for Emergency Features ===== */

let audioCtx: AudioContext | null = null;
let currentOscillator: OscillatorNode | null = null;
let currentGain: GainNode | null = null;
let intervalId: any = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playRingTone(): () => void {
  try {
    const ctx = getAudioContext();
    let ringing = true;

    const ringCycle = () => {
      if (!ringing) return;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.frequency.value = 440;
      osc2.frequency.value = 480;

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime + 1.8);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 2.0);
      osc2.stop(ctx.currentTime + 2.0);
    };

    ringCycle();
    intervalId = setInterval(ringCycle, 4000);

    return () => {
      ringing = false;
      if (intervalId) clearInterval(intervalId);
    };
  } catch (e) {
    console.error("Audio ringtone error:", e);
    return () => {};
  }
}

export function playEmergencySiren(): () => void {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    gain.gain.value = 0.3;

    // Siren sweep
    let now = ctx.currentTime;
    for (let i = 0; i < 30; i++) {
      osc.frequency.setValueAtTime(700, now + i * 0.8);
      osc.frequency.linearRampToValueAtTime(1200, now + i * 0.8 + 0.4);
      osc.frequency.linearRampToValueAtTime(700, now + i * 0.8 + 0.8);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    return () => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (err) {}
    };
  } catch (e) {
    console.error("Siren audio error:", e);
    return () => {};
  }
}
