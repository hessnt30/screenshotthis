"use client";

import PreviewPost from "@/components/preview-post";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/auth-context";
import { useLoading } from "@/context/loading-context";
import { ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { createPost } from "@/firebase/api/user-post-actions";
import { ImageUploadResource, NewPost } from "@/types";
import { useRouter } from "next/navigation";
import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Timestamp } from "firebase/firestore";

export default function Challenge() {
  const { setIsLoading } = useLoading();
  const { user } = useAuth();
  const router = useRouter();
  const [finalWidth, setFinalWidth] = useState<number>(0);
  const [finalHeight, setFinalHeight] = useState<number>(0);

  const [caption, setCaption] = useState<string>("");

  const [resource, setResource] = useState<ImageUploadResource | undefined>();

  useEffect(() => {
    console.log(resource);
  }, [resource]);

  const handlePost = async () => {
    if (!user || !resource) return;

    setIsLoading(true);

    try {
      // Create a new post with the image URL
      const newPost: NewPost = {
        userId: user.uid,
        imageUrl: resource.secure_url,
        caption,
        createdAt: new Date().toISOString(),
        likes: 0,
        challengeId: "xyz",
        username: user.email?.split("@")[0],
        width: resource.width,
        height: resource.height,
      };

      console.log(newPost);

      // Save the post in Firestore
      await createPost(newPost);

      // Reset the form
      setResource(undefined);
      setCaption("");
      setIsLoading(false);

      router.push("/feed");
    } catch (error) {
      console.error("Error uploading image:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {!resource && (
        <div className="flex flex-1 items-center justify-center flex-col p-4">
          <Card className="flex flex-1 flex-col justify-center items-center p-4 gap-4 max-w-lg">
            <ImageIcon height={64} width={64} />
            {/* <Input
              className="mb-4"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            /> */}
            <CldUploadWidget
              signatureEndpoint="/api/sign-cloudinary-params"
              onSuccess={(result, { widget }) => {
                setResource(result?.info as unknown as ImageUploadResource); // { public_id, secure_url, etc }
              }}
              onQueuesEnd={(result, { widget }) => {
                widget.close();
              }}
            >
              {({ open }) => {
                function handleOnClick() {
                  console.log(resource);
                  setResource(undefined);
                  open();
                }
                return <Button onClick={handleOnClick}>Upload an Image</Button>;
              }}
            </CldUploadWidget>
          </Card>
        </div>
      )}

      {resource && (
        <PreviewPost
          imageURL={resource.secure_url}
          width={finalWidth}
          height={finalHeight}
        />
      )}
      {resource && (
        <div className="mt-4">
          <Label>Add a caption</Label>
          <Input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="fun caption"
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant={"secondary"}
              onClick={() => {
                setResource(undefined);
              }}
            >
              Cancel
            </Button>

            <Button onClick={handlePost}>Post</Button>
          </div>
        </div>
      )}
    </div>
  );
}
