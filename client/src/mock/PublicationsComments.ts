import Comment from "./Comment";

export type PublicationComment = Comment & {
	publicationId: number;
};

const PublicationsComments: PublicationComment[] = [
	{
		id: 1,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		publicationId: 1,
		date: new Date(),
		rate: 5,
	},
	{
		id: 2,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		publicationId: 1,
		date: new Date(),
		rate: 4,
	},
	{
		id: 3,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		publicationId: 1,
		date: new Date(),
		rate: 3,
	},
	{
		id: 4,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		publicationId: 2,
		date: new Date(),
		rate: 2,
	},
	{
		id: 5,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		publicationId: 2,
		date: new Date(),
		rate: 1,
	},
	{
		id: 6,
		text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		publicationId: 2,
		date: new Date(),
		rate: 5,
	},
];
export default PublicationsComments;
