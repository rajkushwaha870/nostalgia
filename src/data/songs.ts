export interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  audioUrl: string;
  duration: number; // Duration in seconds
}

export const songs: Song[] = [
  {
    id: 1,
    title: "Lag Jaa Gale Se Phir",
    artist: "Lata Mangeshkar",
    album: "Woh Kaun Thi? (1964)",
    artwork: "/images/song-1.jpg",
    audioUrl: "/audio/song-1.mp3",
    duration: 318
  },
  {
    id: 2,
    title: "Aap Ki Nazron Ne Samjha",
    artist: "Lata Mangeshkar",
    album: "Anpadh (1962)",
    artwork: "/images/song-2.jpg",
    audioUrl: "/audio/song-2.mp3",
    duration: 232
  },
  {
    id: 3,
    title: "Pal Pal Dil Ke Paas",
    artist: "Kishore Kumar",
    album: "Blackmail (1973)",
    artwork: "/images/song-3.jpg",
    audioUrl: "/audio/song-3.mp3",
    duration: 326
  },
  {
    id: 4,
    title: "Abhi Na Jao Chhod Kar",
    artist: "Mohammed Rafi",
    album: "Hum Dono (1961)",
    artwork: "/images/song-4.jpg",
    audioUrl: "/audio/song-4.mp3",
    duration: 255
  },
  {
    id: 5,
    title: "Pehla Nasha",
    artist: "Udit Narayan & Sadhana Sargam",
    album: "Jo Jeeta Wohi Sikandar (1992)",
    artwork: "/images/song-1.jpg",
    audioUrl: "/audio/song-1.mp3",
    duration: 290
  },
  {
    id: 6,
    title: "Tujhe Dekha To",
    artist: "Kumar Sanu & Lata Mangeshkar",
    album: "Dilwale Dulhania Le Jayenge (1995)",
    artwork: "/images/song-2.jpg",
    audioUrl: "/audio/song-2.mp3",
    duration: 304
  },
  {
    id: 7,
    title: "Rimjhim Gire Sawan",
    artist: "Kishore Kumar",
    album: "Manzil (1979)",
    artwork: "/images/song-3.jpg",
    audioUrl: "/audio/song-3.mp3",
    duration: 215
  },
  {
    id: 8,
    title: "Ek Ladki Ko Dekha",
    artist: "Kumar Sanu",
    album: "1942: A Love Story (1994)",
    artwork: "/images/song-4.jpg",
    audioUrl: "/audio/song-4.mp3",
    duration: 275
  },
  {
    id: 9,
    title: "Tere Bina Zindagi Se",
    artist: "Kishore Kumar & Lata Mangeshkar",
    album: "Aandhi (1975)",
    artwork: "/images/song-1.jpg",
    audioUrl: "/audio/song-1.mp3",
    duration: 350
  },
  {
    id: 10,
    title: "Chura Liya Hai Tumne",
    artist: "Asha Bhosle & Mohammed Rafi",
    album: "Yaadon Ki Baaraat (1973)",
    artwork: "/images/song-2.jpg",
    audioUrl: "/audio/song-2.mp3",
    duration: 288
  },
  {
    id: 11,
    title: "Malgudi Days Theme",
    artist: "L. Vaidyanathan",
    album: "Malgudi Days (1987)",
    artwork: "/images/song-3.jpg",
    audioUrl: "/audio/song-3.mp3",
    duration: 180
  },
  {
    id: 12,
    title: "Kabhie Kabhie Mere Dil Mein",
    artist: "Mukesh",
    album: "Kabhie Kabhie (1976)",
    artwork: "/images/song-4.jpg",
    audioUrl: "/audio/song-4.mp3",
    duration: 298
  },
  {
    id: 13,
    title: "Bheegi Bheegi Raaton Mein",
    artist: "Kishore Kumar & Lata Mangeshkar",
    album: "Ajnabee (1974)",
    artwork: "/images/song-1.jpg",
    audioUrl: "/audio/song-1.mp3",
    duration: 230
  },
  {
    id: 14,
    title: "Musafir Hoon Yaaro",
    artist: "Kishore Kumar",
    album: "Parichay (1972)",
    artwork: "/images/song-2.jpg",
    audioUrl: "/audio/song-2.mp3",
    duration: 282
  },
  {
    id: 15,
    title: "Chitthi Aai Hai",
    artist: "Pankaj Udhas",
    album: "Naam (1986)",
    artwork: "/images/song-3.jpg",
    audioUrl: "/audio/song-3.mp3",
    duration: 430
  },
  {
    id: 16,
    title: "Lakdi Ki Kathi",
    artist: "Gauri, Gurpreet & Vanita",
    album: "Masoom (1983)",
    artwork: "/images/song-4.jpg",
    audioUrl: "/audio/song-4.mp3",
    duration: 238
  }
];
