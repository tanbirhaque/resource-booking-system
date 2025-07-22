// Mock API functions for booking system

export interface Resource {
    id: string;
    name: string;
    type: string;
}

export interface Booking {
    id: string;
    resourceId: string;
    resourceName: string;
    startTime: string;
    endTime: string;
    requestedBy: string;
    createdAt: string;
}

export interface BookingRequest {
    resourceId: string;
    startTime: string;
    endTime: string;
    requestedBy: string;
}

export interface ConflictCheck {
    hasConflict: boolean;
    conflictingBookings?: Booking[];
    message?: string;
}

// Sample resources
export const SAMPLE_RESOURCES: Resource[] = [
    { id: "conf-room-a", name: "Conference Room A", type: "Meeting Room" },
    { id: "conf-room-b", name: "Conference Room B", type: "Meeting Room" },
    { id: "projector-1", name: "Projector #1", type: "Equipment" },
    { id: "laptop-cart", name: "Laptop Cart", type: "Equipment" },
    { id: "video-studio", name: "Video Studio", type: "Studio" },
];

// Sample bookings data - in memory storage
const SAMPLE_BOOKINGS: Booking[] = [
    {
        id: "1",
        resourceId: "conf-room-a",
        resourceName: "Conference Room A",
        startTime: "2024-07-22T14:00:00",
        endTime: "2024-07-22T15:30:00",
        requestedBy: "John Doe",
        createdAt: "2024-07-21T10:00:00",
    },
    {
        id: "2",
        resourceId: "projector-1",
        resourceName: "Projector #1",
        startTime: "2024-07-22T10:00:00",
        endTime: "2024-07-22T12:00:00",
        requestedBy: "Jane Smith",
        createdAt: "2024-07-21T09:00:00",
    },
    {
        id: "3",
        resourceId: "conf-room-b",
        resourceName: "Conference Room B",
        startTime: "2024-07-23T09:00:00",
        endTime: "2024-07-23T10:00:00",
        requestedBy: "Mike Johnson",
        createdAt: "2024-07-21T11:00:00",
    },
];

const BUFFER_MINUTES = 10;

// Mock API Functions
export const bookingApi = {
    // Get all bookings with optional filtering
    getBookings: async (filters?: { resource?: string; date?: string }): Promise<Booking[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));

        let filteredBookings = [...SAMPLE_BOOKINGS];

        if (filters?.resource) {
            filteredBookings = filteredBookings.filter(b => b.resourceId === filters.resource);
        }

        if (filters?.date) {
            const filterDate = new Date(filters.date).toDateString();
            filteredBookings = filteredBookings.filter(b =>
                new Date(b.startTime).toDateString() === filterDate
            );
        }

        return filteredBookings.sort((a, b) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
    },

    // Create a new booking
    createBooking: async (bookingRequest: BookingRequest): Promise<{ success: boolean; booking?: Booking; error?: string }> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Validate the booking request
        const validation = validateBookingRequest(bookingRequest);
        if (!validation.isValid) {
            return { success: false, error: validation.error };
        }

        // Check for conflicts
        const conflictCheck = await checkForConflicts(bookingRequest);
        if (conflictCheck.hasConflict) {
            return { success: false, error: conflictCheck.message };
        }

        // Create the booking
        const resource = SAMPLE_RESOURCES.find(r => r.id === bookingRequest.resourceId);
        const newBooking: Booking = {
            id: Date.now().toString(),
            resourceId: bookingRequest.resourceId,
            resourceName: resource?.name || 'Unknown Resource',
            startTime: bookingRequest.startTime,
            endTime: bookingRequest.endTime,
            requestedBy: bookingRequest.requestedBy,
            createdAt: new Date().toISOString(),
        };

        SAMPLE_BOOKINGS.push(newBooking);

        return { success: true, booking: newBooking };
    },

    // Delete a booking
    deleteBooking: async (bookingId: string): Promise<{ success: boolean; error?: string }> => {
        await new Promise(resolve => setTimeout(resolve, 200));

        const index = SAMPLE_BOOKINGS.findIndex(b => b.id === bookingId);
        if (index === -1) {
            return { success: false, error: "Booking not found" };
        }

        SAMPLE_BOOKINGS.splice(index, 1);
        return { success: true };
    },

    // Get available resources
    getResources: async (): Promise<Resource[]> => {
        await new Promise(resolve => setTimeout(resolve, 100));
        return [...SAMPLE_RESOURCES];
    },
};

// Validation function
function validateBookingRequest(request: BookingRequest): { isValid: boolean; error?: string } {
    const startTime = new Date(request.startTime);
    const endTime = new Date(request.endTime);

    if (endTime <= startTime) {
        return { isValid: false, error: "End time must be after start time" };
    }

    const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
    if (durationMinutes < 15) {
        return { isValid: false, error: "Booking duration must be at least 15 minutes" };
    }

    if (!request.requestedBy.trim()) {
        return { isValid: false, error: "Requested by field is required" };
    }

    return { isValid: true };
}

// Conflict detection with buffer logic
async function checkForConflicts(request: BookingRequest): Promise<ConflictCheck> {
    const existingBookings = SAMPLE_BOOKINGS.filter(b => b.resourceId === request.resourceId);

    const requestStart = new Date(request.startTime);
    const requestEnd = new Date(request.endTime);

    for (const booking of existingBookings) {
        const bookingStart = new Date(booking.startTime);
        const bookingEnd = new Date(booking.endTime);

        // Add buffer time (10 minutes before and after existing booking)
        const bufferStart = new Date(bookingStart.getTime() - BUFFER_MINUTES * 60000);
        const bufferEnd = new Date(bookingEnd.getTime() + BUFFER_MINUTES * 60000);

        // Check if requested time overlaps with buffered time
        if (
            (requestStart >= bufferStart && requestStart < bufferEnd) ||
            (requestEnd > bufferStart && requestEnd <= bufferEnd) ||
            (requestStart <= bufferStart && requestEnd >= bufferEnd)
        ) {
            return {
                hasConflict: true,
                conflictingBookings: [booking],
                message: `Time conflict: ${booking.resourceName} is booked from ${formatTime(booking.startTime)} to ${formatTime(booking.endTime)} (including 10-minute buffer)`
            };
        }
    }

    return { hasConflict: false };
}

// Helper function to format time for display
function formatTime(isoString: string): string {
    return new Date(isoString).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
}

// Helper function to get booking status
export function getBookingStatus(booking: Booking): 'upcoming' | 'ongoing' | 'past' {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'past';
}