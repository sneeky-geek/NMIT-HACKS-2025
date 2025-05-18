import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import axios from "axios";
import { 
  FileUp, 
  Link as LinkIcon, 
  SearchCheck, 
  ShieldAlert, 
  Lightbulb, 
  ArrowRight, 
  Check, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const FactCheck = () => {
  const [activeTab, setActiveTab] = useState<string>("text");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState<string>("");
  const [verificationResult, setVerificationResult] = useState<{
    verdict: string;
    confidence: number;
    reason: string;
    sources: Record<string, string>;
    detected_language: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Selected",
        description: `${file.name} is ready for analysis`,
        variant: "default",
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] || null;
    if (file) {
      setUploadedFile(file);
      toast({
        title: "File Dropped",
        description: `${file.name} is ready for analysis`,
        variant: "default",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    setError(null);
    setVerificationResult(null);
    
    try {
      let response;
      
      if (activeTab === "text") {
        // Text-only verification
        response = await axios.post("http://127.0.0.1:8000/api/analyze", {
          text: textInput,
          image_url: "", // Optional, leaving empty
          target_language: "en" // Default to English
        });
      } else {
        // Text with media verification
        const formData = new FormData();
        if (uploadedFile) {
          formData.append("image", uploadedFile);
        }
        formData.append("text", textInput || ""); // Text might be empty for image-only analysis
        
        response = await axios.post("http://127.0.0.1:8000/api/analyze/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
      }
      
      setVerificationResult(response.data);
      toast({
        title: "Analysis Complete",
        description: "Results are ready for review",
        variant: "default",
      });
    } catch (err) {
      console.error("Error during fact verification:", err);
      setError(err instanceof Error ? err.message : "An error occurred during verification");
      toast({
        title: "Verification Failed",
        description: "Could not complete the fact verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetForm = () => {
    setUploadedFile(null);
    setTextInput("");
    setVerificationResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        when: "beforeChildren", 
        staggerChildren: 0.1 
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      transition: { 
        duration: 0.3 
      } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const glowVariants = {
    inactive: { 
      boxShadow: "0 0 0 rgba(124, 58, 237, 0)" 
    },
    active: { 
      boxShadow: "0 0 20px rgba(124, 58, 237, 0.5)",
      transition: { 
        duration: 1.5, 
        repeat: Infinity, 
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="text-primary">Fact</span>Check
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verify the authenticity of news articles, images, and claims using our AI-powered fact-checking tool.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto"
        >
          <Card className="relative overflow-hidden backdrop-blur-sm border-[3px] border-purple-800/40 dark:border-purple-600/40 shadow-[0_0_20px_rgba(124,58,237,0.15)] dark:shadow-[0_0_25px_rgba(124,58,237,0.2)] bg-gradient-to-br from-white/50 via-white/30 to-purple-50/20 dark:from-zinc-900/50 dark:via-purple-900/10 dark:to-zinc-900/50 ring-2 ring-purple-500/10 dark:ring-purple-400/10 ring-offset-2 ring-offset-background">
            <div className="absolute inset-px rounded-lg border-[3px] border-purple-500/5 dark:border-purple-400/5">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-center">Verify Content</CardTitle>
              
            </CardHeader>

            </div>
            <CardContent className="p-6 relative">
              <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="text" className="flex items-center gap-2">
                    <SearchCheck className="h-4 w-4" />
                    <span>Text Only</span>
                  </TabsTrigger>
                  <TabsTrigger value="media" className="flex items-center gap-2">
                    <FileUp className="h-4 w-4" />
                    <span>Text + Media</span>
                  </TabsTrigger>
                </TabsList>

                <AnimatePresence mode="wait">
                  {activeTab === "media" && (
                    <TabsContent value="media" className="mt-0 space-y-4">
                      <motion.div
                        key="upload-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="space-y-6">
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              Enter text to analyze along with media
                            </label>
                            <Textarea
                              placeholder="Enter news, claim or statement to fact-check..."
                              value={textInput}
                              onChange={(e) => setTextInput(e.target.value)}
                              className="min-h-[100px] resize-none"
                            />
                            <p className="text-sm text-muted-foreground mt-2">
                              Provide context or text content that relates to your media
                            </p>
                          </div>

                          <div className="mt-4">
                            <label className="text-sm font-medium mb-2 block">
                              Upload supporting media
                            </label>
                            <div 
                              className={cn(
                                "border-2 border-dashed rounded-lg p-6 transition-all",
                                "flex flex-col items-center justify-center gap-4 text-center",
                                "hover:border-primary/50 cursor-pointer bg-muted/30",
                                uploadedFile ? "border-primary/50" : "border-muted-foreground/25"
                              )}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <motion.div 
                                className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center"
                                variants={glowVariants}
                                animate={uploadedFile ? "active" : "inactive"}
                              >
                                <FileUp className="h-7 w-7 text-primary" />
                              </motion.div>
                              
                              <div>
                                {uploadedFile ? (
                                  <>
                                    <p className="font-medium mb-1">File selected:</p>
                                    <Badge variant="outline" className="px-3 py-1 bg-primary/10">
                                      {uploadedFile.name}
                                    </Badge>
                                  </>
                                ) : (
                                  <>
                                    <p className="font-medium mb-1">
                                      Drop media file here or click to browse
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Supports images, PDFs, and documents
                                    </p>
                                  </>
                                )}
                              </div>
                              <input
                                ref={fileInputRef}
                                type="file"
                                className="hidden"
                                accept="image/*,.pdf,.doc,.docx"
                                onChange={handleFileChange}
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </TabsContent>
                  )}



                  {activeTab === "text" && (
                    <TabsContent value="text" className="mt-0 space-y-4">
                      <motion.div
                        key="text-tab"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="space-y-4">
                          <label className="text-sm font-medium">
                            Paste text to analyze
                          </label>
                          <Textarea
                            placeholder="Enter news snippet, claim or statement to fact-check..."
                            value={textInput}
                            onChange={(e) => setTextInput(e.target.value)}
                            className="min-h-[150px] resize-none"
                          />
                          <p className="text-sm text-muted-foreground">
                            The longer and more detailed the text, the more accurate our analysis will be
                          </p>
                        </div>
                      </motion.div>
                    </TabsContent>
                  )}
                </AnimatePresence>

                <div className="mt-6 flex items-center justify-end gap-3">
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={
                      isProcessing || 
                      (activeTab === "media" && (!uploadedFile || !textInput)) ||
                      (activeTab === "text" && !textInput)
                    }
                    className="relative overflow-hidden group"
                  >
                    <span className="flex items-center gap-2">
                      {isProcessing ? (
                        <>
                          <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Verify
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </span>
                  </Button>
                </div>

                {/* Results Display Section */}
                <AnimatePresence>
                  {verificationResult && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 border rounded-lg p-6 bg-card/50 backdrop-blur-sm"
                    >
                      <h3 className="text-xl font-semibold mb-4 flex items-center">
                        <span className="mr-2">Verification Results</span>
                        <Badge className={cn(
                          "ml-2",
                          verificationResult.verdict.toLowerCase().includes("true") || 
                          verificationResult.verdict.toLowerCase().includes("real") ? 
                          "bg-green-500/20 text-green-600 hover:bg-green-500/30" : 
                          "bg-red-500/20 text-red-600 hover:bg-red-500/30"
                        )}>
                          {verificationResult.verdict}
                        </Badge>
                      </h3>

                      <div className="mt-6 space-y-4 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:via-transparent before:to-transparent before:h-full before:w-2 before:rounded-l-lg">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium">Confidence</span>
                            <span className="text-sm">{Math.round(verificationResult.confidence * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2.5">
                            <div 
                              className={cn(
                                "h-2.5 rounded-full",
                                verificationResult.verdict.toLowerCase().includes("true") || 
                                verificationResult.verdict.toLowerCase().includes("real") ? 
                                "bg-green-500" : "bg-red-500"
                              )}
                              style={{ width: `${Math.round(verificationResult.confidence * 100)}%` }}
                            ></div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-base font-medium mb-2">Reasoning</h4>
                          <p className="text-sm bg-muted/50 p-3 rounded-md">{verificationResult.reason}</p>
                        </div>

                        {Object.keys(verificationResult.sources).length > 0 && (
                          <div>
                            <h4 className="text-base font-medium mb-2">Sources</h4>
                            <div className="space-y-2">
                              {Object.entries(verificationResult.sources).map(([name, url], index) => (
                                <div key={index} className="flex items-center justify-between bg-muted/30 p-2 rounded-md">
                                  <span className="text-sm font-medium truncate mr-2">{name}</span>
                                  <Button variant="link" size="sm" asChild className="p-0">
                                    <a href={url} target="_blank" rel="noopener noreferrer">
                                      <LinkIcon className="h-3.5 w-3.5 mr-1" />
                                      Source
                                    </a>
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="mt-8 border border-destructive/50 rounded-lg p-4 bg-destructive/10"
                    >
                      <div className="flex flex-col gap-4 mt-6 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500/10 before:via-transparent before:to-transparent before:h-full before:w-2 before:rounded-l-lg">
                        <X className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-destructive">Verification Failed</h3>
                          <p className="text-sm mt-1">{error}</p>
                          <p className="text-sm mt-3">Please check your connection and try again.</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Tabs>
            </CardContent>
          </Card>

          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
          >
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-white/50 via-white/30 to-purple-50/20 dark:from-zinc-900/50 dark:via-purple-900/10 dark:to-zinc-900/50 backdrop-blur-sm border-2 border-purple-800/20 dark:border-purple-600/20 hover:border-purple-800/40 dark:hover:border-purple-600/40 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.05)] hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] dark:shadow-[0_0_15px_rgba(124,58,237,0.1)] dark:hover:shadow-[0_0_25px_rgba(124,58,237,0.2)]">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <ShieldAlert className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Advanced Detection</CardTitle>
                  <CardDescription>
                    Our AI analyzes multiple dimensions of content to identify potential misinformation.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-white/50 via-white/30 to-purple-50/20 dark:from-zinc-900/50 dark:via-purple-900/10 dark:to-zinc-900/50 backdrop-blur-sm border-2 border-purple-800/20 dark:border-purple-600/20 hover:border-purple-800/40 dark:hover:border-purple-600/40 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.05)] hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] dark:shadow-[0_0_15px_rgba(124,58,237,0.1)] dark:hover:shadow-[0_0_25px_rgba(124,58,237,0.2)]">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <SearchCheck className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Source Verification</CardTitle>
                  <CardDescription>
                    We cross-reference information against trusted sources and databases.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-white/50 via-white/30 to-purple-50/20 dark:from-zinc-900/50 dark:via-purple-900/10 dark:to-zinc-900/50 backdrop-blur-sm border-2 border-purple-800/20 dark:border-purple-600/20 hover:border-purple-800/40 dark:hover:border-purple-600/40 transition-all duration-300 shadow-[0_0_15px_rgba(124,58,237,0.05)] hover:shadow-[0_0_25px_rgba(124,58,237,0.15)] dark:shadow-[0_0_15px_rgba(124,58,237,0.1)] dark:hover:shadow-[0_0_25px_rgba(124,58,237,0.2)]">
                <CardHeader>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Context Analysis</CardTitle>
                  <CardDescription>
                    Gain insights into the full context behind claims and statements.
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
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

export default FactCheck;
