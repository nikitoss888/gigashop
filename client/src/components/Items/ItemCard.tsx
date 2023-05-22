import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";
import styled from "@emotion/styled";

const CardStyle = styled(Card)`
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
	display: flex;
	flex-direction: column;
	justify-content: start;
`;

const ContentStyle = styled(CardContent)`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
`;

const ContentBottom = styled(Box)`
	margin-top: auto;
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
			<CardMedia
				component='img'
				image={image}
				alt={name}
				sx={{ aspectRatio: "16/9", objectPosition: "center top", height: { xs: 200, md: 140 } }}
			/>
			<ContentStyle sx={{ gap: { xs: 0, sm: "15px" } }}>
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
						{date.toLocaleDateString()}
					</Typography>
				</ContentBottom>
			</ContentStyle>
		</CardStyle>
	);
}