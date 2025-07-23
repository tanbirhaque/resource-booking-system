"use client";

import { BookOpen, Calendar } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useState } from "react";
import BookingForm from "../BookingForm";
import ViewBookings from "../ViewBookings";


const TabsSection = () => {
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleBookingCreated = () => {
        // Trigger a refresh of the dashboard
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <Tabs defaultValue="book" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="book" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        New Booking
                    </TabsTrigger>
                    <TabsTrigger value="dashboard" className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        View Bookings
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="book" className="flex justify-center">
                    <BookingForm onBookingCreated={handleBookingCreated} />
                </TabsContent>

                <TabsContent value="dashboard" className="flex justify-center">
                    <ViewBookings refreshTrigger={refreshTrigger} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default TabsSection;