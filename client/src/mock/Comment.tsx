import { User } from "./Users";

type Comment = {
	id: number;
	userId: number;
	content: string;
	createdAt: Date;
	updatedAt?: Date;
	rate: number;
	hide: boolean;
	violation: boolean;
	violation_reason?: string;
	user?: User;
};

export default Comment;
