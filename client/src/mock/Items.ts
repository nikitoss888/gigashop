import { ItemRate } from "./ItemsRates";
import { Company } from "./Companies";
import { Genre } from "./Genres";

export type Item = {
	id: number;
	name: string;
	description?: string;
	releaseDate: Date;
	price: number;
	amount: number;
	discount: boolean;
	discountFrom?: Date;
	discountTo?: Date;
	discountSize?: number;
	mainImage: string;
	images: string[];
	coverImage?: string;
	characteristics?: { [key: string]: string | number };
	hide: boolean;
	createdAt: Date;
	deletedAt?: Date;
	genresIds?: number[];
	developersIds?: number[];
	publisherId?: number;
	comments?: ItemRate[];
	genres?: Genre[];
	developers?: Company[];
	publisher?: Company;
};

const Items: Item[] = [
	{
		id: 1,
		name: "Cyberpunk 2077",
		price: 1000,
		releaseDate: new Date(2022, 1, 1),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		],
		coverImage: "https://images5.alphacoders.com/927/thumb-1920-927025.png",
		description:
			"Cyberpunk 2077 – комп'ютерна гра в жанрі Action/RPG, розроблена польською компанією CD Projekt RED.",
		genresIds: [1, 2, 3],
		developersIds: [1, 2],
		publisherId: 1,
		characteristics: {
			Платформа: "Steam",
			"Мінімальні вимоги":
				"Intel Core i5-3570K / AMD FX-8310, 8 GB RAM, NVIDIA GeForce GTX 780 / AMD Radeon RX 470, 70 GB HDD, Windows 7/8/10 64-bit",
			"Рекомендовані вимоги":
				"Intel Core i7-4790 / AMD Ryzen 3 3200G, 12 GB RAM, NVIDIA GeForce GTX 1060 / AMD Radeon R9 Fury, 70 GB HDD, Windows 10 64-bit",
		},
		amount: 123,
		discount: false,
		hide: false,
		createdAt: new Date(),
	},
	{
		id: 2,
		name: "Red Dead Redemption 2",
		price: 2000,
		releaseDate: new Date(2000, 1, 1),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1174180/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://i.redd.it/6c4pjx2vw8371.jpg",
			"https://images.pushsquare.com/13be55ee96f03/red-dead-redemption-2-how-to-quickly-open-the-map-guide-1.large.jpg",
			"https://vrscout.com/wp-content/uploads/2021/05/RDR2.jpeg",
		],
		coverImage: "https://images.hdqwalls.com/wallpapers/red-dead-redemption-2-mission-4k-lw.jpg",
		description:
			"Red Dead Redemption 2 — комп'ютерна гра в жанрі action-adventure з відкритим світом, розроблена Rockstar Studios.",
		amount: 0,
		genresIds: [2, 3],
		developersIds: [2, 3],
		publisherId: 2,
		discount: true,
		discountSize: 10,
		discountFrom: new Date(2000, 1, 1),
		discountTo: new Date(2023, 12, 1),
		hide: false,
		characteristics: {
			Платформа: "Steam",
			"Мінімальні вимоги":
				"Intel Core i5-3570K / AMD FX-8310, 8 GB RAM, NVIDIA GeForce GTX 780 / AMD Radeon RX 470, 70 GB HDD, Windows 7/8/10 64-bit",
			"Рекомендовані вимоги":
				"Intel Core i7-4790 / AMD Ryzen 3 3200G, 12 GB RAM, NVIDIA GeForce GTX 1060 / AMD Radeon R9 Fury, 70 GB HDD, Windows 10 64-bit",
		},
		createdAt: new Date(),
	},
	{
		id: 3,
		name: "Grand Theft Auto V",
		price: 3500,
		genresIds: [1, 2, 3],
		developersIds: [1, 2],
		publisherId: 2,
		releaseDate: new Date(2022, 1, 1),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/271590/capsule_616x353.jpg?t=1632933588",
		],
		discount: false,
		amount: 123,
		hide: false,
		createdAt: new Date(),
		description:
			"Grand Theft Auto V — мультиплатформна відеогра в жанрі action-adventure з відкритим світом, розроблена Rockstar North і видана Rockstar Games.",
	},
	{
		id: 4,
		name: "The Witcher 3: Wild Hunt",
		price: 4500,
		genresIds: [1, 2, 3],
		developersIds: [1, 2],
		publisherId: 1,
		releaseDate: new Date(2024, 1, 1),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/292030/capsule_616x353.jpg?t=1632933588",
		],
		discount: false,
		amount: 123,
		hide: false,
		createdAt: new Date(),
		description:
			"The Witcher 3: Wild Hunt — комп'ютерна гра в жанрі action/RPG, розроблена польською компанією CD Projekt RED.",
	},
	{
		id: 5,
		name: "Cyberpunk 2077",
		price: 1000,
		genresIds: [1, 2, 3],
		developersIds: [1, 2],
		publisherId: 1,
		releaseDate: new Date(2022, 1, 1),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		],
		discount: false,
		amount: 123,
		hide: false,
		createdAt: new Date(),
		description:
			"Cyberpunk 2077 – комп'ютерна гра в жанрі Action/RPG, розроблена польською компанією CD Projekt RED.",
	},
	{
		id: 6,
		name: "Cyberpunk 2078",
		price: 2000,
		genresIds: [1, 2, 3],
		developersIds: [1, 2],
		publisherId: 1,
		releaseDate: new Date(2010, 1, 1),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		],
		discount: false,
		amount: 123,
		hide: true,
		createdAt: new Date(),
		description:
			"Cyberpunk 2077 – комп'ютерна гра в жанрі Action/RPG, розроблена польською компанією CD Projekt RED.",
	},
	{
		id: 7,
		name: "Cyberpunk 2079",
		price: 3000,
		genresIds: [1, 2, 3],
		developersIds: [1, 2],
		publisherId: 1,
		releaseDate: new Date(2010, 1, 2),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		],
		discount: false,
		amount: 123,
		hide: false,
		createdAt: new Date(),
		description:
			"Cyberpunk 2077 – комп'ютерна гра в жанрі Action/RPG, розроблена польською компанією CD Projekt RED.",
	},
	{
		id: 8,
		name: "Cyberpunk 2080",
		price: 4000,
		genresIds: [1, 2, 3],
		developersIds: [1, 2],
		publisherId: 1,
		releaseDate: new Date(2010, 1, 3),
		mainImage: "https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		images: [
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
			"https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/capsule_616x353.jpg?t=1632933588",
		],
		discount: false,
		amount: 123,
		hide: false,
		createdAt: new Date(),
		description:
			"Cyberpunk 2077 – комп'ютерна гра в жанрі Action/RPG, розроблена польською компанією CD Projekt RED.",
	},
];

export const calculateDiscount = (item: Item) => {
	const date = new Date();
	let isDiscount = item.discount;
	if (item.discountFrom) isDiscount = date.getTime() >= item.discountFrom.getTime();
	if (item.discountTo) isDiscount = date.getTime() <= item.discountTo.getTime();

	const finalPrice =
		isDiscount && item.discountSize ? item.price - (item.price * item.discountSize) / 100 : item.price;
	return { isDiscount, finalPrice };
};

export default Items;
