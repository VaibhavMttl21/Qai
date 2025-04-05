import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const { createPost } = useCommunityStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      await createPost(content, imageUrl);
      setContent('');
      setImageUrl('');
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Create Post</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full h-32 p-2 border rounded-md"
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
          <div className="flex justify-end space-x-2">
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
        </form>
      </DialogContent>
    </Dialog>
  );
}