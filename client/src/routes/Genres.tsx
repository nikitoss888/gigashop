import { useForm, FormProvider } from "react-hook-form";
import { Container } from "@mui/material";
import SearchBar from "../components/Form/SearchBar";

export default function Genres() {
	const methods = useForm();

	const onSubmit = (data: any) => {
		try {
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};

	const onReset = () => {
		methods.reset();
	};

	return (
		<Container sx={{ mt: "15px" }}>
			<FormProvider {...methods}>
				<form onSubmit={methods.handleSubmit(onSubmit)} onReset={onReset}>
					<SearchBar name='name' label='Назва' defValue='' />
				</form>
			</FormProvider>
		</Container>
	);
}
