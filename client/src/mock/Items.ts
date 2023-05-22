export type Item = {
	id: number;
	name: string;
	price: number;
	date: Date;
	image: string;
	description?: string;
	genres?: string[];
	developers?: string[];
	publisher?: string;
};

const Items: Item[] = [
	{
		id: 1,
		name: "Cyberpunk 2077",
		price: 1000,
		date: new Date(),
		image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		description:
			"Cyberpunk 2077 – комп'ютерна гра в жанрі Action/RPG, розроблена польською компанією CD Projekt RED.",
		genres: ["Action", "RPG"],
		developers: ["CD Projekt RED", "CD Projekt"],
		publisher: "CD Projekt RED",
	},
	{
		id: 2,
		name: "Red Dead Redemption 2",
		price: 1000,
		date: new Date(),
		image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg?t=1632933588",
		description:
			"Red Dead Redemption 2 — комп'ютерна гра в жанрі action-adventure з відкритим світом, розроблена Rockstar Studios.",
	},
	{
		id: 3,
		name: "Grand Theft Auto V",
		price: 1000,
		date: new Date(),
		image: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg?t=1632933588",
		description:
			"Grand Theft Auto V — мультиплатформна відеогра в жанрі action-adventure з відкритим світом, розроблена Rockstar North і видана Rockstar Games.",
	},
	{
		id: 4,
		name: "The Witcher 3: Wild Hunt",
		price: 1000,
		date: new Date(),
		image: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg?t=1632933588",
		description:
			"The Witcher 3: Wild Hunt — комп'ютерна гра в жанрі action/RPG, розроблена польською компанією CD Projekt RED.",
	},
	{
		id: 5,
		name: "Cyberpunk 2077",
		price: 1000,
		date: new Date(),
		image: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		description:
			"Cyberpunk 2077 – комп'ютерна гра в жанрі Action/RPG, розроблена польською компанією CD Projekt RED.",
	},
];

export default Items;
