import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const audioDir = path.join(__dirname, '..', 'public', 'audio');
const imagesDir = path.join(__dirname, '..', 'public', 'images');

if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

function generateWav(filename, durationSec, melodyNotes) {
  const sampleRate = 22050;
  const numChannels = 1;
  const bitsPerSample = 16;
  const numSamples = Math.floor(sampleRate * durationSec);
  const dataSize = numSamples * numChannels * (bitsPerSample / 8);
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
  buffer.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  const noteDuration = durationSec / melodyNotes.length;

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const noteIndex = Math.floor(t / noteDuration) % melodyNotes.length;
    const freq = melodyNotes[noteIndex];
    
    // Envelope (Attack & Decay)
    const noteTime = t % noteDuration;
    let env = 1.0;
    if (noteTime < 0.05) env = noteTime / 0.05;
    else if (noteTime > noteDuration - 0.05) env = (noteDuration - noteTime) / 0.05;

    // Soft warm synth voice with harmonic overtone & subtle vibrato
    const vibrato = 1 + 0.005 * Math.sin(2 * Math.PI * 5 * t);
    const primary = Math.sin(2 * Math.PI * freq * vibrato * t);
    const harmonic = 0.3 * Math.sin(2 * Math.PI * freq * 2 * vibrato * t);
    const sub = 0.2 * Math.sin(2 * Math.PI * (freq / 2) * t);

    // Soft tanpura drone hum background
    const drone = 0.15 * (Math.sin(2 * Math.PI * 146.83 * t) + Math.sin(2 * Math.PI * 220.00 * t));

    const sampleVal = (primary + harmonic + sub + drone) * env * 0.35;
    const intVal = Math.max(-32768, Math.min(32767, Math.floor(sampleVal * 32767)));
    buffer.writeInt16LE(intVal, offset);
    offset += 2;
  }

  const filePath = path.join(audioDir, filename);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated audio file: ${filePath}`);
}

// Melody frequencies for 4 songs (Indian classical / vintage scales)
const song1Notes = [261.63, 277.18, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25, 466.16, 415.30, 392.00, 349.23];
const song2Notes = [293.66, 329.63, 369.99, 440.00, 493.88, 554.37, 493.88, 440.00, 369.99, 329.63];
const song3Notes = [329.63, 392.00, 440.00, 523.25, 587.33, 523.25, 440.00, 392.00, 329.63, 293.66];
const song4Notes = [220.00, 261.63, 293.66, 329.63, 349.23, 329.63, 293.66, 261.63, 220.00, 196.00];

generateWav('song-1.mp3', 25, song1Notes);
generateWav('song-2.mp3', 20, song2Notes);
generateWav('song-3.mp3', 22, song3Notes);
generateWav('song-4.mp3', 18, song4Notes);

// SVG album covers in public/images/
function generateSVGArtwork(filename, title, artist, color1, color2) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <radialGradient id="grad-${filename.replace('.', '_')}" cx="50%" cy="50%" r="70%">
      <stop offset="0%" stop-color="${color1}" />
      <stop offset="100%" stop-color="${color2}" />
    </radialGradient>
  </defs>
  <rect width="300" height="300" fill="url(#grad-${filename.replace('.', '_')})" />
  <circle cx="150" cy="150" r="120" fill="none" stroke="#F1D7A3" stroke-opacity="0.2" stroke-width="1.5" />
  <circle cx="150" cy="150" r="90" fill="none" stroke="#F1D7A3" stroke-opacity="0.15" stroke-width="1" />
  <circle cx="150" cy="150" r="60" fill="#140b07" stroke="#E5AD54" stroke-opacity="0.4" stroke-width="2" />
  <circle cx="150" cy="150" r="18" fill="#B9472F" />
  <circle cx="150" cy="150" r="5" fill="#F1D7A3" />
  <text x="150" y="45" text-anchor="middle" fill="#F1D7A3" font-family="serif" font-size="16" font-weight="bold" letter-spacing="1">${title}</text>
  <text x="150" y="270" text-anchor="middle" fill="#E5AD54" font-family="sans-serif" font-size="12" letter-spacing="0.5">${artist}</text>
</svg>`;
  fs.writeFileSync(path.join(imagesDir, filename), svg);
  console.log(`Generated SVG artwork: ${filename}`);
}

generateSVGArtwork('song-1.jpg', 'Lag Jaa Gale', 'Lata Mangeshkar', '#4A2511', '#140B07');
generateSVGArtwork('song-2.jpg', 'Aap Ki Nazron', 'Lata Mangeshkar', '#3B1A24', '#140B07');
generateSVGArtwork('song-3.jpg', 'Pal Pal Dil Ke', 'Kishore Kumar', '#1B3022', '#0C1710');
generateSVGArtwork('song-4.jpg', 'Abhi Na Jao', 'Mohammed Rafi', '#2C1D3B', '#0E0915');
