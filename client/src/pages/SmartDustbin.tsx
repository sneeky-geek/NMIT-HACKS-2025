import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Coins, Camera, Check, Copy, RefreshCw, ArrowRight, X } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Html5Qrcode } from "html5-qrcode";
import { Star } from "lucide-react";
import { AnimatePresence } from "framer-motion";

// QR Response data interface
type QRResponse = {
  success: boolean;
  timestamp: string;
  object?: string;
  product_type?: string;
  number_of_items?: number;
  estimated_value?: number;
  recyclable?: string;
  profit_rating_out_of_10?: number;
  coinsEarned?: number;
  isValidFormat: boolean;
  rawContent?: string;
};

const SmartDustbin = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [qrResponse, setQrResponse] = useState<QRResponse | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [processingQR, setProcessingQR] = useState(false);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  
  // Progress bar animation during scanning
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isScanning) {
      setScanProgress(0);
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 80);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isScanning]);
  
  // Clean up scanner on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(error => {
          console.error("Error stopping scanner:", error);
        });
      }
    };
  }, []);
  
  const startScan = async () => {
    setIsScanning(true);
    setCameraError(null);
    
    try {
      // Create a small delay to ensure the DOM is updated with the qr-reader element
      setTimeout(async () => {
        try {
          const qrReaderElement = document.getElementById("qr-reader");
          
          if (!qrReaderElement) {
            throw new Error("QR reader element not found");
          }
          
          const qrScanner = new Html5Qrcode("qr-reader");
          scannerRef.current = qrScanner;
          
          const config = { fps: 10, qrbox: { width: 320, height: 320 } };
          
          await qrScanner.start(
            { facingMode: "environment" },
            config,
            (decodedText) => {
              // Successfully scanned QR code
              handleQrCodeSuccess(decodedText);
              stopScanner();
            },
            (errorMessage) => {
              // QR code scan error (ignore this as it's called frequently during scanning)
            }
          );
        } catch (innerError) {
          console.error("Error in scanner initialization:", innerError);
          setIsScanning(false);
          setCameraError("Could not initialize camera. Please try again.");
        }
      }, 500); // Give DOM time to update
    } catch (error) {
      console.error("Error starting camera:", error);
      setIsScanning(false);
      setCameraError("Could not access camera. Please ensure camera permissions are granted and try again.");
    }
  };
  
  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        // Check if the scanner is scanning using a try-catch since isScanning might not be reliable
        scannerRef.current.stop().catch(error => {
          console.error("Error stopping scanner:", error);
        });
      } catch (error) {
        console.error("Error checking scanner state:", error);
      }
    }
    setIsScanning(false);
  };
  
  // Handle component unmount or page navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopScanner();
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopScanner();
    };
  }, []);
  
  const handleQrCodeSuccess = (decodedText: string) => {
    // Show the processing animation before parsing
    setProcessingQR(true);
    setIsScanning(false);
    
    // Create a delay to show the animation (1.5-2s)
    setTimeout(() => {
      try {
        // Try to parse the QR code content as JSON
        let parsedData;
        try {
          parsedData = JSON.parse(decodedText);
          // Log the raw QR code data
          console.log("Raw QR code data:", decodedText);
        } catch (e) {
          // If the string has single quotes instead of double quotes
          // or other formatting issues, try to fix it
          try {
            // Try to normalize the JSON string if needed
            const normalizedText = decodedText.replace(/'/g, '"')
              .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":');
            parsedData = JSON.parse(normalizedText);
            console.log("Normalized QR code data:", normalizedText);
          } catch {
            throw new Error("Invalid JSON format");
          }
        }
        
        // If parsedData is an array, get the first item
        if (Array.isArray(parsedData)) {
          parsedData = parsedData[0];
        }
        
        // Check if the parsed data has the expected structure for recyclable items
        const isValidFormat = (
          parsedData && 
          typeof parsedData === 'object' &&
          ('object' in parsedData || 'id' in parsedData) && 
          'product_type' in parsedData && 
          'recyclable' in parsedData
        );
        
        if (isValidFormat) {
          // Calculate coins earned based on profit rating and estimated value
          const estimatedValue = Number(parsedData.estimated_value) || 0;
          const profitRating = Number(parsedData.profit_rating_out_of_10) || 0;
          const coinsEarned = Math.max(1, Math.floor((estimatedValue / 100) * (profitRating / 10) * 5)); // Coins based on value and rating
          
          const response: QRResponse = {
            success: true,
            timestamp: new Date().toISOString(),
            object: parsedData.object,
            product_type: parsedData.product_type,
            number_of_items: parsedData.number_of_items,
            estimated_value: parsedData.estimated_value,
            recyclable: parsedData.recyclable,
            profit_rating_out_of_10: parsedData.profit_rating_out_of_10,
            coinsEarned: coinsEarned,
            isValidFormat: true
          };
          
          // Log the parsed response object to console
          console.log("Parsed QR response:", response);
          
          setQrResponse(response);
          setScanned(true);
          
          const isRecyclable = parsedData.recyclable?.toLowerCase() === 'yes';
          
          toast({
            title: isRecyclable ? "Item is Recyclable! ♻️" : "Item is Not Recyclable ❌",
            description: isRecyclable ? 
              `You earned ${coinsEarned} Civic Coins for recycling ${parsedData.object}.` :
              `This item cannot be recycled. Please dispose properly.`,
            variant: isRecyclable ? "default" : "destructive"
          });
        } else {
          // JSON format but missing required fields
          const response: QRResponse = {
            success: false,
            timestamp: new Date().toISOString(),
            isValidFormat: false,
            rawContent: decodedText
          };
          
          setQrResponse(response);
          setScanned(true);
          
          toast({
            title: "Invalid QR Format",
            description: "The QR code doesn't contain the expected product information.",
            variant: "destructive"
          });
        }
      } catch (error) {
        // If the QR code doesn't contain valid JSON
        console.log("Scanned non-JSON QR code:", decodedText);
        
        // Create a response object for invalid data
        const response: QRResponse = {
          success: false,
          timestamp: new Date().toISOString(),
          isValidFormat: false,
          rawContent: decodedText
        };
        
        setQrResponse(response);
        setScanned(true);
        
        toast({
          title: "No Data Found",
          description: "The QR code does not contain valid data.",
          variant: "destructive"
        });
      }
      
      // Hide the processing animation
      setProcessingQR(false);
    }, 2000); // 2 second delay for animation
  };
  
  const resetScan = () => {
    setScanned(false);
    setQrResponse(null);
    setCameraError(null);
    setProcessingQR(false);
  };
  


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/5">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container px-4 mx-auto">
          {/* Page header with animation */}
          <motion.div 
            className="max-w-4xl mx-auto mb-10 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-4 px-3 py-1 text-sm bg-primary/5">
              Earn Civic Coins
            </Badge>
            <h1 className="text-4xl font-bold mb-3 font-poppins">Smart Dustbin</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Scan QR codes on smart bins to earn rewards for proper waste disposal and contribute to a cleaner community.
            </p>
          </motion.div>
          
          {/* How it works section */}
          <motion.div 
            className="max-w-4xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="border-primary/10 shadow-md bg-card/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl font-poppins">How It Works</CardTitle>
                <CardDescription className="text-base">
                  Our smart dustbins help promote proper waste disposal while rewarding your civic actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <motion.div 
                    className="flex flex-col items-center text-center p-5 rounded-xl hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 mb-4 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
                      <Trash2 className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg">Find a Smart Bin</h3>
                    <p className="text-muted-foreground">Locate a CiviX smart dustbin in your area</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center text-center p-5 rounded-xl hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 mb-4 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
                      <Camera className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg">Scan the QR Code</h3>
                    <p className="text-muted-foreground">Scan the bin's QR code after disposing your waste</p>
                  </motion.div>
                  
                  <motion.div 
                    className="flex flex-col items-center text-center p-5 rounded-xl hover:bg-primary/5 transition-colors"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-14 h-14 mb-4 bg-primary/10 rounded-full flex items-center justify-center shadow-sm">
                      <Coins className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2 text-lg">Earn Civic Coins</h3>
                    <p className="text-muted-foreground">Get rewarded with Civic Coins for your contribution</p>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Scanner section */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
                <Card className="border-primary/10 shadow-lg bg-card/60 backdrop-blur-sm">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl font-poppins">QR Code Scanner</CardTitle>
                    <CardDescription className="text-base">
                      Scan a smart dustbin QR code to earn Civic Coins
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-72 h-72 bg-muted rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
                      {isScanning ? (
                        <>
                          <div id="qr-reader" className="w-full h-full absolute inset-0" ref={scannerContainerRef}></div>
                          <div className="absolute inset-0 border-2 border-primary/50 rounded-lg pointer-events-none">
                            <div className="absolute inset-x-0 top-0">
                              <Progress value={scanProgress} className="h-1 rounded-none bg-primary/20" />
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 z-10">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white"
                              onClick={stopScanner}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="absolute bottom-2 left-0 right-0 text-center z-10 text-white bg-black/30 py-1 text-sm">
                            Point camera at QR code
                          </div>
                        </>
                      ) : processingQR ? (
                        <AnimatePresence>
                          <motion.div 
                            className="flex flex-col items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div 
                              className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full"
                              animate={{ rotate: 360 }}
                              transition={{ 
                                duration: 1.5, 
                                repeat: Infinity, 
                                ease: "linear" 
                              }}
                            />
                            <motion.div 
                              className="mt-4 text-lg font-medium text-primary"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              Processing QR...
                            </motion.div>
                            <motion.div 
                              className="mt-2 text-sm text-muted-foreground"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.6 }}
                            >
                              Checking recyclability
                            </motion.div>
                          </motion.div>
                        </AnimatePresence>
                      ) : scanned && qrResponse ? (
                        <div className="text-center p-4">
                          {qrResponse.isValidFormat ? (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              {qrResponse.recyclable?.toLowerCase() === 'yes' ? (
                                <>
                                  <motion.div 
                                    className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                  >
                                    <Check className="h-8 w-8 text-green-600" />
                                  </motion.div>
                                  <motion.p 
                                    className="text-xl font-semibold mb-2"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    Recyclable
                                  </motion.p>
                                  <motion.p 
                                    className="text-2xl font-bold text-primary mb-3"
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    +{qrResponse.estimated_value} Coins
                                  </motion.p>
                                  <motion.div 
                                    className="flex flex-col gap-2 w-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">Object:</span>
                                      <span className="font-medium">{qrResponse.object}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">Product Type:</span>
                                      <Badge variant="outline" className="bg-primary/5 text-primary">
                                        {qrResponse.product_type}
                                      </Badge>
                                    </div>
                                    
                                    <div className="flex items-center justify-between bg-green-50 p-2 rounded-md mt-2">
                                      <span className="text-sm font-medium text-green-600">Wallet Update:</span>
                                      <span className="font-bold text-green-600">+{qrResponse.estimated_value} Coins Added</span>
                                    </div>
                                  </motion.div>
                                </>
                              ) : (
                                <>
                                  <motion.div 
                                    className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                                  >
                                    <X className="h-8 w-8 text-red-600" />
                                  </motion.div>
                                  <motion.p 
                                    className="text-xl font-semibold mb-2 text-red-600"
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                  >
                                    Not Recyclable
                                  </motion.p>
                                  <motion.p 
                                    className="text-base text-muted-foreground mb-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                  >
                                    This item cannot be recycled
                                  </motion.p>
                                  <motion.div 
                                    className="flex flex-col gap-2 w-full"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">Object:</span>
                                      <span className="font-medium">{qrResponse.object}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm text-muted-foreground">Product Type:</span>
                                      <Badge variant="outline" className="bg-destructive/10 text-destructive">
                                        {qrResponse.product_type}
                                      </Badge>
                                    </div>
                                    <div className="mt-2 flex justify-center">
                                      <Button variant="outline" className="text-red-600 border-red-200">
                                        Learn Why
                                      </Button>
                                    </div>
                                  </motion.div>
                                </>
                              )}
                            </motion.div>
                          ) : (
                            <>
                              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <X className="h-8 w-8 text-destructive" />
                              </div>
                              <p className="text-xl font-semibold mb-2">Invalid QR Code</p>
                              <p className="text-base text-muted-foreground mb-2">The QR code doesn't contain valid product data</p>
                            </>
                          )}
                          
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground p-6 bg-gradient-to-br from-white/50 via-white/30 to-purple-50/20 dark:from-zinc-900/50 dark:via-purple-900/10 dark:to-zinc-900/50 backdrop-blur-sm border-2 border-purple-800/20 dark:border-purple-600/20 rounded-xl shadow-[0_0_15px_rgba(124,58,237,0.05)] dark:shadow-[0_0_15px_rgba(124,58,237,0.1)]" ref={scannerContainerRef}>
                          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                            <Camera className="h-8 w-8 text-primary/70" />
                          </div>
                          <p className="text-lg font-medium text-foreground">Camera access required</p>
                          <p className="text-sm mt-2 text-muted-foreground">Click "Scan QR" to open camera</p>
                          {cameraError && (
                            <div className="mt-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm border border-destructive/20 shadow-sm">
                              {cameraError}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center pb-6">
                    {scanned ? (
                      <Button 
                        onClick={resetScan} 
                        className="px-6 py-6 h-auto text-base font-medium"
                        variant="outline"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" /> Scan Another QR
                      </Button>
                    ) : (
                      <Button 
                        onClick={startScan} 
                        disabled={isScanning}
                        className="px-6 py-6 h-auto text-base font-medium"
                      >
                        {isScanning ? (
                          <>
                            <div className="mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            Accessing Camera...
                          </>
                        ) : (
                          <>
                            <Camera className="mr-2 h-4 w-4" /> Scan QR
                          </>
                        )}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
          </motion.div>
        </div>
      </main>
      
      <footer className="py-8 border-t mt-12 bg-background">
        <div className="container px-4 mx-auto">
          <div className="text-center text-sm text-muted-foreground">
            © 2025 CiviX. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SmartDustbin;
