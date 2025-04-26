import { useState, useRef } from 'react';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile, Upload, Loader2 } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
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

      await uploadBytes(storageRef, file);
      setUploadProgress(100);

      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() || imageUrl || selectedFile) {
      let finalImageUrl = imageUrl;

      try {
        if (selectedFile) {
          finalImageUrl = await uploadImageToFirebase(selectedFile);
        }

        if (isAdmin) {
          await createAdminPost(content, finalImageUrl);
        } else {
          await createPost(content, finalImageUrl);
        }

        setContent('');
        setImageUrl('');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        setIsOpen(false);
      } catch (error) {
        console.error('Error creating post:', error);
      }
    }
  };

  const addEmoji = (emoji: any) => {
    setContent((prev) => prev + emoji.emoji);
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
      <DialogContent className="sm:max-w-[425px] bg-[#e3e3e3] text-black rounded-xl backdrop-blur-md shadow-lg border border-black/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Create a New {isAdmin ? 'Admin ' : ''}Post
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 p-3 bg-white border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-black placeholder-gray-500"
              spellCheck="false"
            />
          </div>

          <div>
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
              disabled={!!selectedFile}
              className="bg-white text-black border-gray-300 placeholder-gray-500 focus:ring-purple-500"
            />
          </div>

          <div className="flex gap-3 items-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              style={{ display: 'none' }}
            />
            <Button
              type="button"
              onClick={triggerFileInput}
              disabled={!!imageUrl}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition"
            >
              <Upload className="mr-2" size={16} />
              {selectedFile ? 'Change Image' : 'Upload Image'}
            </Button>
            {selectedFile && (
              <span className="text-sm text-gray-700 truncate max-w-[200px]">
                {selectedFile.name}
              </span>
            )}
          </div>

          {isUploading && (
            <div className="w-full bg-gray-300 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <div className="relative">
              <Button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="bg-gray-200 hover:bg-gray-300 text-black px-3 py-2 rounded-lg"
              >
                <Smile className="mr-2" size={16} /> Add Emoji
              </Button>
              {showEmojiPicker && (
                <div className="absolute top-12 left-0 z-10">
                  <EmojiPicker onEmojiClick={addEmoji} theme={Theme.LIGHT} />
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!(content.trim() || imageUrl || selectedFile) || isUploading}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg transition"
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
