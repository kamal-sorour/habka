export interface ActorProfile {
  name: string;
  slug: string;
  avatar: string;
  role: "Actor" | "Actress" | "Director";
  notableWorks: string[];
  bio: string;
  birthYear?: string;
  nationality?: string;
  awardsCount?: string;
}

export const FEATURED_ACTORS: ActorProfile[] = [
  {
    name: "Ryan Reynolds",
    slug: "ryan-reynolds",
    avatar: "https://m.media-amazon.com/images/M/MV5BOTI3ODExODE5Ml5BMl5BanBnXkFtZTcwODc5NDkyNw@@._V1_FMjpg_UX1000_.jpg",
    role: "Actor",
    notableWorks: ["Deadpool", "Free Guy", "Red Notice", "The Adam Project"],
    bio: "Canadian-American actor and producer known for his razor-sharp wit, charismatic comic timing, and iconic portrayal of Wade Wilson in Marvel's Deadpool franchise.",
    birthYear: "1976",
    nationality: "Canadian / American",
    awardsCount: "15+ Wins & Nominations",
  },
  {
    name: "Cillian Murphy",
    slug: "cillian-murphy",
    avatar: "https://m.media-amazon.com/images/M/MV5BMTAxNDExIOEtMDM2Ni00Y2I1LTk1OWUtMWQ0ODdiMTA1NmFiXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    role: "Actor",
    notableWorks: ["Oppenheimer", "Peaky Blinders", "Inception", "Dunkirk"],
    bio: "Academy Award-winning Irish actor renowned for his transformative, intense performances in collaborations with Christopher Nolan and BBC's Peaky Blinders.",
    birthYear: "1976",
    nationality: "Irish",
    awardsCount: "Academy Award Winner (Best Actor)",
  },
  {
    name: "Leonardo DiCaprio",
    slug: "leonardo-dicaprio",
    avatar: "https://m.media-amazon.com/images/M/MV5BMjI0MTg3MzI0M15BMl5BanBnXkFtZTcwMzQyODU2Mw@@._V1_FMjpg_UX1000_.jpg",
    role: "Actor",
    notableWorks: ["Inception", "Titanic", "The Wolf of Wall Street", "The Revenant"],
    bio: "One of the most acclaimed actors of his generation, known for daring character choices across blockbuster and auteur cinema with Martin Scorsese and Christopher Nolan.",
    birthYear: "1974",
    nationality: "American",
    awardsCount: "Academy Award Winner",
  },
  {
    name: "Scarlett Johansson",
    slug: "scarlett-johansson",
    avatar: "https://m.media-amazon.com/images/M/MV5BMTM3OTUwMDYwNl5BMl5BanBnXkFtZTcwNTUyNzc3Nw@@._V1_FMjpg_UX1000_.jpg",
    role: "Actress",
    notableWorks: ["Avengers", "Black Widow", "Her", "Marriage Story", "Lucy"],
    bio: "Two-time Academy Award-nominated actress and one of the highest-grossing box office stars in cinematic history, celebrated for her versatility in Marvel and dramatic cinema.",
    birthYear: "1984",
    nationality: "American",
    awardsCount: "BAFTA Winner & 2x Oscar Nominee",
  },
  {
    name: "Keanu Reeves",
    slug: "keanu-reeves",
    avatar: "https://m.media-amazon.com/images/M/MV5BYWZhNWExNmUtN2Q1Yi00NjVmLTkxOWQtMWIxMDk2MTBhMmQyXkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    role: "Actor",
    notableWorks: ["The Matrix", "John Wick", "Constantine", "Speed"],
    bio: "Global action cinema icon famous for groundbreaking physical performances in The Matrix trilogy and the genre-defining John Wick series.",
    birthYear: "1964",
    nationality: "Canadian",
    awardsCount: "Legendary Icon Award",
  },
  {
    name: "Christopher Nolan",
    slug: "christopher-nolan",
    avatar: "https://m.media-amazon.com/images/M/MV5BNjE3NDQyOTYyMV5BMl5BanBnXkFtZTcwODUwNLk2Mw@@._V1_FMjpg_UX1000_.jpg",
    role: "Director",
    notableWorks: ["Oppenheimer", "Interstellar", "The Dark Knight", "Inception"],
    bio: "Visionary filmmaker renowned for non-linear storytelling, practical cinematic scale, and redefining modern epic blockbuster cinema.",
    birthYear: "1970",
    nationality: "British / American",
    awardsCount: "2x Academy Award Winner",
  },
  {
    name: "Margot Robbie",
    slug: "margot-robbie",
    avatar: "https://m.media-amazon.com/images/M/MV5BMTgxNDcwMzU2Nl5BMl5BanBnXkFtZTcwNDc4NzkzOQ@@._V1_FMjpg_UX1000_.jpg",
    role: "Actress",
    notableWorks: ["Barbie", "The Wolf of Wall Street", "Suicide Squad", "Babylon"],
    bio: "Powerhouse producer and actress, celebrated for iconic performances in Barbie, Harley Quinn, and critically acclaimed prestige films.",
    birthYear: "1990",
    nationality: "Australian",
    awardsCount: "3x Academy Award Nominee",
  },
  {
    name: "Tom Cruise",
    slug: "tom-cruise",
    avatar: "https://m.media-amazon.com/images/M/MV5BMTk1MjM3NTU5M15BMl5BanBnXkFtZTcwMTMyMjE1Nw@@._V1_FMjpg_UX1000_.jpg",
    role: "Actor",
    notableWorks: ["Top Gun: Maverick", "Mission: Impossible", "Edge of Tomorrow"],
    bio: "The ultimate movie star, known for unparalleled dedication to practical stunts, theatrical cinematic preservation, and worldwide blockbusters.",
    birthYear: "1962",
    nationality: "American",
    awardsCount: "Honourary Palme d'Or",
  },
];

export function getActorBySlug(slug: string): ActorProfile | undefined {
  const decoded = decodeURIComponent(slug).toLowerCase().replace(/\s+/g, "-");
  return FEATURED_ACTORS.find((a) => a.slug === decoded || a.name.toLowerCase().replace(/\s+/g, "-") === decoded);
}

export function formatActorSlug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
