export interface MichelinRestaurant {
  name: string;
  stars: 1 | 2 | 3;
  description: string;
  isNew?: boolean;
}

export const michelinRestaurants: MichelinRestaurant[] = [
  // Three Michelin Stars
  {
    name: "Alain Ducasse at The Dorchester",
    stars: 3,
    description: "Elegant and refined modern French cuisine"
  },
  {
    name: "CORE by Clare Smyth",
    stars: 3,
    description: "Contemporary British dishes with a focus on sustainable ingredients"
  },
  {
    name: "Hélène Darroze at The Connaught",
    stars: 3,
    description: "Creative and artistic modern French cooking"
  },
  {
    name: "The Ledbury",
    stars: 3,
    description: "Innovative and sophisticated modern British cuisine"
  },
  {
    name: "Restaurant Gordon Ramsay",
    stars: 3,
    description: "The celebrated chef's flagship restaurant offering modern French fare"
  },
  {
    name: "Sketch (The Lecture Room & Library)",
    stars: 3,
    description: "A unique dining experience with exquisite modern French cuisine in an artistic setting"
  },
  {
    name: "Ikoyi",
    stars: 3,
    description: "Innovative West African-inspired cuisine"
  },
  {
    name: "Restaurant Story",
    stars: 3,
    description: "A creative tasting menu experience telling a culinary narrative"
  },
  // Two Michelin Stars
  {
    name: "A. Wong",
    stars: 2,
    description: "Modern Chinese cuisine that pushes culinary boundaries"
  },
  {
    name: "Alex Dilling at Hotel Café Royal",
    stars: 2,
    description: "Refined and precise modern French cooking"
  },
  {
    name: "Brooklands by Claude Bosi",
    stars: 2,
    description: "Contemporary British cuisine with a French accent"
  },
  {
    name: "The Clove Club",
    stars: 2,
    description: "Innovative and ambitious modern British dishes"
  },
  {
    name: "Da Terra",
    stars: 2,
    description: "A creative and modern tasting menu experience"
  },
  {
    name: "Dinner by Heston Blumenthal",
    stars: 2,
    description: "A journey through British culinary history with a modern twist"
  },
  {
    name: "Gymkhana",
    stars: 2,
    description: "Acclaimed for its contemporary and classic Indian dishes"
  },
  {
    name: "Kitchen Table",
    stars: 2,
    description: "An intimate dining experience with a daily changing tasting menu"
  },
  {
    name: "La Dame de Pic London",
    stars: 2,
    description: "Elegant and creative modern French cuisine from chef Anne-Sophie Pic"
  },
  {
    name: "The Ritz Restaurant",
    stars: 2,
    description: "Classic French cuisine in an iconic and opulent setting"
  },
  {
    name: "Trivet",
    stars: 2,
    description: "A unique culinary experience with a focus on ingredients and a celebrated wine list"
  },
  {
    name: "Claude Bosi at Bibendum",
    stars: 2,
    description: "Modern French cuisine in the iconic Michelin House"
  },
  {
    name: "Humble Chicken",
    stars: 2,
    description: "A sophisticated take on yakitori with an omakase menu"
  },
  // One Michelin Star - New Additions 2025
  {
    name: "1890 by Gordon Ramsay",
    stars: 1,
    description: "A tribute to Georges Auguste Escoffier at The Savoy Hotel",
    isNew: true
  },
  {
    name: "Dorian",
    stars: 1,
    description: "A modern British bistro with a focus on seasonal produce",
    isNew: true
  },
  {
    name: "Humo",
    stars: 1,
    description: "A unique open-fire cooking concept",
    isNew: true
  },
  {
    name: "Mountain",
    stars: 1,
    description: "A Basque-inspired restaurant with a focus on live-fire cooking",
    isNew: true
  },
  {
    name: "Pavyllon London",
    stars: 1,
    description: "A modern and elegant take on French cuisine",
    isNew: true
  },
  {
    name: "Sushi Kanesaka",
    stars: 1,
    description: "An authentic and high-end omakase sushi experience",
    isNew: true
  },
  {
    name: "The Pem",
    stars: 1,
    description: "Modern British cuisine with a focus on female-led suppliers",
    isNew: true
  },
  {
    name: "Akoko",
    stars: 1,
    description: "Contemporary West African tasting menus",
    isNew: true
  },
  {
    name: "Chishuru",
    stars: 1,
    description: "Innovative and refined West African cuisine",
    isNew: true
  },
  // One Michelin Star - Retained
  {
    name: "Amaya",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Angler",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Behind",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Benares",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Brat",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Caractère",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Casa Fofō",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Chez Bruce",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "City Social",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Club Gascon",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Cycene",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "The Dining Room at The Goring",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Dysart Petersham",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Elystan Street",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Endo at the Rotunda",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Evelyn's Table",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "The Five Fields",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Frog by Adam Handling",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Galvin La Chapelle",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "The Harwood Arms",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "HIDE",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Jamavar",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Kai",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Kitchen W8",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "KOL",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "La Trompette",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Lyle's",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Luca",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Murano",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Muse by Tom Aikens",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "The Ninth",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Ormer Mayfair",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Pétrus by Gordon Ramsay",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Pied à Terre",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Pollen Street Social",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Portland",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Quilon",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "The River Café",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Sabor",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Seven Park Place",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "SO|LA",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Sollip",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "St. JOHN",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Taku",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Trinity",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Trishna",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Umu",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Veeraswamy",
    stars: 1,
    description: "High quality cooking, worth a stop"
  },
  {
    name: "Wild Honey St James",
    stars: 1,
    description: "High quality cooking, worth a stop"
  }
];
