import { Item } from "../../http/Items";
import { Divider, List } from "@mui/material";
import ItemsListItem from "./ItemsListItem";

type ListProps = {
	items: Item[];
};
export default function ItemsList({ items }: ListProps) {
	return (
		<List
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				gap: "10px",
			}}
		>
			{items.map((item, index) => (
				<>
					<ItemsListItem item={item} key={item.id.toString(16)} />
					{index < items.length - 1 && <Divider sx={{ borderColor: "primary.main" }} />}
				</>
			))}
		</List>
	);
}
