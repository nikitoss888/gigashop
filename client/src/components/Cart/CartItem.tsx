import { calculateDiscount, Item } from "../../mock/Items";
import { Box, IconButton, ListItem, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";

type CartItemProps = {
	item: Item;
	deleteItem: (id: number) => void;
};
export default function CartItem({ item, deleteItem }: CartItemProps) {
	const { isDiscount, finalPrice } = calculateDiscount(item);
	return (
		<ListItem
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "space-between",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					alignItems: "stretch",
				}}
			>
				<Typography variant='h6'>{item.name}</Typography>
				<Typography
					variant='body2'
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
				<Typography
					variant='body1'
					sx={{
						textDecoration: isDiscount ? "line-through" : "none",
					}}
				>
					{item.price} грн
				</Typography>
				{isDiscount && (
					<Typography
						variant='body1'
						sx={{
							color: "accent.main",
						}}
					>
						{finalPrice} грн
					</Typography>
				)}
			</Box>
			<IconButton onClick={() => deleteItem(item.id)}>
				<Close sx={{ color: "primary.main" }} />
			</IconButton>
		</ListItem>
	);
}
