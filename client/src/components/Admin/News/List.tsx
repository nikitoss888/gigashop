import { List as MuiList, Box } from "@mui/material";
import ListItem from "./ListItem";
import { Publication } from "../../../mock/Publications";
import NewsTopBox from "../../NewsList/NewsTopBox";
import Pagination from "../../Common/Pagination";

type ListProps = {
	news?: Publication[];
	sorting: {
		value: string;
		setValue: (sortBy: string) => void;
	};
	limitation: {
		value: number;
		setValue: (limit: number) => void;
	};
	pagination: {
		value: number;
		setValue: (page: number) => void;
		maxValue: number;
	};
};
export default function List({ news, sorting, limitation, pagination }: ListProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<NewsTopBox sorting={sorting} limitation={limitation} />
			<Pagination data={pagination} />
			<MuiList>
				{news?.map((item) => (
					<ListItem key={item.id.toString(16)} publication={item} />
				))}
			</MuiList>
			<Pagination data={pagination} />
		</Box>
	);
}
