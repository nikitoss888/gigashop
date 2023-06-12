import { List as MuiList, Box } from "@mui/material";
import ListItem from "./ListItem";
import { Item } from "../../../http/Items";
import ItemsTopBox from "../../Items/ItemsTopBox";
import Pagination from "../../Common/Pagination";
import Typography from "@mui/material/Typography";

type ListProps = {
	items?: Item[];
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
export default function List({ items, onDelete, sorting, limitation, pagination }: ListProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
			}}
		>
			<ItemsTopBox sorting={sorting} limitation={limitation} />
			<Pagination data={pagination} />
			<MuiList>
				{items ? (
					items.map((item) => <ListItem key={item.id.toString(16)} item={item} onDelete={onDelete} />)
				) : (
					<Typography
						component='h6'
						variant='h6'
						sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary.main" }}
					>
						Предметів не знайдено
					</Typography>
				)}
			</MuiList>
			<Pagination data={pagination} />
		</Box>
	);
}
