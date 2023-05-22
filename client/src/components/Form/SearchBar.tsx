import { useFormContext, Controller } from "react-hook-form";
import { Box, IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import styled from "@emotion/styled/macro";

const BoxStyle = styled(Box)`
	background-color: ${(props) => props.theme.colors.primary};
	padding: 15px;
	border-radius: 5px;
	.MuiOutlinedInput-root {
		background-color: ${(props) => props.theme.colors.inputBackground};
		color: ${(props) => props.theme.colors.primary};
	}
	display: flex;
`;

const IconButtonStyle = styled(IconButton)`
	background-color: ${(props) => props.theme.colors.accent};
	color: ${(props) => props.theme.colors.secondary};
	border-radius: 10px;
	&:hover {
		background-color: ${(props) => props.theme.colors.accentLight};
	}
`;

type Props = {
	name: string;
	label: string;
	defValue: string;
};

export default function SearchBar({ name, label, defValue = "" }: Props) {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<BoxStyle sx={{ gridColumn: { sm: "1", md: "1/3" } }}>
			<Controller
				name={name}
				control={control}
				defaultValue={defValue}
				render={({ field }) => {
					return (
						<TextField
							{...field}
							placeholder={label}
							variant='outlined'
							size='small'
							fullWidth
							error={!!errors.name}
							helperText={errors.name?.message?.toString()}
						/>
					);
				}}
			/>
			<IconButtonStyle type='submit' sx={{ ml: 1 }}>
				<SearchIcon />
			</IconButtonStyle>
		</BoxStyle>
	);
}
