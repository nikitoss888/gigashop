import { Item } from "./Items";

export type Genre = {
	id: number;
	name: string;
	description?: string;
	items?: Item[];
	hide: boolean;
	createdAt: Date;
	deletedAt?: Date;
};

const Genres: Genre[] = [
	{
		id: 1,
		name: "Action",
		description: "Action games usually involve elements of physical conflict.",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 2,
		name: "RPG",
		description:
			"Role-playing games are a type of video game where the player controls the actions of a character (and/or several party members) immersed in some well-defined world.",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 3,
		name: "Adventure",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 4,
		name: "Open World",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 5,
		name: "Shooter",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 6,
		name: "Third Person",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 7,
		name: "First Person",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 8,
		name: "Singleplayer",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 9,
		name: "Aaab",
		createdAt: new Date(),
		hide: true,
	},
	{
		id: 10,
		name: "Aaac",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 11,
		name: "Aaad",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 12,
		name: "Aaae",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 13,
		name: "Abaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 14,
		name: "Abac",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 15,
		name: "Baaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 16,
		name: "Baac",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 17,
		name: "Bbaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 18,
		name: "Caaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 19,
		name: "Caab",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 20,
		name: "Caba",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 21,
		name: "Ccaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 22,
		name: "Daaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 23,
		name: "Daba",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 24,
		name: "Daca",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 25,
		name: "Ddaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 26,
		name: "Ddab",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 27,
		name: "Oooo",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 28,
		name: "Ooop",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 29,
		name: "Opaa",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 30,
		name: "Opoo",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 31,
		name: "Open Worlc",
		createdAt: new Date(),
		hide: false,
	},
	{
		id: 32,
		name: "Open Worle",
		createdAt: new Date(),
		hide: false,
	},
];

export default Genres;
