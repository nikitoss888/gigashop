import { ListItem } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import { Publication } from "../../http/Publications";

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
			<Typography
				variant='h6'
				{...(!publication.hide && {
					component: Link,
					to: `/shop/items/${publication.id}`,
				})}
			>
				{publication.title}
			</Typography>
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
