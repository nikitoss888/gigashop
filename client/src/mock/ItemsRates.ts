import Comment from "./Comment";
import { Item } from "./Items";

export type ItemRate = Comment & {
	itemId: number;
	item?: Item;
};

const ItemsRates: ItemRate[] = [
	{
		id: 1,
		itemId: 1,
		userId: 1,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		createdAt: new Date(),
		updatedAt: new Date(),
		hide: false,
		violation: true,
		violation_reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		rate: 5,
	},
	{
		id: 2,
		itemId: 1,
		userId: 2,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		createdAt: new Date(),
		hide: false,
		violation: false,
		rate: 4,
	},
	{
		id: 3,
		itemId: 1,
		userId: 3,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		createdAt: new Date(),
		hide: false,
		violation: false,
		rate: 2,
	},
];
export default ItemsRates;
