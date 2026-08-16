import fs from 'fs';

const songsFile = './src/data/songs.ts';
let content = fs.readFileSync(songsFile, 'utf8');

content = content.replace(
  /\{\s*"id":\s*(\d+),[\s\S]*?"youtubeId":\s*"([^"]+)"[\s\S]*?\}/g,
  (match) => {
    const ytMatch = match.match(/"youtubeId":\s*"([^"]+)"/);
    if (ytMatch) {
      const ytId = ytMatch[1];
      return match.replace(
        /"artwork":\s*"[^"]*"/,
        `"artwork": "https://img.youtube.com/vi/${ytId}/hqdefault.jpg"`
      );
    }
    return match;
  }
);

fs.writeFileSync(songsFile, content, 'utf8');
console.log('Successfully updated songs.ts with YouTube thumbnail artworks');
