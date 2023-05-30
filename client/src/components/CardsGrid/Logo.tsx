import { CardMedia } from "@mui/material";

type LogoProps = {
	image?: string;
	alt?: string;
};
export default function Logo({ image, alt }: LogoProps) {
	return <CardMedia component='img' image={image} alt={alt} sx={{ aspectRatio: "1/1", objectPosition: "center" }} />;
}
