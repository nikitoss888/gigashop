import { Item, ItemBought } from "../../http/Items";
import { Divider, List } from "@mui/material";
import ItemsListItem from "./ItemsListItem";
import Typography from "@mui/material/Typography";

type ListProps = {
	items: ((Item & { item_bought: ItemBought }) | null)[];
};
export default function BoughtItemsList({ items }: ListProps) {
	return (
		<List
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				gap: "10px",
			}}
		>
			{items.map((item, index) => {
				if (!item) return null;
				return (
					<>
						<ItemsListItem item={item} key={item.id.toString(16)} />
						{item.item_bought && (
							<Typography variant='body1' sx={{ color: "primary.main" }}>
								Придбано: {new Date(item.item_bought.createdAt).toLocaleDateString()}
							</Typography>
						)}
						{index < items.length - 1 && <Divider sx={{ borderColor: "primary.main" }} />}
					</>
				);
			})}
		</List>
	);
}
