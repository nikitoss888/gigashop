import { Item } from "./Items";
import { Publication } from "./Publications";
import { PublicationComment } from "./PublicationsComments";
import { ItemRate } from "./ItemsRates";

export type User = {
	id: number;
	login: string;
	email: string;
	firstName: string;
	lastName: string;
	image: string;
	role: string;
	isBlocked: boolean;
	createdAt: Date;
	cart?: Item[];
	wishlist?: Item[];
	publications?: Publication[];
	publicationsComments?: PublicationComment[];
	itemsRates?: ItemRate[];
};

const Users: User[] = [
	{
		id: 1,
		login: "admin",
		email: "admin@mail.com",
		firstName: "John",
		lastName: "Doe",
		image: "https://i.pravatar.cc/300?img=1",
		role: "admin",
		isBlocked: false,
		createdAt: new Date(),
	},
	{
		id: 2,
		login: "user1",
		email: "user1@mail.com",
		firstName: "Jane",
		lastName: "Doe",
		image: "https://i.pravatar.cc/300?img=2",
		role: "moderator",
		isBlocked: false,
		createdAt: new Date(),
	},
	{
		id: 3,
		login: "user2",
		email: "user2@mail.com",
		firstName: "Jack",
		lastName: "Doe",
		image: "https://i.pravatar.cc/300?img=3",
		role: "user",
		isBlocked: false,
		createdAt: new Date(),
	},
];
export default Users;
