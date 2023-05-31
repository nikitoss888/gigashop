export type User = {
	id: number;
	login: string;
	email: string;
	firstName: string;
	lastName: string;
	avatar: string;
};

const Users: User[] = [
	{
		id: 1,
		login: "admin",
		email: "admin@mail.com",
		firstName: "John",
		lastName: "Doe",
		avatar: "https://i.pravatar.cc/300?img=1",
	},
	{
		id: 2,
		login: "user1",
		email: "user1@mail.com",
		firstName: "Jane",
		lastName: "Doe",
		avatar: "https://i.pravatar.cc/300?img=2",
	},
	{
		id: 3,
		login: "user2",
		email: "user2@mail.com",
		firstName: "Jack",
		lastName: "Doe",
		avatar: "https://i.pravatar.cc/300?img=3",
	},
];
export default Users;
