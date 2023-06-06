import { Dispatch, SetStateAction, useEffect, useRef } from "react";

type SetterInput = { publicId: string; secureUrl: string };

export default function WidgetSingle(
	cloudName = "dnqlgypji",
	uploadPreset = "gigashop_general",
	setter?: Dispatch<SetStateAction<SetterInput>>
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
				cropping: true,
				multiple: false,
				maxFiles: 1,
			},
			(error: any, result: any) => {
				if (!error && result && result.event === "success") {
					console.log("Done! Here is the image info: ", result.info);

					if (setter && result.info) {
						setter({
							publicId: result.info.public_id,
							secureUrl: result.info.secure_url,
						});
					}
				}
			}
		);
	}, []);

	return { cloudinaryRef, widgetRef };
}
