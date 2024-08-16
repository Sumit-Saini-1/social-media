import Image from "next/image";
import { useState, useEffect } from "react";

export interface NewPostProps {
    setUploadMdal: (uploadMdal: boolean) => void;
}

export default function NewPost(props: NewPostProps) {
    const { setUploadMdal } = props;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [caption, setCaption] = useState<string>("");

    useEffect(() => {
        // Clean up the preview URL when the component unmounts
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);
    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setSelectedFile(file);

            // Create a preview URL for the selected image
            const preview = URL.createObjectURL(file);
            setPreviewUrl(preview);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('caption', caption);

        const response = await fetch('/api/posts', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.success) {
            alert(`File uploaded successfully! File URL: ${result.url}`);
            setUploadMdal(false); // Close the modal on successful upload
        } else {
            alert(`File upload failed: ${result.error}`);
        }

        // Cleanup after upload
        setPreviewUrl(null);
        setSelectedFile(null);
        setCaption("");
    };

    return (
        <>
            {
                previewUrl ?
                    <div className="mt-4 ">
                        <Image src={previewUrl} width={400} height={400} alt="Selected Image Preview" className="max-w-full h-auto rounded-md" />
                        <div>
                            <textarea onChange={(e) => setCaption(e.target.value)} className="w-full border border-gray-300 rounded-md p-2 mt-4" placeholder="Caption"></textarea>
                            <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleUpload}>Upload</button>
                        </div>
                    </div> :
                    <input name="file" type="file" accept="image/*" onChange={handleFileChange} />
            }
        </>
    );
}
