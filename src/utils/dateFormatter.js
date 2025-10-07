const monthNamesFull = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
];

/**
 * Verilən tarix obyektini və ya string-i "YYYY - MMMM" formatında qaytarır (məs: 2025 - Oktyabr)
 * @param {Date | string} dateInput - Formatlanacaq tarix
 * @returns {string} Formatlanmış tarix
 */
export const formatForDatePicker = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = monthNamesFull[date.getMonth()];
    
    return `${year} - ${month}`;
};

/**
 * Verilən tarix obyektini və ya string-i "MMMM YYYY" formatında qaytarır (məs: Oktyabr 2025)
 * @param {Date | string} dateInput - Formatlanacaq tarix
 * @returns {string} Formatlanmış tarix
 */
export const formatForDisplay = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = monthNamesFull[date.getMonth()];
    
    return `${month} ${year}`;
};

/**
 * Verilən tarix obyektini və ya string-i "DD MMMM YYYY, HH:mm" formatında qaytarır (məs: 07 Oktyabr 2025, 15:30)
 * @param {Date | string} dateInput - Formatlanacaq tarix
 * @returns {string} Formatlanmış tarix
 */
export const formatForHistory = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";

    const day = String(date.getDate()).padStart(2, '0');
    const month = monthNamesFull[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
};

/**
 * Verilən tarix obyektini və ya string-i API üçün "YYYY-MM-DD" formatına çevirir.
 * @param {Date | string} dateInput - Formatlanacaq tarix
 * @returns {string} API uyğun format
 */
export const formatForAPI = (dateInput) => {
    if (!dateInput) return "";
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return "";
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Aylar 0-dan başladığı üçün +1
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
};