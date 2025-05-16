
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash, Coins, Camera, Check } from "lucide-react";

const SmartDustbin = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [coinsEarned, setCoinsEarned] = useState(0);
  
  const startScan = () => {
    setIsScanning(true);
    
    // Simulate QR code scanning with timeout
    setTimeout(() => {
      setIsScanning(false);
      setScanned(true);
      
      // Random coins between 1-5
      const coins = Math.floor(Math.random() * 5) + 1;
      setCoinsEarned(coins);
      
      toast({
        title: "QR Code Scanned Successfully!",
        description: `You earned ${coins} Civic Coins for proper waste disposal.`
      });
    }, 2000);
  };
  
  const resetScan = () => {
    setScanned(false);
    setCoinsEarned(0);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Smart Dustbin</h1>
            <p className="text-muted-foreground mb-8">
              Scan QR codes on smart bins to earn rewards for proper waste disposal
            </p>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
                <CardDescription>
                  Our smart dustbins help promote proper waste disposal while rewarding your civic actions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Trash className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Find a Smart Bin</h3>
                    <p className="text-sm text-muted-foreground">Locate a CiviX smart dustbin in your area</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Camera className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Scan the QR Code</h3>
                    <p className="text-sm text-muted-foreground">Scan the bin's QR code after disposing your waste</p>
                  </div>
                  
                  <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                      <Coins className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Earn Civic Coins</h3>
                    <p className="text-sm text-muted-foreground">Get rewarded with Civic Coins for your contribution</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="text-center">
                <CardTitle>QR Code Scanner</CardTitle>
                <CardDescription>
                  Scan a smart dustbin QR code to earn Civic Coins
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="w-64 h-64 bg-muted rounded-lg mb-6 flex items-center justify-center relative">
                  {isScanning ? (
                    <>
                      <div className="absolute inset-0 border-2 border-primary animate-pulse rounded-lg"></div>
                      <div className="text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
                        <p>Scanning...</p>
                      </div>
                    </>
                  ) : scanned ? (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-xl font-semibold mb-2">Scan Successful!</p>
                      <p className="text-2xl font-bold text-primary mb-1">+{coinsEarned} Coins</p>
                      <p className="text-sm text-muted-foreground">Thank you for your civic action</p>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Camera className="h-10 w-10 mx-auto mb-2" />
                      <p>Camera preview will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                {scanned ? (
                  <Button onClick={resetScan}>
                    Scan Another Code
                  </Button>
                ) : (
                  <Button onClick={startScan} disabled={isScanning}>
                    {isScanning ? "Scanning..." : "Start Scanning"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="py-8 border-t mt-12">
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
