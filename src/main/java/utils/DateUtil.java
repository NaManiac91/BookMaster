package utils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public class DateUtil {
	// Define the expected formats
	static DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    static DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("HH:mm");
    
    public static LocalTime parseTime(String timeString) {
        try {
        	return LocalTime.parse(timeString, timeFormatter);
        } catch (DateTimeParseException e) {
            System.err.println("Error parsing time string: " + e.getMessage());
            return null; 
        }
    }
    
    
    public static LocalDate parseDate(String dateString) {
    	try {
        	return LocalDate.parse(dateString, dateFormatter);
        } catch (DateTimeParseException e) {
            System.err.println("Error parsing date string: " + e.getMessage());
            return null; 
        }
    }
    
    
    
	public static LocalDateTime createLocalDateTime(String dateString, String timeString) {
        try {
            // Parse the LocalDate and LocalTime
            LocalDate localDate = LocalDate.parse(dateString, dateFormatter);
            LocalTime localTime = LocalTime.parse(timeString, timeFormatter);

            // Combine them into a LocalDateTime
            return LocalDateTime.of(localDate, localTime);

        } catch (DateTimeParseException e) {
            System.err.println("Error parsing date or time string: " + e.getMessage());
            return null; // Or throw the exception, depending on your error handling strategyh
        }
    }
}
