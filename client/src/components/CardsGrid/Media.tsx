import { CardMedia } from "@mui/material";

type MediaProps = {
	image?: string;
	alt?: string;
};
export default function Media({ image, alt }: MediaProps) {
	return (
		<CardMedia
			component='img'
			image={image}
			alt={alt}
			sx={{ aspectRatio: "16/9", objectPosition: "center top", height: { xs: 200, md: 155 } }}
		/>
	);
}
