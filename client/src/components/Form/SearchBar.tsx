import { useFormContext, Controller } from "react-hook-form";
import { Box, TextField } from "@mui/material";
import styled from "@emotion/styled/macro";

const BoxStyle = styled(Box)`
	background-color: ${(props) => props.theme.colors.primary};
	padding: 15px;
	border-radius: 5px;
	.MuiOutlinedInput-root {
		background-color: ${(props) => props.theme.colors.inputBackground};
		color: ${(props) => props.theme.colors.primary};
	}
	grid-area: search;
`;

type Props = {
	name: string;
	label: string;
	defValue: string;
};

export default function SearchBar({ name, label, defValue }: Props) {
	const {
		control,
		formState: { errors },
	} = useFormContext();

	return (
		<BoxStyle>
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
							helperText={errors.name?.message?.toString()}
						/>
					);
				}}
			/>
		</BoxStyle>
	);
}
