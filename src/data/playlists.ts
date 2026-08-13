export interface Playlist {
  id: string;
  title: string;
  description: string;
  artwork: string;
  category: string;
  songIds: number[];
}

export const playlists: Playlist[] = [
  {
    id: "90s-memories",
    title: "90s Memories",
    description: "Songs that take you back to simpler days of cassettes and radios.",
    artwork: "/images/song-1.jpg",
    category: "90s",
    songIds: [5, 6, 8]
  },
  {
    id: "80s-classics",
    title: "80s Classics",
    description: "Golden melodies and timeless anthems from the iconic 1980s.",
    artwork: "/images/song-2.jpg",
    category: "80s",
    songIds: [11, 15, 16]
  },
  {
    id: "bollywood-love",
    title: "Bollywood Love",
    description: "Romantic nostalgic melodies that defined generations of love stories.",
    artwork: "/images/song-3.jpg",
    category: "LOVE",
    songIds: [1, 2, 3, 4, 5, 6, 8, 10, 12]
  },
  {
    id: "childhood",
    title: "Childhood",
    description: "Warm tunes and TV theme songs associated with sweet childhood memories.",
    artwork: "/images/song-4.jpg",
    category: "CHILDHOOD",
    songIds: [11, 16]
  },
  {
    id: "evening-chai",
    title: "Evening Chai",
    description: "Relaxed, soothing acoustic and ghazal songs for a quiet sunset tea time.",
    artwork: "/images/song-1.jpg",
    category: "EVENING",
    songIds: [1, 3, 4, 9, 10, 12, 14]
  },
  {
    id: "monsoon-memories",
    title: "Monsoon Memories",
    description: "Earthy, rain-soaked melodies evoking damp soil and fresh monsoon breeze.",
    artwork: "/images/song-2.jpg",
    category: "MONSOON",
    songIds: [7, 13]
  },
  {
    id: "sad-memories",
    title: "Sad Memories",
    description: "Deeply emotional and melancholic classics for quiet introspection.",
    artwork: "/images/song-3.jpg",
    category: "SAD",
    songIds: [1, 9, 12, 15]
  },
  {
    id: "roadside-radio",
    title: "Roadside Radio",
    description: "Songs that feel like tuning into an old transistor radio on a long journey.",
    artwork: "/images/song-4.jpg",
    category: "ROADSIDE",
    songIds: [3, 4, 10, 14]
  }
];
