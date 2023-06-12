import MainBox from "../SearchPages/MainBox";
import Typography from "@mui/material/Typography";
import { Autocomplete, Box, ButtonGroup, Chip, FormHelperText, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import styled from "@mui/material/styles/styled";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import { User } from "../../http/User";
import SubmitButton from "../Common/SubmitButton";
import { ChangeEvent } from "react";

const FormHelperTextStyle = styled(FormHelperText)`
	color: ${(props) => props.theme.colors.secondary};
`;

const ChipStyle = styled(Chip)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
`;

type FiltersContentProps = {
	authors: User[];
};
export default function FiltersContent({ authors }: FiltersContentProps) {
	const {
		control,
		setValue,
		reset,
		formState: { errors },
	} = useFormContext();

	const onTagsChange = (event: ChangeEvent<HTMLInputElement>) => {
		const tags = event.target.value.split(/[ ,]+/);
		setValue("tags", tags, { shouldValidate: true, shouldDirty: true });
	};

	const Authors = authors.map((author) => {
		return {
			id: author.id,
			login: author.login,
			firstName: author.firstName,
			lastName: author.lastName,
		};
	});

	return (
		<MainBox>
			<Box>
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
								name='createdFrom'
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
								name='createdTo'
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
			</Box>

			<Controller
				name='tags'
				control={control}
				defaultValue={[]}
				render={({ field, formState: { errors } }) => (
					<TextField
						{...field}
						id='tags'
						placeholder='Теги'
						variant='outlined'
						onChange={onTagsChange}
						fullWidth
						error={!!errors.tags}
						helperText={errors.tags ? errors.tags.message?.toString() : ""}
					/>
				)}
			/>
			{errors.tags?.message ? <Typography color='secondary'>{errors.tags.message.toString()}</Typography> : ""}

			<Controller
				name='authors'
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={Authors}
						getOptionLabel={(option) => {
							return `${option.firstName} ${option.lastName} (${option.login})`;
						}}
						multiple
						filterSelectedOptions
						isOptionEqualToValue={(option, value) => option.id === value.id}
						onChange={(_, data: User[]) => {
							const users = data.map((user) => {
								return {
									id: user.id,
									login: user.login,
									firstName: user.firstName,
									lastName: user.lastName,
								};
							});
							setValue("authors", users, { shouldValidate: true, shouldDirty: true });
						}}
						renderInput={(params) => (
							<TextField {...params} variant='outlined' size='small' placeholder='Автори' fullWidth />
						)}
						renderTags={(value, getTagProps) => {
							return value.map((option, index) => (
								<ChipStyle
									{...getTagProps({ index })}
									key={index}
									label={
										<Typography variant='body2' color='secondary'>
											{`${option.firstName} ${option.lastName} (${option.login})`}
										</Typography>
									}
								/>
							));
						}}
					/>
				)}
			/>
			{errors.authors?.message ? (
				<Typography color='secondary'>{errors.authors.message.toString()}</Typography>
			) : (
				""
			)}

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
