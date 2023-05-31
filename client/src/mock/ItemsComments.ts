import { User } from "./Users";

export type ItemComment = {
	id: number;
	itemId: number;
	userId: number;
	text: string;
	date: string;
	rate: number;
	user?: User;
};

const ItemsComments: ItemComment[] = [
	{
		id: 1,
		itemId: 1,
		userId: 1,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		date: "2021-01-01",
		rate: 5,
	},
	{
		id: 2,
		itemId: 1,
		userId: 2,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		date: "2021-01-02",
		rate: 4,
	},
	{
		id: 3,
		itemId: 1,
		userId: 3,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		date: "2021-01-03",
		rate: 2,
	},
];
export default ItemsComments;
