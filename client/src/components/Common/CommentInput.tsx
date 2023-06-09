import { Box, ButtonGroup, Rating, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import { StarRate } from "@mui/icons-material";
import SubmitButton from "./SubmitButton";
import Button from "@mui/material/Button";

type CommentInputProps = {
	message: {
		value: string;
		setValue: (message: string) => void;
	};
	rate: {
		value: number;
		setValue: (rate: number) => void;
	};
};
export default function CommentInput({ message, rate }: CommentInputProps) {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				gap: "10px",
				width: "100%",
				alignItems: "stretch",
			}}
		>
			<Box>
				<Typography variant='h6'>Ваш коментар:</Typography>
				<TextField
					multiline
					rows={2}
					fullWidth
					label='Коментар'
					variant='outlined'
					value={message.value}
					onChange={(e) => message.setValue(e.target.value)}
					sx={{ mt: "10px" }}
				/>
			</Box>
			<Box>
				<Typography variant='h6'>Оцінка:</Typography>
				<Rating
					name='comment-rating'
					value={rate.value}
					onChange={(_, newValue) => rate.setValue(newValue || 0)}
					emptyIcon={<StarRate color='disabled' />}
					icon={<StarRate sx={{ color: "accent.main" }} />}
				/>
			</Box>
			<ButtonGroup fullWidth>
				<SubmitButton type='submit'>Відправити</SubmitButton>
				<Button type='reset'>Очистити</Button>
			</ButtonGroup>
		</Box>
	);
}
