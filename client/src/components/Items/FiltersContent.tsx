import { Controller, useFormContext } from "react-hook-form";
import MainBox from "../SearchPages/MainBox";
import Typography from "@mui/material/Typography";
import { Autocomplete, Box, ButtonGroup, Chip, FormControlLabel, FormHelperText, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import styled from "@mui/material/styles/styled";
import { Genre } from "../../http/Genres";
import { Company } from "../../http/Companies";
import SubmitButton from "../Common/SubmitButton";
import Checkbox from "../Form/Checkbox";

const ChipStyle = styled(Chip)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
`;

const FormHelperTextStyle = styled(FormHelperText)`
	color: ${(props) => props.theme.colors.secondary};
`;

type FiltersContentProps = {
	companies: Company[];
	genres: Genre[];
};
export default function FiltersContent({ companies, genres }: FiltersContentProps) {
	const Genres = genres.sort((a, b) => (a.name > b.name ? 1 : -1));
	const Companies = companies.sort((a, b) => (a.name > b.name ? 1 : -1));

	const {
		control,
		setValue,
		reset,
		formState: { errors },
	} = useFormContext();

	return (
		<MainBox>
			<Typography variant='h6' component='h2' color='secondary' sx={{ display: { xs: "none", md: "block" } }}>
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
								placeholder='Ціна від'
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
						<Typography variant='subtitle2' component='h4' color='secondary'>
							Дата від
						</Typography>
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
						{errors.dateFrom && (
							<FormHelperTextStyle color='secondary' error={!!errors.dateFrom}>
								{errors.dateFrom.message?.toString()}
							</FormHelperTextStyle>
						)}
					</Box>

					<Box width='100%'>
						<Typography variant='subtitle2' component='h4' color='secondary'>
							Дата до
						</Typography>
						<Controller
							name='dateTo'
							control={control}
							defaultValue={""}
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
						{errors.dateTo && (
							<FormHelperTextStyle color='secondary' error={!!errors.dateTo}>
								{errors.dateTo.message?.toString()}
							</FormHelperTextStyle>
						)}
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
						onChange={(_, data: Genre[]) => {
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
									label={
										<Typography variant='body2' color='secondary'>
											{option.name}
										</Typography>
									}
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
						onChange={(_, data?: Company) => {
							let company = null;
							if (data) company = { id: data.id, name: data.name };
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
									label={
										<Typography variant='body2' color='secondary'>
											{option.name}
										</Typography>
									}
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
							<Checkbox
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
				<SubmitButton variant='contained' type='submit' startIcon={<SearchIcon />}>
					Пошук
				</SubmitButton>
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
		</MainBox>
	);
}
