import { User } from "./Users";

type Comment = {
	id: number;
	userId: number;
	text: string;
	date: Date;
	rate: number;
	user?: User;
};

export default Comment;
