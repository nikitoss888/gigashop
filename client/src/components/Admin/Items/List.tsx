import { List as MuiList, Box } from "@mui/material";
import ListItem from "./ListItem";
import { Item } from "../../../http/Items";
import ItemsTopBox from "../../Items/ItemsTopBox";
import Pagination from "../../Common/Pagination";
import NotFoundBox from "../../CardsGrid/NotFoundBox";

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
				{items && items.length > 0 ? (
					items.map((item) => <ListItem key={item.id.toString(16)} item={item} onDelete={onDelete} />)
				) : (
					<NotFoundBox text='Товари не знайдено' />
				)}
			</MuiList>
			{items && items.length > 0 && <Pagination data={pagination} />}
		</Box>
	);
}
