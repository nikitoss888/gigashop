import { Publication } from "../../mock/Publications";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { Link } from "react-router-dom";
import Chip from "../Common/Chip";

const MiniAvatarStyle = styled("img")`
	width: 30px;
	aspect-ratio: 1/1;
	border-radius: 50%;
`;

type PublicationProps = {
	item: Publication;
};
export default function PublicationItem({ item }: PublicationProps) {
	const element = document.createElement("div");
	element.innerHTML = item.content;
	const cleanContent = element.textContent || element.innerText || "";

	return (
		<Box
			component={Link}
			to={`/news/${item.id}`}
			sx={{
				backgroundColor: "secondary.main",
				padding: "10px",
				borderRadius: "5px",
				textDecoration: "none",
				"&:hover": {
					textDecoration: "none",
				},
			}}
		>
			<Typography variant='h6' component='h2' color='primary'>
				{item.title}
			</Typography>
			<Typography
				variant='body1'
				color='primary'
				sx={{
					display: "-webkit-box",
					overflow: "hidden",
					textOverflow: "ellipsis",
					WebkitLineClamp: 3,
					WebkitBoxOrient: "vertical",
				}}
			>
				{cleanContent}
			</Typography>
			{item.tags && item.tags.length > 0 && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "start",
						alignItems: "center",
						gap: "5px",
						marginTop: "10px",
					}}
				>
					{item.tags?.map((tag) => (
						<Chip key={`${item.id.toString(16)}-${tag}}`} label={tag} />
					))}
				</Box>
			)}
			<Box
				sx={{
					display: "flex",
					justifyContent: "start",
					alignItems: "center",
					gap: "10px",
					marginTop: "10px",
				}}
			>
				<MiniAvatarStyle src={item.user?.avatar} alt={item.user?.login} />
				<Typography variant='body2' component='p' color='primary'>
					{item.user?.firstName} {item.user?.lastName}
					{item.createdAt ? `, ${item.createdAt.toLocaleDateString()}` : ""}
				</Typography>
			</Box>
		</Box>
	);
}
