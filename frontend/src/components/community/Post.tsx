import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCommunityStore } from '@/store/community';
import { useAuthStore } from '@/store/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Trash, Edit, Smile } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import EmojiPicker from 'emoji-picker-react';

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
      isAdmin?: boolean;
    }>;
    createdAt: string;
    isAdmin?: boolean;
  };
  viewMode?: 'prioritized' | 'chronological';
  disableActions?: boolean; // Add this line
  isDarkMode?: boolean; // Add this line
}

export function Post({ post, viewMode = 'prioritized', disableActions }: PostProps) {
  const [replyContent, setReplyContent] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{id: string, type: 'post' | 'reply', parentId?: string} | null>(null);
  
  const { createReply, createAdminReply, editPost, editReply, deletePost, deleteReply } = useCommunityStore();
  const { user } = useAuthStore();

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (replyContent.trim()) {
      if (user?.userType === 'ADMIN' && post.isAdmin) {
        // Admin user replying to an admin post
        await createAdminReply(post.id, replyContent);
      } else {
        // Regular user or admin replying to regular post
        await createReply(post.id, replyContent);
      }
      setReplyContent('');
    }
  };

  const startEditing = (id: string, content: string, type: 'post' | 'reply') => {
    setEditContent(content);
    if (type === 'post') {
      setEditingPostId(id);
      setEditingReplyId(null);
    } else {
      setEditingReplyId(id);
      setEditingPostId(null);
    }
  };

  const cancelEditing = () => {
    setEditingPostId(null);
    setEditingReplyId(null);
    setEditContent('');
  };

  const confirmDelete = (id: string, type: 'post' | 'reply', parentId?: string) => {
    setItemToDelete({ id, type, parentId });
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'post') {
      await deletePost(itemToDelete.id);
    } else if (itemToDelete.type === 'reply' && itemToDelete.parentId) {
      await deleteReply(itemToDelete.parentId, itemToDelete.id);
    }
    setDeleteDialogOpen(false);
  };

  const handleEditSubmit = async () => {
    if (editContent.trim()) {
      if (editingPostId) {
        await editPost(editingPostId, editContent);
        setEditingPostId(null);
      } else if (editingReplyId) {
        await editReply(post.id, editingReplyId, editContent);
        setEditingReplyId(null);
      }
      setEditContent('');
    }
  };

  const addEmoji = (emoji: any) => {
    if (editingPostId || editingReplyId) {
      setEditContent(prev => prev + emoji.emoji);
    } else {
      setReplyContent(prev => prev + emoji.emoji);
    }
    setShowEmojiPicker(false);
    setShowReplyEmojiPicker(false);
  };

  // Add admin badge if post is from admin
  const isAdminPost = post.isAdmin || false;
  
  // Only apply special styling for admin posts in prioritized view
  const hasSpecialStyling = viewMode === 'prioritized' && isAdminPost;

  // Determine if current user can edit/delete this post
  const canModifyPost = user && (user.id === post.user.id || user.userType === 'ADMIN');

  // Sort replies based on view mode
  const sortedReplies = [...post.replies].sort((a, b) => {
    if (viewMode === 'prioritized') {
      // First sort by admin status (admin replies first)
      if (a.isAdmin && !b.isAdmin) return -1;
      if (!a.isAdmin && b.isAdmin) return 1;
    }
    // Then sort by date (newest first) - always applies
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${hasSpecialStyling ? 'border-2 border-blue-500' : ''}`}>
      <div className="flex items-start space-x-4">
        <Avatar>
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {post.user.name[0]}
          </div>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{post.user.name}</span>
              {isAdminPost && (
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  Admin
                </span>
              )}
              <span className="text-gray-500 text-sm">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
            
            {canModifyPost && !disableActions &&(
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => startEditing(post.id, post.content, 'post')}
                >
                  <Edit size={16} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500"
                  onClick={() => confirmDelete(post.id, 'post')}
                >
                  <Trash size={16} />
                </Button>
              </div>
            )}
          </div>
          
          {editingPostId === post.id ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full p-2 border rounded-md font-mono whitespace-pre overflow-auto"
                style={{ whiteSpace: 'pre', tabSize: 2 }}
                spellCheck="false"
                rows={3}
              />
              <div className="flex justify-between items-center">
                <div className="relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <Smile size={16} />
                  </Button>
                  {showEmojiPicker && (
                    <div className="absolute top-8 z-10">
                      <EmojiPicker onEmojiClick={addEmoji} />
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={cancelEditing}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleEditSubmit}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <pre className="mt-2 font-sans whitespace-pre-wrap break-words overflow-y-auto overflow-x-auto max-h-[300px]">{post.content}</pre>
              {post.imageUrl && (
                <img
                  src={post.imageUrl}
                  alt="Post attachment"
                  className="mt-4 rounded-lg max-h-96 object-cover"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Add a scrollable container for replies when there are many */}
      <div className={`mt-6 ${sortedReplies.length > 2 ? 'max-h-[300px] overflow-y-auto pr-2' : ''}`}>
        <div className="space-y-4">
          {sortedReplies.map((reply) => {
            const canModifyReply = user && (user.id === reply.user.id || user.userType === 'ADMIN');
            
            return (
              <motion.div
                key={reply.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                {...{ className: `ml-12 ${reply.isAdmin && viewMode === 'prioritized' ? 'bg-blue-50' : 'bg-gray-50'} rounded-lg p-4` }}
              >
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {reply.user.name[0]}
                    </div>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{reply.user.name}</span>
                        {reply.isAdmin && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                        <span className="text-gray-500 text-sm">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {canModifyReply && (
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => startEditing(reply.id, reply.content, 'reply')}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-500"
                            onClick={() => confirmDelete(reply.id, 'reply', post.id)}
                          >
                            <Trash size={16} />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {editingReplyId === reply.id ? (
                      <div className="mt-2 space-y-2">
                        <textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="w-full p-2 border rounded-md font-mono whitespace-pre overflow-auto"
                          style={{ whiteSpace: 'pre', tabSize: 2 }}
                          spellCheck="false"
                          rows={2}
                        />
                        <div className="flex justify-between items-center">
                          <div className="relative">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                              <Smile size={16} />
                            </Button>
                            {showEmojiPicker && (
                              <div className="absolute top-8 z-10">
                                <EmojiPicker onEmojiClick={addEmoji} />
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={cancelEditing}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={handleEditSubmit}>
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <pre className="mt-1 font-sans whitespace-pre-wrap break-words overflow-y-auto overflow-x-auto max-h-[200px]">{reply.content}</pre>
                        {reply.imageUrl && (
                          <img
                            src={reply.imageUrl}
                            alt="Reply attachment"
                            className="mt-2 rounded-lg max-h-60 object-cover"
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {user?.isPaid && !disableActions && (
        <form onSubmit={handleReply} className="mt-6 ml-12">
          <div className="flex flex-col space-y-2">
            <div className="flex space-x-2">
              <Input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1"
              />
              <div className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowReplyEmojiPicker(!showReplyEmojiPicker)}
                >
                  <Smile size={16} />
                </Button>
                {showReplyEmojiPicker && (
                  <div className="absolute bottom-10 right-0 z-10">
                    <EmojiPicker onEmojiClick={addEmoji} />
                  </div>
                )}
              </div>
              <Button type="submit" disabled={!replyContent.trim()}>
                Reply
              </Button>
            </div>
          </div>
        </form>
      )}
      
      {/* Confirmation Dialog for Delete */}
      {/* <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              {itemToDelete?.type === 'post' ? ' post' : ' reply'} and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
      <div >
        <AlertDialogContent className="bg-white rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the 
              {itemToDelete?.type === 'post' ? ' post' : ' reply'} and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-purple-600 hover:text-indigo-600">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:opacity-90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>

    </div>
  );
}