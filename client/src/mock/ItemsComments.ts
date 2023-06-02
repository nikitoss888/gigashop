import Comment from "./Comment";

export type ItemComment = Comment & {
	itemId: number;
};

const ItemsComments: ItemComment[] = [
	{
		id: 1,
		itemId: 1,
		userId: 1,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		date: new Date(),
		rate: 5,
	},
	{
		id: 2,
		itemId: 1,
		userId: 2,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		date: new Date(),
		rate: 4,
	},
	{
		id: 3,
		itemId: 1,
		userId: 3,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl eu ultricies ultricies, nunc nunc ultricies nunc, vitae luctu",
		date: new Date(),
		rate: 2,
	},
];
export default ItemsComments;