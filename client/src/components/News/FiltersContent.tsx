import MainBox from "../SearchPages/MainBox";
import Typography from "@mui/material/Typography";
import { Autocomplete, Box, ButtonGroup, Chip, FormHelperText, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import styled from "@mui/material/styles/styled";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import Publications from "../../mock/Publications";

const FormHelperTextStyle = styled(FormHelperText)`
	color: ${(props) => props.theme.colors.secondary};
`;

const ChipStyle = styled(Chip)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
`;

const SubmitButtonStyle = styled(Button)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
	&:hover {
		background-color: ${(props) => props.theme.colors.accentLight};
	}
`;

export default function FiltersContent() {
	const {
		control,
		setValue,
		reset,
		formState: { errors },
	} = useFormContext();

	const Tags = Publications.reduce((acc: string[], curr) => {
		curr.tags?.forEach((tag) => {
			if (!acc.includes(tag)) acc.push(tag);
		});
		return acc;
	}, []);

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
			</Box>

			<Controller
				name='tags'
				control={control}
				defaultValue={[]}
				render={({ field }) => (
					<Autocomplete
						{...field}
						options={Tags}
						getOptionLabel={(option) => option}
						multiple
						filterSelectedOptions
						isOptionEqualToValue={(option, value) => option === value}
						onChange={(_, data: string[]) => {
							setValue("tags", data, { shouldValidate: true, shouldDirty: true });
						}}
						renderInput={(params) => (
							<TextField {...params} variant='outlined' size='small' placeholder='Жанри' fullWidth />
						)}
						renderTags={(value, getTagProps) => {
							return value.map((option, index) => (
								<ChipStyle
									{...getTagProps({ index })}
									key={index}
									label={<Typography variant='body2'>{option}</Typography>}
								/>
							));
						}}
					/>
				)}
			/>
			{errors.genres?.message ? <span>{errors.genres?.message.toString()}</span> : undefined}

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
		</MainBox>
	);
}
