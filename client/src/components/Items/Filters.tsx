import { useFormContext, Controller, Control, FieldErrors } from "react-hook-form";
import {
	Box,
	TextField,
	Autocomplete,
	Checkbox,
	FormControlLabel,
	Chip,
	ButtonGroup,
	FormHelperText,
	Accordion,
	AccordionSummary,
	AccordionDetails,
} from "@mui/material";
import styled from "@mui/material/styles/styled";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { UseFormReset, UseFormSetValue } from "react-hook-form/dist/types/form";
import { FieldValues } from "react-hook-form/dist/types/fields";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { default as MockGenres } from "../../mock/Genres";

const BoxStyle = styled(Box)`
	background-color: ${(props) => props.theme.colors.primary};
	color: ${(props) => props.theme.colors.secondary};
	padding: 15px;
	border-radius: 5px;
	.MuiOutlinedInput-root {
		background-color: ${(props) => props.theme.colors.inputBackground};
	}
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	gap: 15px;
`;

const AccordionStyle = styled(Accordion)`
	background-color: ${(props) => props.theme.colors.primary};
	border-radius: 5px;
`;

const ChipStyle = styled(Chip)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
`;

const CheckboxStyle = styled(Checkbox)`
	color: ${(props) => props.theme.colors.secondary};
	&.Mui-checked {
		color: ${(props) => props.theme.colors.secondary};
	}
`;

const FormHelperTextStyle = styled(FormHelperText)`
	color: ${(props) => props.theme.colors.secondary};
`;

const SubmitButtonStyle = styled(Button)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
	&:hover {
		background-color: ${(props) => props.theme.colors.accentLight};
	}
`;

type ModelObject = {
	id: number;
	name: string;
};
const Genres = MockGenres.sort((a, b) => (a.name > b.name ? 1 : -1));

const Companies: ModelObject[] = [
	{ name: "Warner Bros", id: 1 },
	{ name: "Universal Pictures", id: 2 },
	{ name: "Paramount Pictures", id: 3 },
	{ name: "Columbia Pictures", id: 4 },
	{ name: "Walt Disney Pictures", id: 5 },
	{ name: "20th Century Fox", id: 6 },
].sort((a, b) => (a.name > b.name ? 1 : -1));

type FiltersContentProps = {
	control: Control;
	errors: FieldErrors;
	reset: UseFormReset<FieldValues>;
	setValue: UseFormSetValue<FieldValues>;
};

