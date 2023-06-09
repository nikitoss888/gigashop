import { User } from "./Users";
import { PublicationComment } from "./PublicationsComments";

export type Publication = {
	id: number;
	title: string;
	content: string;
	userId: number;
	tags?: string[];
	user?: User;
	createdAt: Date;
	updatedAt?: Date;
	deletedAt?: Date;
	hide: boolean;
	violation: boolean;
	violation_reason?: string;
	comments?: PublicationComment[];
};

const Publications: Publication[] = [
	{
		id: 1,
		title: "NewsList 1",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		tags: ["tag1", "tag2", "tag3"],
		createdAt: new Date(),
		hide: false,
		violation: false,
		updatedAt: new Date(),
		violation_reason: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	},
	{
		id: 2,
		title: "NewsList 2",
		content:
			"<p>Lorem ipsum sagittis auctor ornare, donec amet ultricies congue nec sit, porttitor eget, bibendum tempus malesuada nibh, lectus quam. Sapien lorem ipsum maecenas non tellus vitae maecenas leo odio, eget. Quam integer, sem quisque ligula cursus gravida duis porta et non integer&nbsp;&mdash; a lorem. Non ultricies ligula duis, quisque sem nibh sapien enim porttitor, malesuada&nbsp;&mdash; eget, justo. Et magna pharetra elementum nec nulla sapien orci&nbsp;&mdash; duis sodales quam eros sodales tempus.</p><p>Nec porttitor pellentesque cursus nam molestie urna in, ornare leo sagittis. Nibh&nbsp;&mdash; mauris malesuada, sem commodo gravida magna leo ipsum vulputate ligula, integer auctor justo non.</p><p>Eget elementum ultricies, mauris vulputate donec, vitae orci, quisque, cursus massa urna&nbsp;&mdash; tellus mattis, risus at leo. Nec ornare justo at mauris auctor vulputate, malesuada massa quisque, vitae adipiscing orci integer proin donec elementum sagittis sodales eu sit lectus eget: enim urna. Curabitur sapien odio sodales mauris ipsum, porttitor ultricies risus sed enim, sed commodo risus. Metus quisque lorem integer maecenas tellus duis: leo congue, vivamus pharetra. Pellentesque risus odio risus orci massa: sem ipsum ornare sagittis donec ornare nulla justo commodo.</p><p>Ligula diam duis justo&nbsp;&mdash; porttitor, sem lorem ultricies vitae diam risus, vitae commodo elementum, ut amet orci pellentesque orci quam pharetra nibh gravida magna. Maecenas massa fusce, ut diam non a integer congue metus maecenas, eu ultricies non. Fusce morbi vitae proin nulla sit mattis quam tempus congue, enim bibendum nec in eget arcu adipiscing metus leo magna fusce donec ipsum. Massa morbi nibh curabitur fusce congue arcu sit metus, eget sit quam fusce, ultricies urna donec eros ipsum pharetra, tempus massa. Maecenas&nbsp;&mdash; tellus, mattis urna sagittis ut porttitor adipiscing eros gravida non eget curabitur enim elementum justo. Maecenas proin magna morbi pellentesque tellus integer, sit sem integer sem tempus diam, massa auctor in elementum magna porta. Curabitur nam morbi sagittis sapien quam in, quam eu nulla sodales et gravida sagittis urna rutrum quisque tellus sed duis fusce at nulla vitae rutrum. Magna commodo eu lectus justo gravida pellentesque, malesuada a donec rutrum molestie.</p><h4 id='conclusion'>Conclusion:</h4><p>Maecenas a molestie arcu sem sagittis magna tellus&nbsp;&mdash; justo odio elementum lectus sapien amet lorem eu quam elementum nec molestie, eu duis. Bibendum curabitur, nam risus sagittis proin sagittis vivamus sit: ornare curabitur porttitor eros ornare orci rutrum integer tellus in integer mauris cursus sed urna. Odio enim eget&nbsp;&mdash; orci molestie et sed eu donec, bibendum sit&nbsp;&mdash; sapien mauris cursus porta ligula eu proin elementum et odio sed. Enim orci leo nec duis sapien, fusce vulputate porta nec nulla, tellus. Donec in nibh leo odio mauris eu&nbsp;&mdash; at lorem ut pharetra sagittis curabitur&nbsp;&mdash; duis. Sed sit ligula sodales urna, massa odio justo adipiscing, vitae, diam justo malesuada, odio lectus magna bibendum eros curabitur sapien porttitor donec, congue.</p>",
		userId: 2,
		tags: ["tag3", "tag4", "tag5"],
		createdAt: new Date(2022, 1, 1),
		hide: false,
		violation: false,
	},
	{
		id: 3,
		title: "NewsList 3",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		tags: ["tag5", "tag6", "tag7"],
		createdAt: new Date(2022, 1, 2),
		hide: false,
		violation: false,
	},
	{
		id: 4,
		title: "NewsList 4",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 1,
		createdAt: new Date(2022, 1, 3),
		hide: false,
		violation: false,
	},
	{
		id: 5,
		title: "NewsList 5",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 2,
		createdAt: new Date(2022, 2, 1),
		hide: false,
		violation: false,
	},
	{
		id: 6,
		title: "NewsList 6",
		content:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod, nisl eget ultricies ultrices, nunc nisl aliquam nunc, nec aliquet nunc nisl nec nunc.",
		userId: 3,
		createdAt: new Date(2022, 3, 1),
		hide: false,
		violation: false,
	},
];
export default Publications;
