import { User } from "./Users";
import { Item } from "./Items";

export type Wishlist = {
	id: number;
	userId: number;
	itemId: number;
	item?: Item;
	user?: User;
};

const Wishlists: Wishlist[] = [
	{
		id: 1,
		userId: 1,
		itemId: 1,
	},
	{
		id: 2,
		userId: 1,
		itemId: 2,
	},
	{
		id: 3,
		userId: 1,
		itemId: 3,
	},
];
export default Wishlists;
