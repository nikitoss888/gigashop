import { useParams } from "react-router-dom";
import Genres from "../mock/Genres";
import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import ItemsGrid from "../components/Items/ItemsGrid";
import Items from "../mock/Items";
import styled from "@mui/material/styles/styled";
import HTTPError from "../HTTPError";

const ContainerStyle = styled(Container)`
	display: flex;
	flex-direction: column;
	align-items: stretch;
	justify-content: start;
	gap: 5px 20px;
	margin-top: 15px;
	height: 100%;
`;

export default function Genre() {
	const { id } = useParams();
	if (!id) throw new HTTPError(400, "Не вказано ID жанру");

	const parsed = parseInt(id);
	if (isNaN(parsed)) throw new HTTPError(400, "ID жанру не є числом");

	const genre = Genres.find((genre) => genre.id === parsed);
	if (!genre) throw new HTTPError(404, "Жанр за даним ID не знайдено");

	document.title = `Жанр "${genre.name}" — gigashop`;

	const items = Items.filter((item) => genre.items.includes(item.id));

	return (
		<ContainerStyle>
			<Typography variant='h3' textAlign='center' mt={3}>
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
