import { Divider, List } from "@mui/material";
import Comment from "../Common/Comment";
import { Link } from "react-router-dom";
import { ItemRate } from "../../mock/ItemsRates";
import Typography from "@mui/material/Typography";

type ItemsCartListProps = {
	rates: ItemRate[];
};
export default function ItemsRatesList({ rates }: ItemsCartListProps) {
	return (
		<List
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
				gap: "10px",
			}}
		>
			{rates.map((rate, index) => (
				<>
					<Link to={`/shop/items/${rate.itemId}`} style={{ textDecoration: "none" }}>
						<Comment comment={rate} key={rate.id.toString(16)} />
						{rate.violation && (
							<Typography variant='body1' color='error' mt={2}>
								Порушення: {rate.violation_reason}
								<br />
								Ця оцінка не враховується у середній оцінці товару.
							</Typography>
						)}
					</Link>
					{index < rates.length - 1 && <Divider sx={{ borderColor: "primary.main" }} />}
				</>
			))}
		</List>
	);
}
