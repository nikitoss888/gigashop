import { User } from "./Users";

export type Publication = {
	id: number;
	title: string;
	content: string;
	userId: number;
	tags?: string[];
	user?: User;
	createdAt?: Date;
};

const Publications: Publication[] = [
	{
		id: 1,
		title: "News 1",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		tags: ["tag1", "tag2", "tag3"],
		createdAt: new Date(),
	},
	{
		id: 2,
		title: "News 2",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		tags: ["tag3", "tag4", "tag5"],
	},
	{
		id: 3,
		title: "News 3",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		tags: ["tag5", "tag6", "tag7"],
	},
	{
		id: 4,
		title: "News 4",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
	},
	{
		id: 5,
		title: "News 5",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
	},
	{
		id: 6,
		title: "News 6",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
	},
];
export default Publications;
