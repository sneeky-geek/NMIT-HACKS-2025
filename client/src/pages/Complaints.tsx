import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertCircle,
  Camera,
  Check,
  Clock,
  Image,
  LoaderCircle,
  MapPin,
  PlusCircle,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define complaint schema
const complaintSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  address: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
});

interface Complaint {
  _id: string;
  title: string;
  description: string;
  image: string;
  address: string;
  location: {
    lat: number | null;
    long: number | null;
  };
  date: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  statusUpdates: {
    status: string;
    comment: string;
    updatedAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const Complaints = () => {
  const { user, isAuthenticated, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("submit");
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fetchingComplaints, setFetchingComplaints] = useState(true);
  const [deletingComplaintId, setDeletingComplaintId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<z.infer<typeof complaintSchema>>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: "",
      description: "",
      address: "",
    },
  });

  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch user's complaints when viewing history
    if (activeTab === "history") {
      fetchUserComplaints();
    }
  }, [isAuthenticated, navigate, activeTab, token]);

  // Fetch user complaints from API
  const fetchUserComplaints = async () => {
    setFetchingComplaints(true);
    try {
      if (!token) return;

      const response = await fetch("https://civix-backend.onrender.com/api/complaints/my-complaints", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      } else {
        console.error("Failed to fetch complaints");
        toast({
          title: "Error",
          description: "Failed to load your complaints. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching complaints:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setFetchingComplaints(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Maximum file size is 5MB",
          variant: "destructive",
        });
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file",
          variant: "destructive",
        });
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
    }
  };

  // Remove selected image
  const removeImage = () => {
    setFilePreview(null);
    setSelectedFile(null);
  };

  // Use browser geolocation API
  const getLocation = () => {
    setIsLoading(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // Get address from coordinates using reverse geocoding
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Use Nominatim for reverse geocoding (free service)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
              {
                headers: {
                  "Accept-Language": "en-US,en",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const address = data.display_name;
              form.setValue("address", address);
            }
          } catch (error) {
            console.error("Error getting address:", error);
            toast({
              title: "Location Error",
              description:
                "We couldn't determine your address. Please enter it manually.",
              variant: "destructive",
            });
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast({
            title: "Location Error",
            description:
              "Could not access your location. Please enter address manually.",
            variant: "destructive",
          });
          setIsLoading(false);
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof complaintSchema>) => {
    if (!selectedFile) {
      toast({
        title: "Image required",
        description: "Please upload an image of the issue.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("image", selectedFile); // This will be stored as Buffer in DB

      // Get location coordinates if available
      let locationPromise = Promise.resolve(null);
      if ("geolocation" in navigator) {
        locationPromise = new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              formData.append("lat", position.coords.latitude.toString());
              formData.append("long", position.coords.longitude.toString());
              resolve(true);
            },
            (error) => {
              console.log("Geolocation error:", error);
              resolve(null); // Continue without coordinates
            },
            { timeout: 5000 } // Timeout after 5 seconds
          );
        });
      }

      // Wait for geolocation data (or timeout) before submitting
      await locationPromise;

      const response = await fetch("https://civix-backend.onrender.com/api/complaints", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: "Your complaint has been submitted successfully!",
          variant: "default",
        });

        // Reset form
        form.reset();
        setFilePreview(null);
        setSelectedFile(null);
        
        // Switch to history tab
        setActiveTab("history");
        fetchUserComplaints();
      } else {
        const errorData = await response.json();
        toast({
          title: "Submission failed",
          description: errorData.message || "Failed to submit your complaint.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get status badge variant
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "in-progress":
        return "default";
      case "resolved":
        return "outline";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Format relative date
  const formatRelativeDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "PPP p"); // Format like "April 29th, 2022 at 3:45 PM"
    } catch (error) {
      return dateString;
    }
  };

  // Handle complaint deletion
  const handleDelete = async (complaintId: string) => {
    if (!token || isDeleting) return;
    
    setIsDeleting(true);
    setDeletingComplaintId(complaintId);
    
    try {
      const response = await fetch(`https://civix-backend.onrender.com/api/complaints/${complaintId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Remove the deleted complaint from state
        setComplaints(complaints.filter(c => c._id !== complaintId));
        toast({
          title: "Success",
          description: "Your complaint has been deleted successfully.",
          variant: "default",
        });
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to delete the complaint.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting complaint:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setDeletingComplaintId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Community Issues</h1>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/missions")}
            >
              Back to Missions
            </Button>
          </div>
        </div>

        <Tabs
          defaultValue="submit"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="submit">Report an Issue</TabsTrigger>
            <TabsTrigger value="history">My Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="submit">
            <Card>
              <CardHeader>
                <CardTitle>Report a Community Issue</CardTitle>
                <CardDescription>
                  Help improve your community by reporting issues you encounter.
                  Include a photo and location details for faster resolution.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issue Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g., Broken Street Light, Pothole, etc."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe the issue in detail"
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="space-y-4">
                      <div>
                        <FormLabel className="block mb-2">
                          Image of the Issue
                        </FormLabel>
                        {!filePreview ? (
                          <div className="border border-dashed rounded-lg p-8 text-center bg-muted/50">
                            <div className="flex flex-col items-center gap-2">
                              <Camera className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground mb-2">
                                Take a photo of the issue
                              </p>
                              <Input
                                id="image"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileChange}
                              />
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    document.getElementById("image")?.click()
                                  }
                                >
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Image
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative">
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="rounded-lg w-full max-h-[300px] object-cover"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute top-2 right-2 h-8 w-8"
                              onClick={removeImage}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between">
                              <FormLabel>Location</FormLabel>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                disabled={isLoading}
                                onClick={getLocation}
                                className="h-8 text-xs"
                              >
                                {isLoading ? (
                                  <LoaderCircle className="h-3 w-3 mr-1 animate-spin" />
                                ) : (
                                  <MapPin className="h-3 w-3 mr-1" />
                                )}
                                Use My Location
                              </Button>
                            </div>
                            <FormControl>
                              <Textarea
                                placeholder="Enter the location of the issue"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Provide the address or location details where the
                              issue was found
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full sm:w-auto"
                      >
                        {isSubmitting ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <PlusCircle className="mr-2 h-4 w-4" /> Submit
                            Report
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            {fetchingComplaints ? (
              <div className="flex justify-center items-center py-12">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : complaints.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                  <h3 className="text-xl font-medium mb-2">No reports yet</h3>
                  <p className="text-muted-foreground text-center max-w-md mb-6">
                    You haven't submitted any issue reports yet. When you do,
                    they'll appear here.
                  </p>
                  <Button onClick={() => setActiveTab("submit")}>
                    Report an Issue
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {complaints.map((complaint) => (
                  <Card
                    key={complaint._id}
                    className="overflow-hidden transition-all hover:shadow-md"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={`https://civix-backend.onrender.com/api/complaints/${complaint._id}/image`}
                        alt={complaint.title}
                        className="w-full h-full object-cover transition-all hover:scale-105"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">
                          {complaint.title}
                        </CardTitle>
                        <Badge variant={getStatusVariant(complaint.status)}>
                          {complaint.status
                            .replace("-", " ")
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {complaint.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-4 space-y-3 text-sm">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{complaint.address}</span>
                      </div>
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>Reported {formatRelativeDate(complaint.createdAt)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0 flex justify-between">
                      <div className="flex items-center">
                        {complaint.status === "resolved" ? (
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="h-4 w-4 mr-1" /> Resolved{" "}
                            {complaint.statusUpdates.find(
                              (update) => update.status === "resolved"
                            )?.updatedAt &&
                              formatRelativeDate(
                                complaint.statusUpdates.find(
                                  (update) => update.status === "resolved"
                                )?.updatedAt as string
                              )}
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            {complaint.statusUpdates.length > 0
                              ? `Last updated ${formatRelativeDate(
                                  complaint.statusUpdates[
                                    complaint.statusUpdates.length - 1
                                  ].updatedAt
                                )}`
                              : `Submitted on ${formatDate(
                                  complaint.createdAt
                                )}`}
                          </div>
                        )}
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-8 w-8"
                            title="Delete complaint"
                            disabled={isDeleting && deletingComplaintId === complaint._id}
                          >
                            {isDeleting && deletingComplaintId === complaint._id ? (
                              <LoaderCircle className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Complaint</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this complaint? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={(e) => {
                                e.preventDefault();
                                handleDelete(complaint._id);
                              }}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Complaints;
