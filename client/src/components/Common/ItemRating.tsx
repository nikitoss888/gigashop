import { ItemComment } from "../../mock/ItemsComments";
import { PublicationComment } from "../../mock/PublicationsComments";
import DataGroup from "./DataGroup";
import { Typography, Rating } from "@mui/material";
import { StarRate } from "@mui/icons-material";

type RateProps = {
	comments: (ItemComment | PublicationComment)[];
};
export default function ItemRating({ comments }: RateProps) {
	let avgRate = comments.reduce((acc, comment) => acc + comment.rate, 0) / comments.length;
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
