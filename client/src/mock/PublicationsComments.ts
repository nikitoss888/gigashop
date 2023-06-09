import Comment from "./Comment";
import { Publication } from "./Publications";

export type PublicationComment = Comment & {
	publicationId: number;
	publication?: Publication;
};

const PublicationsComments: PublicationComment[] = [
	{
		id: 1,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		publicationId: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
		hide: false,
		violation: true,
		violation_reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		rate: 5,
	},
	{
		id: 2,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		publicationId: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
		hide: false,
		violation: false,
		rate: 4,
	},
	{
		id: 3,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		publicationId: 1,
		createdAt: new Date(),
		updatedAt: new Date(),
		hide: false,
		violation: false,
		rate: 3,
	},
	{
		id: 4,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		publicationId: 2,
		createdAt: new Date(),
		hide: false,
		violation: false,
		rate: 2,
	},
	{
		id: 5,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		publicationId: 2,
		createdAt: new Date(),
		hide: false,
		violation: false,
		rate: 1,
	},
	{
		id: 6,
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		publicationId: 2,
		createdAt: new Date(),
		hide: false,
		violation: false,
		rate: 5,
	},
];
export default PublicationsComments;
