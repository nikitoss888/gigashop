import { Box, IconButton, ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Publication } from "../../http/Publications";
import { Edit } from "@mui/icons-material";

type ListItemProps = {
	publication: Publication;
};
export default function ItemsListItem({ publication }: ListItemProps) {
	const element = document.createElement("div");
	element.innerHTML = publication.content;
	const cleanContent = element.textContent || element.innerText || "";

	return (
		<ListItem
			sx={{
				display: "flex",
				flexDirection: "column",
				alignItems: "stretch",
			}}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					alignItems: "center",
					gap: "10px",
				}}
			>
				<Typography
					variant='h6'
					{...(!publication.hide && {
						component: Link,
						to: `/shop/items/${publication.id}`,
					})}
				>
					{publication.title}
					{publication.hide && " (Сховано)"}
				</Typography>
				<IconButton component={Link} to={`/news/${publication.id}/edit`}>
					<Edit />
				</IconButton>
			</Box>
			{publication.violation && (
				<Typography variant='body1' color='error'>
					{publication.violation_reason}
				</Typography>
			)}
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
				{cleanContent}
			</Typography>
		</ListItem>
	);
}
