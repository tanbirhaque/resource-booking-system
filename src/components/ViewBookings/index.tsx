import { Booking, bookingApi, Resource } from "@/lib/booking-api";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, Calendar, Clock, Filter, MapPin, RefreshCw, Trash2, User } from "lucide-react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";


interface BookingDashboardProps {
    refreshTrigger: number;
}


const ViewBookings = ({ refreshTrigger }: BookingDashboardProps) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        resource: '',
        date: '',
    });
    // const { toast } = useToast();

    useEffect(() => {
        loadData();
    }, [refreshTrigger]);

    useEffect(() => {
        loadBookings();
    }, [filters]);

    const loadData = async () => {
        await Promise.all([loadResources(), loadBookings()]);
    };

    const loadResources = async () => {
        try {
            const resourceList = await bookingApi.getResources();
            setResources(resourceList);
        } catch (error) {
            console.error('Failed to load resources:', error);
        }
    };

    const loadBookings = async () => {
        setLoading(true);
        try {
            const bookingList = await bookingApi.getBookings(filters.resource || filters.date ? filters : undefined);
            setBookings(bookingList);
        } catch (error) {
            console.error('Failed to load bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBooking = async (bookingId: string, resourceName: string) => {
        try {
            const result = await bookingApi.deleteBooking(bookingId);
            if (result.success) {
                // toast({
                //     title: "Booking Cancelled",
                //     description: `Cancelled booking for ${resourceName}`,
                // });
                loadBookings();
            } else {
                // toast({
                //     title: "Error",
                //     description: result.error || "Failed to cancel booking",
                //     variant: "destructive",
                // });
            }
        } catch (error) {
            // toast({
            //     title: "Error",
            //     description: "An unexpected error occurred",
            //     variant: "destructive",
            // });
        }
    };

    const clearFilters = () => {
        setFilters({ resource: '', date: '' });
    };

    const formatDateTime = (isoString: string) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };
    // Group bookings by resource
    const groupedBookings = bookings.reduce((acc, booking) => {
        if (!acc[booking.resourceId]) {
            acc[booking.resourceId] = {
                resourceName: booking.resourceName,
                bookings: []
            };
        }
        acc[booking.resourceId].bookings.push(booking);
        return acc;
    }, {} as Record<string, { resourceName: string; bookings: Booking[] }>);

    return (
        <div className="w-full max-w-6xl space-y-6">
            {/* Header and Filters */}
            <Card>
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-primary" />
                                Booking Dashboard
                            </CardTitle>
                            <CardDescription>
                                Manage and view all resource bookings
                            </CardDescription>
                        </div>
                        <Button onClick={loadBookings} variant="outline" size="sm">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-4">
                        <div className="flex-1">
                            <Select value={filters.resource} onValueChange={(value) => setFilters(prev => ({ ...prev, resource: value }))}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filter by resource" />
                                </SelectTrigger>
                                <SelectContent>
                                    {resources.map((resource) => (
                                        <SelectItem key={resource.id} value={resource.id}>
                                            {resource.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex-1">
                            <Input
                                type="date"
                                value={filters.date}
                                onChange={(e) => setFilters(prev => ({ ...prev, date: e.target.value }))}
                                placeholder="Filter by date"
                            />
                        </div>

                        <Button onClick={clearFilters} variant="outline">
                            <Filter className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    </div>

                    {(filters.resource || filters.date) && (
                        <Alert className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Showing filtered results. {bookings.length} booking(s) found.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

            {/* Bookings Display */}
            {loading ? (
                <div className="flex items-center justify-center p-8">
                    <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                    Loading bookings...
                </div>
            ) : Object.keys(groupedBookings).length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center p-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No Bookings Found</h3>
                        <p className="text-muted-foreground text-center">
                            {filters.resource || filters.date
                                ? 'No bookings match your current filters.'
                                : 'There are no bookings yet. Create your first booking above!'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(groupedBookings).map(([resourceId, { resourceName, bookings: resourceBookings }]) => (
                        <Card key={resourceId}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    {resourceName}
                                    <Badge variant="outline" className="ml-auto">
                                        {resourceBookings.length} booking{resourceBookings.length !== 1 ? 's' : ''}
                                    </Badge>
                                </CardTitle>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    {resourceBookings.map((booking) => (
                                        <div
                                            key={booking.id}
                                            className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="space-y-2 md:space-y-0 md:flex md:items-center md:space-x-6 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-muted-foreground">{booking.requestedBy}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 mt-3 md:mt-0">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleDeleteBooking(booking.id, booking.resourceName)}
                                                    className="text-destructive hover:text-destructive"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ViewBookings;