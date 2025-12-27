import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, MessageCircle, Star, Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { offlineStorage } from '../components/utils/offlineStorage';

export default function CommunityPage() {
  const [showAddStory, setShowAddStory] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    category: 'قرآن',
    author_name: ''
  });
  const [selectedStory, setSelectedStory] = useState(null);
  const [newComment, setNewComment] = useState('');

  const queryClient = useQueryClient();

  const { data: stories = [] } = useQuery({
    queryKey: ['stories', filterCategory, showFeaturedOnly],
    queryFn: async () => {
      const allStories = await base44.entities.Story.list('-created_date', 50);
      let filtered = allStories;
      
      if (filterCategory !== 'all') {
        filtered = filtered.filter(s => s.category === filterCategory);
      }
      
      if (showFeaturedOnly) {
        filtered = filtered.filter(s => s.is_featured);
      }
      
      return filtered;
    },
    initialData: [],
    staleTime: 5 * 60 * 1000
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', selectedStory?.id],
    queryFn: () => selectedStory ? base44.entities.Comment.filter({ story_id: selectedStory.id }, '-created_date', 50) : [],
    enabled: !!selectedStory
  });

  const createStoryMutation = useMutation({
    mutationFn: (data) => base44.entities.Story.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['stories']);
      toast.success('تم نشر قصتك بنجاح! 🎉');
      setShowAddStory(false);
      setNewStory({ title: '', content: '', category: 'قرآن', author_name: '' });
    }
  });

  const likeStoryMutation = useMutation({
    mutationFn: ({ id, currentLikes }) => 
      base44.entities.Story.update(id, { likes_count: currentLikes + 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries(['stories']);
      toast.success('❤️ تم الإعجاب');
    }
  });

  const addCommentMutation = useMutation({
    mutationFn: (data) => base44.entities.Comment.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
      setNewComment('');
      toast.success('تم إضافة تعليقك 💬');
    }
  });

  const handleSubmitStory = () => {
    if (!newStory.title || !newStory.content || !newStory.author_name) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }
    createStoryMutation.mutate(newStory);
  };

  const handleLikeStory = (story) => {
    likeStoryMutation.mutate({ id: story.id, currentLikes: story.likes_count || 0 });
  };

  const handleAddComment = () => {
    if (!newComment.trim() || !selectedStory) return;
    
    const userName = prompt('اسمك (اختياري)') || 'مستخدم';
    addCommentMutation.mutate({
      story_id: selectedStory.id,
      content: newComment,
      author_name: userName
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">💬</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">المجتمع القرآني</h1>
          <p className="text-xl text-gray-700">شارك قصصك وتجاربك المؤثرة</p>
        </div>

        {/* Add Story Button */}
        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <Button
            onClick={() => setShowAddStory(!showAddStory)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            size="lg"
          >
            <Plus className="w-5 h-5 ml-2" />
            {showAddStory ? 'إلغاء' : 'شارك قصتك'}
          </Button>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الفئات</SelectItem>
                <SelectItem value="قرآن">قرآن</SelectItem>
                <SelectItem value="أذكار">أذكار</SelectItem>
                <SelectItem value="دعاء">دعاء</SelectItem>
                <SelectItem value="تجربة شخصية">تجربة شخصية</SelectItem>
                <SelectItem value="إلهام">إلهام</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
              variant={showFeaturedOnly ? 'default' : 'outline'}
              className={showFeaturedOnly ? 'bg-amber-500' : ''}
            >
              <Star className="w-4 h-4 ml-2" />
              المميزة فقط
            </Button>
          </div>
        </div>

        {/* Add Story Form */}
        {showAddStory && (
          <Card className="p-6 mb-8 bg-white shadow-xl border-2 border-purple-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">قصة جديدة</h3>
            <div className="space-y-4">
              <Input
                value={newStory.title}
                onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                placeholder="عنوان القصة"
                className="text-lg"
              />
              
              <Textarea
                value={newStory.content}
                onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                placeholder="اكتب قصتك هنا..."
                className="h-40 text-lg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={newStory.author_name}
                  onChange={(e) => setNewStory({...newStory, author_name: e.target.value})}
                  placeholder="اسمك"
                />

                <Select 
                  value={newStory.category} 
                  onValueChange={(v) => setNewStory({...newStory, category: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="قرآن">قرآن</SelectItem>
                    <SelectItem value="أذكار">أذكار</SelectItem>
                    <SelectItem value="دعاء">دعاء</SelectItem>
                    <SelectItem value="تجربة شخصية">تجربة شخصية</SelectItem>
                    <SelectItem value="إلهام">إلهام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleSubmitStory}
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={createStoryMutation.isLoading}
              >
                نشر القصة
              </Button>
            </div>
          </Card>
        )}

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <Card key={story.id} className="p-6 hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-purple-400">
              {story.is_featured && (
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="text-amber-600 font-bold">قصة مميزة</span>
                </div>
              )}

              <div className="mb-3">
                <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-bold">
                  {story.category}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3">{story.title}</h3>
              <p className="text-gray-700 leading-relaxed mb-4 line-clamp-4">{story.content}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>بواسطة: {story.author_name || 'مستخدم'}</span>
                <span>{new Date(story.created_date).toLocaleDateString('ar')}</span>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleLikeStory(story)}
                  variant="outline"
                  className="flex-1"
                >
                  <Heart className="w-4 h-4 ml-2" />
                  {story.likes_count || 0}
                </Button>

                <Button
                  onClick={() => setSelectedStory(story)}
                  variant="outline"
                  className="flex-1"
                >
                  <MessageCircle className="w-4 h-4 ml-2" />
                  {story.comments_count || 0}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {stories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-xl">لا توجد قصص حالياً</p>
            <p className="text-gray-500">كن أول من يشارك قصة!</p>
          </div>
        )}

        {/* Comments Modal */}
        {selectedStory && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedStory(null)}>
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{selectedStory.title}</h3>
                <p className="text-gray-700 mb-6">{selectedStory.content}</p>

                {/* Add Comment */}
                <div className="mb-6">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="أضف تعليقك..."
                    className="mb-3"
                  />
                  <Button onClick={handleAddComment} className="w-full">
                    إضافة تعليق
                  </Button>
                </div>

                {/* Comments List */}
                <div className="space-y-3">
                  <h4 className="font-bold text-lg">التعليقات ({comments.length})</h4>
                  {comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 mb-2">{comment.content}</p>
                      <div className="flex justify-between items-center text-sm text-gray-500">
                        <span>{comment.author_name || 'مستخدم'}</span>
                        <span>{new Date(comment.created_date).toLocaleDateString('ar')}</span>
                      </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-gray-500 text-center py-4">لا توجد تعليقات بعد</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}