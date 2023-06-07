import { Dispatch, SetStateAction, useEffect, useRef } from "react";

export default function WidgetSingle(
	cloudName = "dnqlgypji",
	uploadPreset = "gigashop_general",
	setter?: Dispatch<SetStateAction<string | null>>
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
						setter(result.info.secure_url);
					}
				}
			}
		);
	}, []);

	return { cloudinaryRef, widgetRef };
}
