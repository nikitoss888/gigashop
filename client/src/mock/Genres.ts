export type Genre = {
	id: number;
	name: string;
	items?: number[];
};

const Genres: Genre[] = [
	{
		id: 1,
		name: "Action",
		items: [1, 2, 3, 4, 5],
	},
	{
		id: 2,
		name: "RPG",
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
];

export default Genres;
