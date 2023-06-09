import { Container } from "@mui/material";
import Typography from "@mui/material/Typography";

export default function Home() {
	return (
		<Container
			maxWidth='lg'
			sx={{
				mt: "15px",
				height: "100%",
			}}
		>
			<Typography component='h2' variant='h3' sx={{ textAlign: "center" }}>
				Ласкаво просимо до {process.env.REACT_APP_PROJECT_NAME}!
			</Typography>
		</Container>
	);
}
