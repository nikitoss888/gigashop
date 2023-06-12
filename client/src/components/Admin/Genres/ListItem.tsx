import { Box, IconButton, Tooltip } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Genre } from "../../../http/Genres";
import { Link } from "react-router-dom";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";

type ListItemProps = {
	genre: Genre;
	onDelete: (id: number) => void;
};
export default function ListItem({ genre, onDelete }: ListItemProps) {
	return (
		<Box
			sx={{
				display: "flex",
				justifyContent: "space-between",
				alignItems: "center",
			}}
		>
			<Typography
				variant='h6'
				component={Link}
				to={`/admin/genres/${genre.id}`}
				sx={{
					textDecoration: "none",
					color: "primary.main",
					"&:hover": {
						textDecoration: "underline",
					},
				}}
			>
				{genre.name}
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
				}}
			>
				<Tooltip title={`Відкрити жанр`}>
					<IconButton component={Link} to={`/admin/genres/${genre.id}`}>
						<RemoveRedEye sx={{ color: "primary.main" }} />
					</IconButton>
				</Tooltip>
				<Tooltip title={`Редагувати жанр`}>
					<IconButton component={Link} to={`/admin/genres/${genre.id}/edit`}>
						<Edit sx={{ color: "primary.main" }} />
					</IconButton>
				</Tooltip>
				<Tooltip title={`Видалити жанр`}>
					<IconButton onClick={() => onDelete(genre.id)}>
						<Delete color='error' />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	);
}
