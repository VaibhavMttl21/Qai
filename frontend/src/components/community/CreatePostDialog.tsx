import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CreatePostDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { createPost, createAdminPost } = useCommunityStore();
  const { user } = useAuthStore();
  
  const isAdmin = user?.userType === 'ADMIN';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      if (isAdmin) {
        // Use admin post endpoint for admin users
        await createAdminPost(content, imageUrl);
      } else {
        // Use regular post endpoint for non-admin users
        await createPost(content, imageUrl);
      }
      setContent('');
      setImageUrl('');
      setIsOpen(false);
    }
  };

  const addEmoji = (emoji: any) => {
    setContent(prev => prev + emoji.emoji);
    setShowEmojiPicker(false);
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
              required
            />
          </div>
          <div className="space-y-2">
            <Input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL (optional)"
            />
          </div>
          
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
              <Button type="submit" disabled={!content.trim()}>
                Post
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}