import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import styled from "@emotion/styled";

const CardStyle = styled(Card)`
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const ContentStyle = styled(CardContent)`
	display: flex;
	flex-direction: column;
	gap: 15px;
`;

const ContentBottom = styled(Box)`
	margin-bottom: auto;
	display: flex;
	justify-content: space-between;
`;

type CardProps = {
	item: {
		name: string;
		price: number;
		date: Date;
		image: string;
		description?: string;
	};
};
export default function ItemCard({ item: { name, price, date, image, description } }: CardProps) {
	return (
		<CardStyle>
			<CardMedia component='img' height='140' image={image} alt={name} />
			<ContentStyle>
				<Typography gutterBottom variant='h6' component='div'>
					{name}
				</Typography>
				<Typography
					variant='body2'
					color='secondary'
					sx={{
						overflow: "hidden",
						textOverflow: "ellipsis",
						display: "-webkit-box",
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
						{date.toLocaleDateString()}
					</Typography>
				</ContentBottom>
			</ContentStyle>
		</CardStyle>
	);
}
