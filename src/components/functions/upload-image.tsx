"use client";
import React, { useState } from "react";
import { storage, db } from "../../lib/firebase"; // Firebase setup
import { useAuthState } from "react-firebase-hooks/auth";

import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auth } from "../../lib/firebase";

const ImageUploadPopover = () => {
  const [user] = useAuthState(auth);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false); // Controls popover open/close

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!user) {
      setError("User is not authenticated");
      console.error("Upload failed: User is not authenticated.");
      return;
    }

    if (!file) {
      setError("Please select an image to upload.");
      console.error("Upload failed: No file selected.");
      return;
    }

    if (uploading) {
      console.warn("Upload already in progress.");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log("Starting upload to Firebase Storage...");

      // Upload file to Firebase Storage
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      console.log("File successfully uploaded to Firebase Storage.");

      const downloadURL = await getDownloadURL(storageRef);
      console.log("File available at URL:", downloadURL);

      // Attempt to save metadata to Firestore
      console.log("Attempting to save file metadata to Firestore...");
      await addDoc(collection(db, "images"), {
        url: downloadURL,
        createdAt: serverTimestamp(),
      });

      console.log("File metadata saved to Firestore successfully.");
      setFile(null);
      setIsOpen(false); // Close the popover after successful upload
      alert("Image uploaded and metadata saved successfully!");
    } catch (err) {
      if (err instanceof FirebaseError && err.code === "permission-denied") {
        console.error("Permission denied: Check Firestore rules.");
      } else {
        console.error("Error during Firestore save:", err);
        alert("Image uploaded, but there was an issue saving metadata.");
      }
      setError(
        "There was an issue saving the image metadata. Please try again."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Last opp bilde
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Upload Image</h4>
            <p className="text-sm text-muted-foreground">
              Select an image file to upload.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid items-center gap-4">
              <Label htmlFor="file">Choose file</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                className="col-span-2 h-8"
              />
            </div>
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="mt-4"
            >
              {uploading ? "Uploading..." : "Upload"}
            </Button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ImageUploadPopover;
