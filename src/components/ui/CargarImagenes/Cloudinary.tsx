

export const Cloudinary = async (file: File): Promise<string | null> => {

    const preset_name = "reactorsimages";
    const cloud_name = "dapt6ypui";

    const data = new FormData();
    data.append('file', file);
    data.append('upload_preset', preset_name);

    try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
            method: 'POST',
            body: data,
        });

        const json = await res.json();
        return json.secure_url; // devuelve la url
    } catch (error) {
        console.error('Error al subir imagen a Cloudinary:', error);
        return null;
    }
};



