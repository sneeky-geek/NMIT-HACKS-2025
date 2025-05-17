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

// QR Response data interface
interface QRResponse {
  success: boolean;
  timestamp: string;
  product_name?: string;
  product_type?: string;
  estimated_value_inr?: number;
  coinsEarned?: number;
  isValidFormat: boolean;
  rawContent?: string;
}

const SmartDustbin = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [activeTab, setActiveTab] = useState("scanner");
  const [scanProgress, setScanProgress] = useState(0);
  const [qrResponse, setQrResponse] = useState<QRResponse | null>(null);
  const [jsonCopied, setJsonCopied] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
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
          
          const config = { fps: 10, qrbox: { width: 250, height: 250 } };
          
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
    try {
      // Try to parse the QR code content as JSON
      const parsedData = JSON.parse(decodedText);
      
      // Check if the parsed data has the expected structure
      const isValidFormat = (
        parsedData && 
        typeof parsedData === 'object' &&
        'product_name' in parsedData && 
        'product_type' in parsedData && 
        'estimated_value_inr' in parsedData
      );
      
      if (isValidFormat) {
        // Calculate coins earned based on estimated value
        const estimatedValue = Number(parsedData.estimated_value_inr) || 0;
        const coinsEarned = Math.max(1, Math.floor(estimatedValue / 100)); // 1 coin per 100 INR value, minimum 1 coin
        
        const response: QRResponse = {
          success: true,
          timestamp: new Date().toISOString(),
          product_name: parsedData.product_name,
          product_type: parsedData.product_type,
          estimated_value_inr: parsedData.estimated_value_inr,
          coinsEarned: coinsEarned,
          isValidFormat: true
        };
        
        setQrResponse(response);
        setScanned(true);
        
        toast({
          title: "QR Code Scanned Successfully!",
          description: `You earned ${coinsEarned} Civic Coins for recycling ${parsedData.product_name}.`
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
  };
  
  const resetScan = () => {
    setScanned(false);
    setQrResponse(null);
    setJsonCopied(false);
    setCameraError(null);
  };
  
  const copyJsonToClipboard = () => {
    if (qrResponse) {
      navigator.clipboard.writeText(JSON.stringify(qrResponse, null, 2));
      setJsonCopied(true);
      setTimeout(() => setJsonCopied(false), 2000);
    }
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
          
          {/* Scanner and JSON response section */}
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs defaultValue="scanner" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="scanner" className="text-base py-3">
                  <Camera className="mr-2 h-4 w-4" /> QR Scanner
                </TabsTrigger>
                <TabsTrigger value="response" className="text-base py-3" disabled={!qrResponse}>
                  <ArrowRight className="mr-2 h-4 w-4" /> Response Data
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="scanner" className="mt-0">
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
                      ) : scanned && qrResponse ? (
                        <div className="text-center p-4">
                          {qrResponse.isValidFormat ? (
                            <>
                              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <Check className="h-8 w-8 text-primary" />
                              </div>
                              <p className="text-xl font-semibold mb-2">Scan Successful!</p>
                              <p className="text-2xl font-bold text-primary mb-1">+{qrResponse.coinsEarned} Coins</p>
                              <div className="flex items-center justify-center gap-2 mt-2">
                                <Badge variant="outline" className="bg-primary/5 text-primary">
                                  {qrResponse.product_type}
                                </Badge>
                                <Badge variant="outline" className="bg-secondary/30">
                                  ₹{qrResponse.estimated_value_inr}
                                </Badge>
                              </div>
                              <p className="text-sm font-medium mt-2">{qrResponse.product_name}</p>
                              <p className="text-sm text-muted-foreground mt-1">Thank you for your recycling effort</p>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                                <X className="h-8 w-8 text-destructive" />
                              </div>
                              <p className="text-xl font-semibold mb-2">Invalid QR Code</p>
                              <p className="text-base text-muted-foreground mb-2">The QR code doesn't contain valid product data</p>
                            </>
                          )}
                          <Button 
                            variant="link" 
                            size="sm" 
                            onClick={() => setActiveTab("response")}
                            className="mt-2"
                          >
                            View Response Data <ArrowRight className="ml-1 h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground p-4" ref={scannerContainerRef}>
                          <Camera className="h-12 w-12 mx-auto mb-3 text-primary/70" />
                          <p className="text-lg">Camera access required</p>
                          <p className="text-sm mt-2">Click "Scan QR" to open camera</p>
                          {cameraError && (
                            <div className="mt-4 p-2 bg-destructive/10 text-destructive rounded-md text-sm">
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
              </TabsContent>
              
              <TabsContent value="response" className="mt-0">
                <Card className="border-primary/10 shadow-lg bg-card/60 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle className="text-2xl font-poppins">QR Response Data</CardTitle>
                        <CardDescription className="text-base">
                          JSON response from the smart dustbin scan
                        </CardDescription>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={copyJsonToClipboard}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {jsonCopied ? "Copied!" : "Copy JSON"}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {qrResponse && (
                      <div className="relative">
                        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-96 overflow-y-auto">
                          {JSON.stringify(qrResponse, null, 2)}
                        </pre>
                        <div className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-md opacity-70">
                          JSON
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="ghost" 
                      onClick={() => setActiveTab("scanner")}
                    >
                      Back to Scanner
                    </Button>
                    <Button 
                      onClick={resetScan}
                      variant="outline"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Scan New Code
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
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
