import { Genre } from "../../mock/Genres";
import { Box, List, ListItem, ListItemButton } from "@mui/material";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";

type GroupProps = {
	genres: [string, Genre[]];
};
export default function GenresList({ genres: [char, genres] }: GroupProps) {
	return (
		<Box>
			<Typography variant='h5' sx={{ borderBottom: "2px solid", borderColor: "primary.main", px: "8px" }}>
				{char}:
			</Typography>
			<List>
				{genres.map((genre) => (
					<ListItem key={genre.id.toString(16)} disablePadding>
						<ListItemButton component={Link} to={`/shop/genres/${genre.id}`} sx={{ padding: "2px 16px" }}>
							<Typography variant='body1'>{genre.name}</Typography>
						</ListItemButton>
					</ListItem>
				))}
			</List>
		</Box>
	);
}
