import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale/id";

const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);

    return formatDistanceToNow(date, { 
        addSuffix: true, // Menambahkan "yang lalu" atau "dalam"
        locale: id       // Menggunakan Bahasa Indonesia
    });
};

export default formatRelativeTime;