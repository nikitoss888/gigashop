import { List as MuiList, Box } from "@mui/material";
import ListItem from "./ListItem";
import { Item } from "../../../mock/Items";
import ItemsTopBox from "../../Items/ItemsTopBox";
import Pagination from "../../Common/Pagination";

type ListProps = {
	items?: Item[];
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
export default function List({ items, sorting, limitation, pagination }: ListProps) {
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
				{items?.map((item) => (
					<ListItem key={item.id.toString(16)} item={item} />
				))}
			</MuiList>
			<Pagination data={pagination} />
		</Box>
	);
}
