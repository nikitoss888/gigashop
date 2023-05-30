export type Company = {
	id: number;
	name: string;
	founded?: Date;
	director?: string;
	description?: string;
	developed?: number[];
	published?: number[];
	image?: string;
};

const Companies: Company[] = [
	{
		id: 1,
		name: "Ubisoft",
		description:
			"Ubisoft Entertainment SA is a French video game company headquartered in Montreuil with several development studios across the world.",
		developed: [1, 2],
		published: [3, 4, 5],
		image: "https://avatars.cloudflare.steamstatic.com/2b2486ae5a70d69c55f020ce8384d04646ddba4e_full.jpg",
		founded: new Date(1986, 3, 28),
		director: "Yves Guillemot",
	},
	{
		id: 2,
		name: "Rockstar Games",
		description:
			"Rockstar Games, Inc. is an American video game publisher based in New York City. The company was established in December 1998 as a subsidiary of Take-Two Interactive, using the assets Take-Two had previously acquired from BMG Interactive.",
		developed: [1, 2, 3, 4, 5],
		published: [1, 2, 3, 4, 5],
		image: "https://avatars.cloudflare.steamstatic.com/d83a1786f23929deb5f20326f128bbc13a9a1e85_full.jpg",
	},
	{
		id: 3,
		name: "CD Projekt",
		description:
			"CD Projekt S.A. is a Polish video game developer, publisher and distributor based in Warsaw, founded in May 1994 by Marcin Iwiński and Michał Kiciński. Iwiński and Kiciński were video game retailers before they founded the company.",
		developed: [1, 2, 3, 4, 5],
		published: [1, 2, 3, 4, 5],
		image: "https://avatars.cloudflare.steamstatic.com/4f1187c11ad41f8aa58b9109efd52c2f8bca9918_full.jpg",
	},
	{
		id: 4,
		name: "Bethesda Softworks",
		description:
			"Bethesda Softworks LLC is an American video game publisher based in Rockville, Maryland. The company was founded by Christopher Weaver in 1986 as a division of Media Technology Limited, and in 1999 became a subsidiary of ZeniMax Media.",
		developed: [1, 2, 3, 4, 5],
		published: [1, 2, 3, 4, 5],
		image: "https://avatars.cloudflare.steamstatic.com/94307444005acb73afbadda08f17eb5692376efb_full.jpg",
	},
	{
		id: 5,
		name: "Naughty Dog",
		description:
			"Naughty Dog, LLC is an American video game developer based in Santa Monica, California. Founded by Andy Gavin and Jason Rubin in 1984 as an independent developer, the studio was acquired by Sony Computer Entertainment in 2001.",
		developed: [1, 2, 3, 4, 5],
		published: [1, 2, 3, 4, 5],
		image: "https://avatars.cloudflare.steamstatic.com/40a85b52747a78b26e393e3f9e58f319194b1b33_full.jpg",
	},
];
export default Companies;
