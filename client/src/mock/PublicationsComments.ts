import { User } from "./Users";

export type PublicationComment = {
	id: number;
	content: string;
	userId: number;
	publicationId: number;
	rate: number;
	user?: User;
};

const PublicationsComments: PublicationComment[] = [
	{
		id: 1,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		publicationId: 1,
		rate: 5,
	},
	{
		id: 2,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		publicationId: 1,
		rate: 4,
	},
	{
		id: 3,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		publicationId: 1,
		rate: 3,
	},
	{
		id: 4,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		publicationId: 2,
		rate: 2,
	},
	{
		id: 5,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		publicationId: 2,
		rate: 1,
	},
	{
		id: 6,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		publicationId: 2,
		rate: 5,
	},
];
export default PublicationsComments;
