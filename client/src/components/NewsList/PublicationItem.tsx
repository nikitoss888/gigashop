import { Publication } from "../../http/Publications";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";
import { Link } from "react-router-dom";
import Chip from "../Common/Chip";
import { User } from "../../http/User";

const MiniAvatarStyle = styled("img")`
	width: 30px;
	aspect-ratio: 1/1;
	border-radius: 50%;
`;

type PublicationProps = {
	publication: Publication & { AuthoredUser: User };
};
export default function PublicationItem({ publication }: PublicationProps) {
	const element = document.createElement("div");
	element.innerHTML = publication.content;
	const cleanContent = element.textContent || element.innerText || "";

	return (
		<Box
			component={Link}
			to={`/news/${publication.id}`}
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
				{publication.title}
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
			{publication.tags.length > 0 && (
				<Box
					sx={{
						display: "flex",
						justifyContent: "start",
						alignItems: "center",
						gap: "5px",
						marginTop: "10px",
					}}
				>
					{publication.tags.map((tag) => (
						<Chip
							key={`${publication.id.toString(16)}-${tag}}`}
							label={
								<Typography variant='body1' color='secondary'>
									{tag}
								</Typography>
							}
						/>
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
				<MiniAvatarStyle src={publication.AuthoredUser.image} alt={publication.AuthoredUser.login} />
				<Typography variant='body2' component='p' color='primary'>
					{publication.AuthoredUser.firstName} {publication.AuthoredUser.lastName}
					{`, ${new Date(publication.createdAt).toLocaleDateString()}`}
				</Typography>
			</Box>
		</Box>
	);
}
