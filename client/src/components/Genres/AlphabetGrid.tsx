import { Genre } from "../../http/Genres";
import { Box, Typography } from "@mui/material";
import styled from "@mui/material/styles/styled";
import GenresList from "./GenresList";

const Grid = styled(Box)`
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	grid-template-rows: repeat(auto-fill, 1fr);
	grid-auto-flow: dense;
	grid-gap: 10px 20px;
`;

const split = (genres?: Genre[]) => {
	if (!genres) return undefined;

	const dict = genres.reduce((acc, genre) => {
		const char = genre.name[0].toUpperCase();
		if (acc[char]) {
			acc[char].push(genre);
		} else {
			acc[char] = [genre];
		}
		return acc;
	}, {} as { [key: string]: Genre[] });

	return Object.entries(dict).sort((a, b) => a[0].localeCompare(b[0]));
};

type GridProps = {
	genres?: Genre[];
};
export default function AlphabetGrid({ genres }: GridProps) {
	const splitGenres = split(genres);

	return (
		<Grid>
			{splitGenres && splitGenres.map((group) => <GenresList genres={group} key={group[0]} />)}
			{!splitGenres ||
				(splitGenres.length === 0 && (
					<Box sx={{ gridColumn: "1 / -1" }}>
						<Typography variant='h5' textAlign='center'>
							Жанри не знайдено
						</Typography>
					</Box>
				))}
		</Grid>
	);
}
