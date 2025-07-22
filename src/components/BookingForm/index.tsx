import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Calendar, Clock, Loader2, MapPin, User } from "lucide-react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { bookingApi, Resource, BookingRequest } from '@/lib/booking-api';

interface BookingFormProps {
    onBookingCreated: () => void;
}

const BookingForm = ({ onBookingCreated }: BookingFormProps) => {
    const [resources, setResources] = useState<Resource[]>([]);
    const [formData, setFormData] = useState<BookingRequest>({
        resourceId: '',
        startTime: '',
        endTime: '',
        requestedBy: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    // const { toast } = useToast();

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await bookingApi.createBooking(formData);

            if (result.success) {
                // toast({
                //     title: "Booking Created",
                //     description: `Successfully booked ${result.booking?.resourceName}`,
                // });

                // Reset form
                setFormData({
                    resourceId: '',
                    startTime: '',
                    endTime: '',
                    requestedBy: '',
                });

                // onBookingCreated();
            } else {
                setError(result.error || 'Failed to create booking');
            }
        } catch (err) {
            setError('An unexpected error occurred');
            console.error('Booking error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof BookingRequest, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (error) setError(''); // Clear error when user starts typing
    };

    // Generate default datetime values (current time rounded to next 15 minutes)
    const getDefaultStartTime = () => {
        const now = new Date();
        const minutes = Math.ceil(now.getMinutes() / 15) * 15;
        now.setMinutes(minutes, 0, 0);
        return now.toISOString().slice(0, 16);
    };

    const getDefaultEndTime = () => {
        const now = new Date();
        const minutes = Math.ceil(now.getMinutes() / 15) * 15;
        now.setMinutes(minutes + 60, 0, 0); // Default 1 hour duration
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
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )} */}

                    {/* Resource Selection */}
                    <div className="space-y-2">
                        <Label htmlFor="resource" className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Resource
                        </Label>
                        <Select
                            value={formData.resourceId}
                            onValueChange={(value) => handleInputChange('resourceId', value)}
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
                                value={formData.startTime || getDefaultStartTime()}
                                onChange={(e) => handleInputChange('startTime', e.target.value)}
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
                                value={formData.endTime || getDefaultEndTime()}
                                onChange={(e) => handleInputChange('endTime', e.target.value)}
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
                            placeholder="Enter your name or team"
                            value={formData.requestedBy}
                            onChange={(e) => handleInputChange('requestedBy', e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading || !formData.resourceId || !formData.requestedBy}
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