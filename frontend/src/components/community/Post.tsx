import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';

interface PostProps {
  post: {
    id: string;
    content: string;
    imageUrl?: string;
    user: {
      id: string;
      name: string;
    };
    replies: Array<{
      id: string;
      content: string;
      imageUrl?: string;
      user: {
        id: string;
        name: string;
      };
      createdAt: string;
    }>;
    createdAt: string;
  };
}

export function Post({ post }: PostProps) {
  const [replyContent, setReplyContent] = useState('');
  const { createReply } = useCommunityStore();
  const { user } = useAuthStore();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      await createReply(post.id, replyContent);
      setReplyContent('');
    }
  };
  console.log('Post:', post);
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start space-x-4">
        <Avatar>
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {post.user.name[0]}
          </div>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-medium">{post.user.name}</span>
            <span className="text-gray-500 text-sm">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="mt-2">{post.content}</p>
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt="Post attachment"
              className="mt-4 rounded-lg max-h-96 object-cover"
            />
          )}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {post && post.replies.map((reply) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            {...{ className: "ml-12 bg-gray-50 rounded-lg p-4" }}
          >
            <div className="flex items-start space-x-4">
              <Avatar>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  {reply.user.name[0]}
                </div>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{reply.user.name}</span>
                  <span className="text-gray-500 text-sm">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-1">{reply.content}</p>
                {reply.imageUrl && (
                  <img
                    src={reply.imageUrl}
                    alt="Reply attachment"
                    className="mt-2 rounded-lg max-h-60 object-cover"
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {user?.isPaid && (
        <form onSubmit={handleReply} className="mt-6 ml-12">
          <div className="flex space-x-2">
            <Input
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1"
            />
            <Button type="submit" disabled={!replyContent.trim()}>
              Reply
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}