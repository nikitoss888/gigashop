export type Genre = {
	id: number;
	name: string;
	description?: string;
	items: number[];
};

const Genres: Genre[] = [
	{
		id: 1,
		name: "Action",
		description: "Action games usually involve elements of physical conflict.",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 2,
		name: "RPG",
		description:
			"Role-playing games are a type of video game where the player controls the actions of a character (and/or several party members) immersed in some well-defined world.",
		items: [1, 4],
	},
	{
		id: 3,
		name: "Adventure",
		items: [2, 3],
	},
	{
		id: 4,
		name: "Open World",
		items: [2, 3, 4],
	},
	{
		id: 5,
		name: "Shooter",
		items: [1],
	},
	{
		id: 6,
		name: "Third Person",
		items: [1, 2, 3, 4],
	},
	{
		id: 7,
		name: "First Person",
		items: [1],
	},
	{
		id: 8,
		name: "Singleplayer",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 9,
		name: "Aaab",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 10,
		name: "Aaac",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 11,
		name: "Aaad",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 12,
		name: "Aaae",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 13,
		name: "Abaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 14,
		name: "Abac",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 15,
		name: "Baaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 16,
		name: "Baac",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 17,
		name: "Bbaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 18,
		name: "Caaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 19,
		name: "Caab",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 20,
		name: "Caba",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 21,
		name: "Ccaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 22,
		name: "Daaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 23,
		name: "Daba",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 24,
		name: "Daca",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 25,
		name: "Ddaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 26,
		name: "Ddab",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 27,
		name: "Oooo",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 28,
		name: "Ooop",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 29,
		name: "Opaa",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 30,
		name: "Opoo",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 31,
		name: "Open Worlc",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 32,
		name: "Open Worle",
		items: [1, 2, 3, 4, 5],
	},
];

export default Genres;
