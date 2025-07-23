import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Clock, Loader2, MapPin, User } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { bookingApi, Resource, BookingRequest } from '@/lib/booking-api';
import { Alert, AlertDescription } from "../ui/alert";

interface BookingFormProps {
    onBookingCreated: () => void;
}

const BookingForm = ({ onBookingCreated }: BookingFormProps) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadResources();
    }, []);

    const loadResources = async () => {
        try {
            const resourceList = await bookingApi.getResources();
            setResources(resourceList);
        } catch (err) {
            console.error('Failed to load resources:', err);
        }
    };

    const handleSubmit = async (formData: FormData) => {

        // Convert FormData to BookingRequest object
        const bookingRequest: BookingRequest = {
            resourceId: formData.get('resourceId') as string,
            startTime: formData.get('startTime') as string,
            endTime: formData.get('endTime') as string,
            requestedBy: formData.get('requestedBy') as string,
        }

        console.log(bookingRequest);
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingRequest),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Booking failed');
            }

            onBookingCreated(); // Notify parent component of new booking
            // Success: booking created
            alert('Booking successful!');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const getDefaultStartTime = () => {
        const now = new Date();
        return now.toISOString().slice(0, 16);
    };

    const getDefaultEndTime = () => {
        const now = new Date();
        now.setHours(now.getHours() + 1); // Default 1 hour duration
        return now.toISOString().slice(0, 16);
    };


    return (
        <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    New Resource Booking
                </CardTitle>
                <CardDescription>
                    Book a shared resource for your team. All bookings include a 10-minute buffer.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form
                    // onSubmit={handleSubmit}
                    action={handleSubmit}
                    className="space-y-6"
                >
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Resource Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="resource" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Resource
                        </Label>
                        <Select
                            name="resourceId"
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a resource to book" />
                            </SelectTrigger>
                            <SelectContent>
                                {resources.map((resource) => (
                                    <SelectItem key={resource.id} value={resource.id}>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{resource.name}</span>
                                            <span className="text-sm text-muted-foreground">{resource.type}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Time Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Start Time
                            </Label>
                            <Input
                                id="startTime"
                                type="datetime-local"
                                name="startTime"
                                defaultValue={getDefaultStartTime()}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endTime" className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                End Time
                            </Label>
                            <Input
                                id="endTime"
                                type="datetime-local"
                                name="endTime"
                                defaultValue={getDefaultEndTime()}
                                required
                            />
                        </div>
                    </div>

                    {/* Requested By */}
                    <div className="space-y-2">
                        <Label htmlFor="requestedBy" className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Requested By
                        </Label>
                        <Input
                            id="requestedBy"
                            type="text"
                            name="requestedBy"
                            placeholder="Enter your name or team"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        className="w-full"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Checking Availability...
                            </>
                        ) : (
                            'Create Booking'
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default BookingForm;