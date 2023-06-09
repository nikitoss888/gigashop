import { Item } from "./Items";
import { User } from "./Users";

export type ItemCart = {
	id: number;
	itemId: number;
	userId: number;
	item?: Item;
	user?: User;
};

const ItemCarts: ItemCart[] = [
	{
		id: 1,
		itemId: 1,
		userId: 1,
	},
	{
		id: 2,
		itemId: 2,
		userId: 1,
	},
	{
		id: 3,
		itemId: 3,
		userId: 1,
	},
	{
		id: 4,
		itemId: 1,
		userId: 2,
	},
	{
		id: 5,
		itemId: 2,
		userId: 2,
	},
];
export default ItemCarts;
