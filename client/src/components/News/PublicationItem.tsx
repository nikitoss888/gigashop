import { Publication } from "../../mock/Publications";
import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@mui/material/styles/styled";

const MiniAvatarStyle = styled("img")`
	width: 30px;
	aspect-ratio: 1/1;
	border-radius: 50%;
`;

type PublicationProps = {
	item: Publication;
};
export default function PublicationItem({ item }: PublicationProps) {
	return (
		<Box
			sx={{
				backgroundColor: "secondary.main",
				padding: "10px",
				borderRadius: "5px",
			}}
		>
			<Typography variant='h6' component='h2' color='primary'>
				{item.title}
			</Typography>
			<Typography variant='body1' component='p' color='primary'>
				{item.content}
			</Typography>
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
