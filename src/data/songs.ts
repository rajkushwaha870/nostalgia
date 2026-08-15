export interface Song {
  id: number;
  title: string;
  artist: string;
  album?: string;
  artwork?: string;
  youtubeId: string;
  category: string;
  year?: number;
  duration?: string;
  playlistIds: string[];
}

export const songs: Song[] = [
  {
    id: 1,
    title: "Lag Jaa Gale Se Phir",
    artist: "Lata Mangeshkar",
    album: "Woh Kaun Thi?",
    artwork: "/images/song-1.svg",
    youtubeId: "qC5Kee24Z00",
    category: "bollywood-love",
    year: 1964,
    playlistIds: ["bollywood-love", "evening-chai", "sad-memories"]
  },
  {
    id: 2,
    title: "Aap Ki Nazron Ne Samjha",
    artist: "Lata Mangeshkar",
    album: "Anpadh",
    artwork: "/images/song-2.svg",
    youtubeId: "kYJv1c8_8-0",
    category: "bollywood-love",
    year: 1962,
    playlistIds: ["bollywood-love"]
  },
  {
    id: 3,
    title: "Pal Pal Dil Ke Paas",
    artist: "Kishore Kumar",
    album: "Blackmail",
    artwork: "/images/song-3.svg",
    youtubeId: "AMuRRXPvw-U",
    category: "70s",
    year: 1973,
    playlistIds: ["bollywood-love", "evening-chai", "roadside-radio"]
  },
  {
    id: 4,
    title: "Abhi Na Jao Chhod Kar",
    artist: "Mohammed Rafi",
    album: "Hum Dono",
    artwork: "/images/song-4.svg",
    youtubeId: "3JZ_D3ELwOQ",
    category: "60s",
    year: 1961,
    playlistIds: ["bollywood-love", "evening-chai", "roadside-radio"]
  },
  {
    id: 5,
    title: "Pehla Nasha",
    artist: "Udit Narayan & Sadhana Sargam",
    album: "Jo Jeeta Wohi Sikandar",
    artwork: "/images/song-1.svg",
    youtubeId: "9w9U0f2o46E",
    category: "90s",
    year: 1992,
    playlistIds: ["90s-memories", "bollywood-love"]
  },
  {
    id: 6,
    title: "Tujhe Dekha To",
    artist: "Kumar Sanu & Lata Mangeshkar",
    album: "Dilwale Dulhania Le Jayenge",
    artwork: "/images/song-2.svg",
    youtubeId: "5S91i6WnU9k",
    category: "90s",
    year: 1995,
    playlistIds: ["90s-memories", "bollywood-love"]
  },
  {
    id: 7,
    title: "Rimjhim Gire Sawan",
    artist: "Kishore Kumar",
    album: "Manzil",
    artwork: "/images/song-3.svg",
    youtubeId: "OqJ522t5U-E",
    category: "MONSOON",
    year: 1979,
    playlistIds: ["monsoon-memories"]
  },
  {
    id: 8,
    title: "Ek Ladki Ko Dekha",
    artist: "Kumar Sanu",
    album: "1942: A Love Story",
    artwork: "/images/song-4.svg",
    youtubeId: "9bZkp7q19f0",
    category: "90s",
    year: 1994,
    playlistIds: ["90s-memories", "bollywood-love"]
  },
  {
    id: 9,
    title: "Tere Bina Zindagi Se",
    artist: "Kishore Kumar & Lata Mangeshkar",
    album: "Aandhi",
    artwork: "/images/song-1.svg",
    youtubeId: "09R8_2nJtjg",
    category: "70s",
    year: 1975,
    playlistIds: ["evening-chai", "sad-memories"]
  },
  {
    id: 10,
    title: "Chura Liya Hai Tumne",
    artist: "Asha Bhosle & Mohammed Rafi",
    album: "Yaadon Ki Baaraat",
    artwork: "/images/song-2.svg",
    youtubeId: "9bZkp7q19f0",
    category: "70s",
    year: 1973,
    playlistIds: ["bollywood-love", "evening-chai", "roadside-radio"]
  },
  {
    id: 11,
    title: "Malgudi Days Theme",
    artist: "L. Vaidyanathan",
    album: "Malgudi Days",
    artwork: "/images/song-3.svg",
    youtubeId: "fJ9rUzIMcZQ",
    category: "CHILDHOOD",
    year: 1987,
    duration: "02:45",
    playlistIds: ["80s-classics", "childhood"]
  },
  {
    id: 12,
    title: "Kabhie Kabhie Mere Dil Mein",
    artist: "Mukesh",
    album: "Kabhie Kabhie",
    artwork: "/images/song-4.svg",
    youtubeId: "8mP5XnS0CIs",
    category: "70s",
    year: 1976,
    duration: "04:58",
    playlistIds: ["bollywood-love", "evening-chai", "sad-memories"]
  },
  {
    id: 13,
    title: "Bheegi Bheegi Raaton Mein",
    artist: "Kishore Kumar & Lata Mangeshkar",
    album: "Ajnabee",
    artwork: "/images/song-1.svg",
    youtubeId: "sU14PjH64u8",
    category: "MONSOON",
    year: 1974,
    duration: "04:05",
    playlistIds: ["monsoon-memories"]
  },
  {
    id: 14,
    title: "Musafir Hoon Yaaro",
    artist: "Kishore Kumar",
    album: "Parichay",
    artwork: "/images/song-2.svg",
    youtubeId: "AMuRRXPvw-U",
    category: "70s",
    year: 1972,
    duration: "04:40",
    playlistIds: ["evening-chai", "roadside-radio"]
  },
  {
    id: 15,
    title: "Chitthi Aai Hai",
    artist: "Pankaj Udhas",
    album: "Naam",
    artwork: "/images/song-3.svg",
    youtubeId: "kYJv1c8_8-0",
    category: "80s",
    year: 1986,
    duration: "05:48",
    playlistIds: ["80s-classics", "sad-memories"]
  },
  {
    id: 16,
    title: "Lakdi Ki Kathi",
    artist: "Gauri, Gurpreet & Vanita",
    album: "Masoom",
    artwork: "/images/song-4.svg",
    youtubeId: "dQw4w9WgXcQ",
    category: "CHILDHOOD",
    year: 1983,
    duration: "03:55",
    playlistIds: ["80s-classics", "childhood"]
  }
];

