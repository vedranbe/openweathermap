
// Function to convert to 12 or 24 hours
function convertToHoursAndMinutesWithAMPM(timestamp, units) {
    // Create a Date object from the timestamp
    const date = new Date(timestamp);

    // Extract hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine AM or PM and handle 12/24 hour format
    let ampm = '';
    if (units === 'imperial') {
        ampm = hours >= 12 ? ' PM' : ' AM';
        hours = hours % 12 || 12; // Convert to 12-hour format
    } else {
        // For 24-hour format, no AM/PM and keep hours as is
    }

    // Format hours and minutes as two-digit numbers
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    // Format the output as a string
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
}

// Translation function
function translate(term, lang) {
    return translations[lang] ? translations[lang][term] : translations['en'][term]; // Default to English if language not found
}

// Get current timezone time
function calculateTimezoneTime(timestampMs, timezoneOffsetSeconds) {
    // Convert timezone offset from seconds to milliseconds
    const timezoneOffsetMs = timezoneOffsetSeconds * 1000;

    // Create a new Date object with the adjusted time
    const localTime = new Date(timestampMs + timezoneOffsetMs);

    return localTime;
}

