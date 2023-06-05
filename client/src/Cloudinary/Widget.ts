import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export default function Widget(
	cloudName = "dnqlgypji",
	uploadPreset = "gigashop_general",
	setter?: Dispatch<SetStateAction<{ publicId: string; secureUrl: string }>>
) {
	const cloudinaryRef = useRef<any>(null);
	const widgetRef = useRef<any>(null);

	useEffect(() => {
		// @ts-ignore
		cloudinaryRef.current = window.cloudinary;
		widgetRef.current = cloudinaryRef.current.createUploadWidget(
			{
				cloudName: cloudName,
				uploadPreset: uploadPreset,
			},
			(error: any, result: any) => {
				if (!error && result && result.event === "success") {
					console.log("Done! Here is the image info: ", result.info);
					if (setter) {
						setter({ publicId: result.info.public_id, secureUrl: result.info.secure_url });
					}
				}
			}
		);
	}, []);

	return { cloudinaryRef, widgetRef };
}
