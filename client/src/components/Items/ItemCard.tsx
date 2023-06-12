import { Typography, Box } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { calculateDiscount, Item } from "../../http/Items";
import Link from "../CardsGrid/Link";
import Card from "../CardsGrid/Card";
import Media from "../CardsGrid/Media";
import Content from "../CardsGrid/Content";

const ContentBottom = styled(Box)`
	margin-top: auto;
	display: flex;
	justify-content: space-between;
	align-items: end;
`;

type CardProps = {
	item: Item;
};
export default function ItemCard({ item }: CardProps) {
	const { id, name, price, releaseDate, mainImage, description } = item;
	const { isDiscount, finalPrice } = calculateDiscount(item);
	return (
		<Card>
			<Link to={`/shop/items/${id}`} onClick={(e) => e.stopPropagation()}>
				<Media image={mainImage} alt={name} />
				<Content sx={{ gap: { xs: 0, sm: "15px" } }}>
					<Typography gutterBottom variant='h6' color='secondary'>
						{name}
					</Typography>
					<Typography
						variant='body2'
						color='secondary'
						sx={{
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: {
								xs: "none",
								sm: "-webkit-box",
							},
							WebkitLineClamp: 3,
							WebkitBoxOrient: "vertical",
						}}
					>
						{description}
					</Typography>
					<ContentBottom>
						<Box>
							<Typography
								variant='body1'
								color='secondary'
								sx={{
									textDecoration: isDiscount ? "line-through" : "none",
								}}
							>
								{price} грн
							</Typography>
							{isDiscount && (
								<Typography variant='body1' sx={{ color: "accent.main" }}>
									{finalPrice} грн
								</Typography>
							)}
						</Box>
						<Typography variant='body1' color='secondary'>
							{new Date(releaseDate).toLocaleDateString()}
						</Typography>
					</ContentBottom>
				</Content>
			</Link>
		</Card>
	);
}
