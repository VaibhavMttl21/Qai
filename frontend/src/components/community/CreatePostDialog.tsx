import { useState, useRef } from 'react';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, Upload, Loader2 } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export function CreatePostDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { createPost, createAdminPost } = useCommunityStore();
  const { user } = useAuthStore();
  
  const isAdmin = user?.userType === 'ADMIN';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Clear the URL field when a file is selected
      setImageUrl('');
    }
  };

  const uploadImageToFirebase = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      const storage = getStorage();
      const timestamp = new Date().getTime();
      const storageRef = ref(storage, `posts/${user?.id}/${timestamp}_${file.name}`);
      
      // Upload the file
      await uploadBytes(storageRef, file);
      setUploadProgress(100);
      
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Allow posts with just an image (no text required)
    if (content.trim() || imageUrl || selectedFile) {
      let finalImageUrl = imageUrl;
      
      try {
        // If a file is selected, upload it first
        if (selectedFile) {
          finalImageUrl = await uploadImageToFirebase(selectedFile);
        }
        
        if (isAdmin) {
          // Use admin post endpoint for admin users
          await createAdminPost(content, finalImageUrl);
        } else {
          // Use regular post endpoint for non-admin users
          await createPost(content, finalImageUrl);
        }
        
        // Reset form
        setContent('');
        setImageUrl('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsOpen(false);
      } catch (error) {
        console.error("Error creating post:", error);
        // You might want to show an error message to the user
      }
    }
  };

  const addEmoji = (emoji: any) => {
    setContent(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New {isAdmin ? 'Admin ' : ''}Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 p-2 border rounded-md font-mono whitespace-pre overflow-auto"
              style={{ whiteSpace: 'pre', tabSize: 2 }}
              spellCheck="false"
            />
          </div>
          
          <div className="space-y-2">
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              disabled={!!selectedFile}
            />
          </div>
          
          <div className="flex gap-2 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Button 
              type="button" 
              variant="outline" 
              onClick={triggerFileInput}
              disabled={!!imageUrl}
            >
              <Upload className="mr-2" size={16} />
              {selectedFile ? 'Change Image' : 'Upload Image'}
            </Button>
            {selectedFile && (
              <span className="text-sm text-gray-500 truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            )}
          </div>
          
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          
          <div className="flex justify-between items-center">
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="mr-2" size={16} /> Add Emoji
              </Button>
              {showEmojiPicker && (
                <div className="absolute top-10 left-0 z-10">
                  <EmojiPicker onEmojiClick={addEmoji} />
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!(content.trim() || imageUrl || selectedFile) || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading
                  </>
                ) : (
                  'Post'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}