// Mock API functions for booking system
export interface Resource {
    id: string;
    name: string;
    type: string;
}

export interface Booking {
    id: string;
    resourceId: string;
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

// Mock API Functions
export const bookingApi = {
    getResources: async (): Promise<Resource[]> => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return SAMPLE_RESOURCES;
    }
}

// Sample bookings data - in memory storage
// const SAMPLE_BOOKINGS: Booking[] = [
//     {
//         id: "1",
//         resourceId: "conf-room-a",
//         resourceName: "Conference Room A",
//         startTime: "2024-07-22T14:00:00",
//         endTime: "2024-07-22T15:30:00",
//         requestedBy: "John Doe",
//         createdAt: "2024-07-21T10:00:00",
//     },
//     {
//         id: "2",
//         resourceId: "projector-1",
//         resourceName: "Projector #1",
//         startTime: "2024-07-22T10:00:00",
//         endTime: "2024-07-22T12:00:00",
//         requestedBy: "Jane Smith",
//         createdAt: "2024-07-21T09:00:00",
//     },
//     {
//         id: "3",
//         resourceId: "conf-room-b",
//         resourceName: "Conference Room B",
//         startTime: "2024-07-23T09:00:00",
//         endTime: "2024-07-23T10:00:00",
//         requestedBy: "Mike Johnson",
//         createdAt: "2024-07-21T11:00:00",
//     },
// ];


// Helper function to get booking status
export function getBookingStatus(booking: Booking): 'upcoming' | 'ongoing' | 'past' {
    const now = new Date();
    const startTime = new Date(booking.startTime);
    const endTime = new Date(booking.endTime);

    if (now < startTime) return 'upcoming';
    if (now >= startTime && now <= endTime) return 'ongoing';
    return 'past';
}