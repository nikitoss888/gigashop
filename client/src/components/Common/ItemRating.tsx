import { ItemRate } from "../../http/Items";
import { Comment as PublicationComment } from "../../http/Publications";
import DataGroup from "./DataGroup";
import { Typography, Rating } from "@mui/material";
import { StarRate } from "@mui/icons-material";

type RateProps = {
	comments?: (ItemRate | PublicationComment)[];
};
export default function ItemRating({ comments }: RateProps) {
	let avgRate =
		comments && comments.length > 0
			? comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length
			: 0;
	avgRate = Math.round(avgRate * 10) / 10;

	return (
		<DataGroup title='Рейтинг'>
			{avgRate === 0 ? (
				<Typography variant='body1'>Не вказано</Typography>
			) : (
				<>
					<Rating
						name='total-rating'
						value={avgRate}
						readOnly
						precision={0.1}
						emptyIcon={<StarRate color='disabled' />}
						icon={<StarRate sx={{ color: "accent.main" }} />}
					/>
					<Typography variant='body1'>{avgRate}</Typography>
				</>
			)}
		</DataGroup>
	);
}