const FiltersContent = ({ control, errors, reset, setValue }: FiltersContentProps) => (
	<BoxStyle>
		<Typography variant='h6' component='h2' color='secondary' sx={{ display: { sm: "none", md: "block" } }}>
			Фільтри
		</Typography>

		<Box>
			<Typography variant='subtitle1' component='h3' color='secondary'>
				Ціна
			</Typography>
			<Box display='flex' justifyContent='space-between' alignItems='center' gap='10px'>
				<Controller
					name='priceFrom'
					control={control}
					defaultValue={""}
					render={({ field }) => (
						<TextField
							{...field}
							placeholder={"Ціна від"}
							variant='outlined'
							size='small'
							fullWidth
							type='number'
							helperText={errors.priceFrom?.message?.toString()}
							error={!!errors.priceFrom}
						/>
					)}
				/>
				—
				<Controller
					name='priceTo'
					control={control}
					defaultValue={""}
					render={({ field }) => (
						<TextField
							{...field}
							placeholder={"Ціна до"}
							variant='outlined'
							size='small'
							fullWidth
							type='number'
							helperText={errors.priceTo?.message?.toString()}
							error={!!errors.priceTo}
						/>
					)}
				/>
			</Box>
		</Box>

		<Box>
			<Typography variant='subtitle1' component='h3' color='secondary'>
				Дата створення
			</Typography>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='center'
				gap='15px'
				sx={{ flexDirection: "column" }}
			>
				<Box width='100%'>
					<Controller
						name='dateFrom'
						control={control}
						defaultValue={""}
						render={({ field }) => (
							<TextField
								{...field}
								placeholder={"Дата від"}
								variant='outlined'
								size='small'
								fullWidth
								type='date'
								error={!!errors.dateFrom}
							/>
						)}
					/>
					<FormHelperTextStyle color='secondary' error={!!errors.dateFrom}>
						Дата від
						{errors.dateFrom ? (
							<>
								<br />
								{errors.dateFrom.message?.toString()}
							</>
						) : (
							""
						)}
					</FormHelperTextStyle>
				</Box>

				<Box width='100%'>
					<Controller
						name='dateTo'
						control={control}
						defaultValue={new Date().toISOString().slice(0, 10)}
						render={({ field }) => (
							<TextField
								{...field}
								placeholder={"Дата до"}
								variant='outlined'
								size='small'
								fullWidth
								type='date'
							/>
						)}
					/>
					<FormHelperTextStyle color='secondary' error={!!errors.dateTo}>
						Дата до
						{errors.dateTo ? (
							<>
								<br />
								{errors.dateTo.message?.toString()}
							</>
						) : (
							""
						)}
					</FormHelperTextStyle>
				</Box>
			</Box>
		</Box>

		<Controller
			name='genres'
			control={control}
			defaultValue={[]}
			render={({ field }) => (
				<Autocomplete
					{...field}
					options={Genres}
					getOptionLabel={(option) => option.name}
					multiple
					filterSelectedOptions
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
					renderTags={(value, getTagProps) => {
						return value.map((option, index) => (
							<ChipStyle
								{...getTagProps({ index })}
								key={index}
								label={<Typography variant='body2'>{option.name}</Typography>}
							/>
						));
					}}
				/>
			)}
		/>
		{errors.genres?.message ? <span>{errors.genres?.message.toString()}</span> : undefined}

		<Controller
			name='publisher'
			control={control}
			defaultValue={null}
			render={({ field }) => (
				<Autocomplete
					{...field}
					options={Companies}
					getOptionLabel={(option) => option.name}
					isOptionEqualToValue={(option, value) => option.id === value.id}
					onChange={(_, data: ModelObject) => {
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
			defaultValue={[]}
			render={({ field }) => (
				<Autocomplete
					{...field}
					options={Companies}
					getOptionLabel={(option) => option.name}
					multiple
					filterSelectedOptions
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
					renderTags={(value, getTagProps) => {
						return value.map((option, index) => (
							<ChipStyle
								{...getTagProps({ index })}
								key={index}
								label={<Typography variant='body2'>{option.name}</Typography>}
							/>
						));
					}}
				/>
			)}
		/>
		{errors.developers?.message ? <span>{errors.developers?.message.toString()}</span> : undefined}

		<Controller
			name='discount'
			control={control}
			defaultValue={false}
			render={({ field }) => (
				<FormControlLabel
					control={
						<CheckboxStyle
							{...field}
							checked={field.value || false}
							onChange={(e) => {
								setValue("discount", e.target.checked, {
									shouldValidate: true,
									shouldDirty: true,
								});
							}}
							color='secondary'
						/>
					}
					label={
						<Typography variant='body1' color='secondary'>
							Знижка
						</Typography>
					}
					color='secondary'
				/>
			)}
		/>

		<ButtonGroup fullWidth>
			<SubmitButtonStyle variant='contained' type='submit' startIcon={<SearchIcon />}>
				Пошук
			</SubmitButtonStyle>
			<Button
				variant='contained'
				color='secondary'
				onClick={() => {
					reset();
				}}
				startIcon={<ClearIcon />}
			>
				Очистити
			</Button>
		</ButtonGroup>
	</BoxStyle>
);

export default function Filters() {
	const {
		control,
		setValue,
		reset,
		formState: { errors },
	} = useFormContext();

	return (
		<>
			<Box sx={{ gridRow: 2, display: { xs: "none", md: "block" } }} p={0} m={0}>
				<FiltersContent control={control} setValue={setValue} reset={reset} errors={errors} />
			</Box>
			<AccordionStyle sx={{ display: { md: "none" } }} disableGutters>
				<AccordionSummary
					expandIcon={<ExpandMoreIcon color='secondary' />}
					aria-controls='content'
					id='filters-accordion-header'
				>
					<Typography variant='h6' component='h2' color='secondary'>
						Фільтри
					</Typography>
				</AccordionSummary>
				<AccordionDetails sx={{ padding: 0 }}>
					<FiltersContent control={control} setValue={setValue} reset={reset} errors={errors} />
				</AccordionDetails>
			</AccordionStyle>
		</>
	);
}
