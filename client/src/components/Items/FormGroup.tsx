import { useFormContext, Controller } from "react-hook-form";
import { Box, TextField, Autocomplete, Checkbox, FormControlLabel } from "@mui/material";
import styled from "@emotion/styled/macro";

const BoxStyle = styled(Box)`
	background-color: ${(props) => props.theme.colors.primary};
	height: auto;
	padding: 15px;
	border-radius: 5px;
	.MuiOutlinedInput-root {
		background-color: ${(props) => props.theme.colors.inputBackground};
	}
	grid-area: sidesearch;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 15px;
`;

type Genre = {
	id: number;
	name: string;
};
const Genres: Genre[] = [
	{ name: "Жахи", id: 1 },
	{ name: "Комедії", id: 2 },
	{ name: "Драми", id: 3 },
	{ name: "Фантастика", id: 4 },
	{ name: "Бойовики", id: 5 },
	{ name: "Трилери", id: 6 },
	{ name: "Пригоди", id: 7 },
];

type Company = {
	id: number;
	name: string;
};
const Companies: Company[] = [
	{ name: "Warner Bros", id: 1 },
	{ name: "Universal Pictures", id: 2 },
	{ name: "Paramount Pictures", id: 3 },
	{ name: "Columbia Pictures", id: 4 },
	{ name: "Walt Disney Pictures", id: 5 },
	{ name: "20th Century Fox", id: 6 },
];

export default function FormGroup() {
	const {
		control,
		setValue,
		formState: { errors },
	} = useFormContext();

	return (
		<BoxStyle>
			<Controller
				name='priceFrom'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						placeholder={"Ціна від"}
						variant='outlined'
						size='small'
						fullWidth
						type='number'
						helperText={errors.priceFrom?.message?.toString()}
					/>
				)}
			/>

			<Controller
				name='priceTo'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						placeholder={"Ціна до"}
						variant='outlined'
						size='small'
						fullWidth
						type='number'
						helperText={errors.priceTo?.message?.toString()}
					/>
				)}
			/>

			<Controller
				name='dateFrom'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						placeholder={"Дата від"}
						variant='outlined'
						size='small'
						fullWidth
						type='date'
						helperText={errors.dateFrom?.message?.toString()}
					/>
				)}
			/>

			<Controller
				name='dateTo'
				control={control}
				render={({ field }) => (
					<TextField
						{...field}
						placeholder={"Дата до"}
						variant='outlined'
						size='small'
						fullWidth
						type='date'
						helperText={errors.dateTo?.message?.toString()}
					/>
				)}
			/>

			<Controller
				name='genres'
				control={control}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={Genres}
						getOptionLabel={(option) => option.name}
						multiple
						value={field.value || []}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						onChange={(_, data: typeof Genres) => {
							const genres = data.map((item) => {
								return { id: item.id, name: item.name };
							});
							setValue("genres", genres, { shouldValidate: true, shouldDirty: true });
						}}
						renderInput={(params) => (
							<TextField {...params} variant='outlined' size='small' placeholder='Жанри' fullWidth />
						)}
					/>
				)}
			/>
			{errors.genres?.message ? <span>{errors.genres?.message.toString()}</span> : undefined}

			<Controller
				name='publisher'
				control={control}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={Companies}
						getOptionLabel={(option) => option.name}
						value={field.value || null}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						onChange={(_, data: Company) => {
							const company = { id: data.id, name: data.name };
							setValue("publisher", company, { shouldValidate: true, shouldDirty: true });
						}}
						renderInput={(params) => (
							<TextField {...params} variant='outlined' size='small' placeholder='Видавець' fullWidth />
						)}
					/>
				)}
			/>
			{errors.publisher?.message ? <span>{errors.publisher?.message.toString()}</span> : undefined}

			<Controller
				name='developers'
				control={control}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={Companies}
						getOptionLabel={(option) => option.name}
						multiple
						value={field.value || []}
						isOptionEqualToValue={(option, value) => option.id === value.id}
						onChange={(_, data: typeof Companies) => {
							const developers = data.map((item) => {
								return { id: item.id, name: item.name };
							});
							setValue("developers", developers, { shouldValidate: true, shouldDirty: true });
						}}
						renderInput={(params) => (
							<TextField {...params} variant='outlined' size='small' placeholder='Розробники' fullWidth />
						)}
					/>
				)}
			/>
			{errors.developers?.message ? <span>{errors.developers?.message.toString()}</span> : undefined}

			<Controller
				name='discount'
				control={control}
				render={({ field }) => (
					<FormControlLabel
						control={
							<Checkbox
								{...field}
								checked={field.value || false}
								onChange={(e) => {
									setValue("discount", e.target.checked, { shouldValidate: true, shouldDirty: true });
								}}
								color='primary'
							/>
						}
						label='Знижка'
					/>
				)}
			/>
		</BoxStyle>
	);
}
