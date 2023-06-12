import { List as MuiList, Box } from "@mui/material";
import ListItem from "./ListItem";
import { Publication } from "../../../http/Publications";
import NewsTopBox from "../../NewsList/NewsTopBox";
import Pagination from "../../Common/Pagination";
import { User } from "../../../http/User";
import Typography from "@mui/material/Typography";

type ListProps = {
	news?: (Publication & { AuthoredUser: User })[];
	onDelete: (id: number) => void;
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
export default function List({ news, sorting, limitation, pagination, onDelete }: ListProps) {
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
				{news ? (
					news.map((item) => <ListItem key={item.id.toString(16)} publication={item} onDelete={onDelete} />)
				) : (
					<Typography
						component='h6'
						variant='h6'
						sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
					>
						Публікацій не знайдено
					</Typography>
				)}
			</MuiList>
			<Pagination data={pagination} />
		</Box>
	);
}
