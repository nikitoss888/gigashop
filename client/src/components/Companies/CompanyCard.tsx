import { Company } from "../../mock/Companies";
import Card from "../CardsGrid/Card";
import Link from "../CardsGrid/Link";
import Logo from "../CardsGrid/Logo";
import Content from "../CardsGrid/Content";
import Typography from "@mui/material/Typography";

type CardProps = {
	company: Company;
};
export default function CompanyCard({ company: { id, name, description, image, founded } }: CardProps) {
	return (
		<Card>
			<Link to={`/shop/companies/${id}`} onClick={(e) => e.stopPropagation()}>
				<Logo image={image} alt={name} />
				<Content sx={{ gap: { xs: 0, sm: "15px" } }}>
					<Typography gutterBottom variant='h6'>
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
					<Typography variant='body2' color='secondary'>
						{founded.toLocaleDateString()}
					</Typography>
				</Content>
			</Link>
		</Card>
	);
}
