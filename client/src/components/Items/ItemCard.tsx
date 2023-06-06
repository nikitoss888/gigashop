import { Typography, Box } from "@mui/material";
import styled from "@mui/material/styles/styled";
import { Item } from "../../mock/Items";
import Link from "../CardsGrid/Link";
import Card from "../CardsGrid/Card";
import Media from "../CardsGrid/Media";
import Content from "../CardsGrid/Content";

const ContentBottom = styled(Box)`
	margin-top: auto;
	display: flex;
	justify-content: space-between;
`;

type CardProps = {
	item: Item;
};
export default function ItemCard({ item: { id, name, price, releaseDate, mainImage, description } }: CardProps) {
	return (
		<Card>
			<Link to={`/shop/items/${id}`} onClick={(e) => e.stopPropagation()}>
				<Media image={mainImage} alt={name} />
				<Content sx={{ gap: { xs: 0, sm: "15px" } }}>
					<Typography gutterBottom variant='h6' component='div'>
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
						<Typography variant='body1' color='secondary'>
							{price} грн
						</Typography>
						<Typography variant='body1' color='secondary'>
							{releaseDate.toLocaleDateString()}
						</Typography>
					</ContentBottom>
				</Content>
			</Link>
		</Card>
	);
}
