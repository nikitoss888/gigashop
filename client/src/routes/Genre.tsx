import { useParams } from "react-router-dom";
import Genres from "../mock/Genres";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import ItemsGrid from "../components/Items/ItemsGrid";
import Items from "../mock/Items";
import styled from "@mui/material/styles/styled";

const ContainerStyle = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 15px;
	margin-bottom: 15px;
	height: 100%;
`;

export default function Genre() {
	const { id } = useParams();
	const genre = Genres.find((genre) => genre.id.toString() === id);

	if (!genre) {
		const error = new Error("Жанр за даним ID не знайдено");
		error.name = "404";
		throw error;
	}
	document.title = `gigashop — Жанр "${genre.name}"`;

	const items = Items.filter((item) => genre.items.includes(item.id));

	return (
		<ContainerStyle>
			<Typography variant='h2' textAlign='center' mt={4}>
				Жанр {genre.name}
			</Typography>
			{genre.description && (
				<>
					<Typography variant='h4' textAlign='center'>
						Опис
					</Typography>
					<Typography variant='body1' textAlign='center'>
						{genre.description}
					</Typography>
				</>
			)}
			<Typography variant='h4' textAlign='center'>
				Товари, пов&apos;язані з жанром:
			</Typography>
			<ItemsGrid items={items} />
		</ContainerStyle>
	);
}
