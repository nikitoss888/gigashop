import { useParams } from "react-router-dom";
import Items from "../mock/Items";
import { Box, Container } from "@mui/material";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { useTheme } from "@emotion/react";

const ContainerStyle = styled(Container)`
	display: grid;
	grid-template-rows: repeat(auto-fill, 1fr);
	grid-gap: 20px;
`;

const Image = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`;

type DataGroupProps = {
	title: string;
	content?: string;
};

const DataGroup = ({ title, content }: DataGroupProps) => (
	<Box sx={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
		<Typography
			component='h6'
			variant='h6'
			width={200}
			sx={{ fontWeight: "bold", borderBottom: "2px solid", borderColor: "primary" }}
		>
			{title}:
		</Typography>
		<Typography component='p' variant='body1'>
			{content}
		</Typography>
	</Box>
);

export default function Item() {
	const theme = useTheme();
	const { id } = useParams();
	const item = Items.find((item) => item.id.toString() === (id as string));

	return (
		<ThemeProvider theme={theme}>
			<ContainerStyle
				sx={{
					gridTemplateColumns: {
						xs: "1fr",
						sm: "1fr 1fr",
					},
				}}
			>
				<Typography
					component='h1'
					variant='h3'
					sx={{ textAlign: "center", gridColumn: { xs: "1 / 2", sm: "1 / 3" } }}
				>
					{item?.name}
				</Typography>
				<Box sx={{ gridColumn: "1 / 2", gridRow: "2 / 4" }}>
					<Image src={item?.image} alt={item?.name} />
				</Box>
				<DataGroup title='Опис' content={item?.description} />
			</ContainerStyle>
		</ThemeProvider>
	);
}
