// app/dashboard-date-utils.ts

export const formatBirthday = (dateString: string) => {
    // Parse the date in UTC to prevent timezone shifts
    const date = new Date(dateString);
    
    // Use Intl.DateTimeFormat with UTC timezone
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    }).format(date);
  };
  
  export const getDaysUntilBirthday = (birthdayString: string) => {
    // Get today's date in UTC
    const today = new Date();
    const todayUTC = Date.UTC(
      today.getUTCFullYear(), 
      today.getUTCMonth(), 
      today.getUTCDate()
    );
  
    // Parse birthday in UTC
    const birthday = new Date(birthdayString);
    const birthdayUTC = Date.UTC(
      today.getUTCFullYear(), 
      birthday.getUTCMonth(), 
      birthday.getUTCDate()
    );
  
    // If birthday has already passed this year, set to next year
    const nextBirthdayUTC = birthdayUTC < todayUTC 
      ? Date.UTC(
          today.getUTCFullYear() + 1, 
          birthday.getUTCMonth(), 
          birthday.getUTCDate()
        )
      : birthdayUTC;
  
    // Calculate difference in days
    const diffTime = nextBirthdayUTC - todayUTC;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
    return diffDays;
  };
  
  export const getBadgeVariant = (days: number) => {
    if (days === 0) return "danger";
    if (days <= 7) return "warning";
    if (days <= 30) return "primary";
    return "default";
  };