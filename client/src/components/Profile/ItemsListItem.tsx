import { Item } from "../../http/Items";
import { ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

type ListItemProps = {
	item: Item;
};
export default function ItemsListItem({ item }: ListItemProps) {
	return (
		<ListItem
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
			}}
		>
			<Typography
				variant='h6'
				{...(!item.hide && {
					component: Link,
					to: `/shop/items/${item.id}`,
				})}
			>
				{item.name}
			</Typography>
			<Typography
				variant='body1'
				sx={{
					overflow: "hidden",
					display: "-webkit-box",
					lineClamp: 3,
					WebkitLineClamp: 3,
					WebkitBoxOrient: "vertical",
				}}
			>
				{item.description}
			</Typography>
		</ListItem>
	);
}
