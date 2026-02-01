import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Eye, Pin, Lock, Plus, Send, Heart, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function ForumsPage() {
  const [topics, setTopics] = useState([]);
  const [replies, setReplies] = useState({});
  const [showNewTopic, setShowNewTopic] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [newTopic, setNewTopic] = useState({
    title: '',
    content: '',
    category: 'عام',
    author_name: ''
  });
  const [newReply, setNewReply] = useState('');
  const [replyAuthor, setReplyAuthor] = useState('');

  useEffect(() => {
    const savedTopics = localStorage.getItem('forumTopics');
    if (savedTopics) setTopics(JSON.parse(savedTopics));
    
    const savedReplies = localStorage.getItem('forumReplies');
    if (savedReplies) setReplies(JSON.parse(savedReplies));
  }, []);

  const saveTopics = (newTopics) => {
    setTopics(newTopics);
    localStorage.setItem('forumTopics', JSON.stringify(newTopics));
  };

  const saveReplies = (newReplies) => {
    setReplies(newReplies);
    localStorage.setItem('forumReplies', JSON.stringify(newReplies));
  };

  const handleCreateTopic = () => {
    if (!newTopic.title || !newTopic.content || !newTopic.author_name) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }

    const topic = {
      ...newTopic,
      id: Date.now().toString(),
      created_date: new Date().toISOString(),
      replies_count: 0,
      views_count: 0,
      is_pinned: false,
      is_locked: false
    };

    saveTopics([topic, ...topics]);
    toast.success('تم إنشاء الموضوع بنجاح! 📝');
    setShowNewTopic(false);
    setNewTopic({ title: '', content: '', category: 'عام', author_name: '' });
  };

  const handleOpenTopic = (topic) => {
    setSelectedTopic(topic);
    const updated = topics.map(t => 
      t.id === topic.id ? { ...t, views_count: (t.views_count || 0) + 1 } : t
    );
    saveTopics(updated);
  };

  const handleAddReply = () => {
    if (!newReply.trim() || !replyAuthor.trim() || !selectedTopic) {
      toast.error('الرجاء ملء جميع الحقول');
      return;
    }

    if (selectedTopic.is_locked) {
      toast.error('هذا الموضوع مقفل ولا يمكن الرد عليه');
      return;
    }

    const reply = {
      id: Date.now().toString(),
      topic_id: selectedTopic.id,
      content: newReply,
      author_name: replyAuthor,
      created_date: new Date().toISOString(),
      likes_count: 0
    };

    const topicReplies = replies[selectedTopic.id] || [];
    const newReplies = { ...replies, [selectedTopic.id]: [...topicReplies, reply] };
    saveReplies(newReplies);

    const updated = topics.map(t => 
      t.id === selectedTopic.id ? { ...t, replies_count: (t.replies_count || 0) + 1 } : t
    );
    saveTopics(updated);

    setNewReply('');
    toast.success('تم إضافة ردك 💬');
  };

  const handleLikeReply = (reply) => {
    const topicReplies = replies[selectedTopic.id] || [];
    const updated = topicReplies.map(r => 
      r.id === reply.id ? { ...r, likes_count: (r.likes_count || 0) + 1 } : r
    );
    const newReplies = { ...replies, [selectedTopic.id]: updated };
    saveReplies(newReplies);
    toast.success('❤️ تم الإعجاب');
  };

  const filteredTopics = topics.filter(t => 
    filterCategory === 'all' || t.category === filterCategory
  ).sort((a, b) => {
    if (a.is_pinned && !b.is_pinned) return -1;
    if (!a.is_pinned && b.is_pinned) return 1;
    return new Date(b.created_date) - new Date(a.created_date);
  });

  const getCategoryColor = (category) => {
    const colors = {
      'تفسير': 'bg-blue-100 text-blue-800',
      'فقه': 'bg-green-100 text-green-800',
      'سيرة': 'bg-purple-100 text-purple-800',
      'أحكام': 'bg-orange-100 text-orange-800',
      'عام': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (selectedTopic) {
    const topicReplies = replies[selectedTopic.id] || [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6" dir="rtl">
        <div className="max-w-5xl mx-auto">
          <Button
            onClick={() => setSelectedTopic(null)}
            variant="ghost"
            className="mb-6"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            العودة للمنتديات
          </Button>

          <Card className="p-8 mb-6 bg-white shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {selectedTopic.is_pinned && (
                  <Badge className="mb-2 bg-amber-100 text-amber-800">
                    <Pin className="w-3 h-3 ml-1" />
                    مثبت
                  </Badge>
                )}
                <Badge className={`${getCategoryColor(selectedTopic.category)} mb-3`}>
                  {selectedTopic.category}
                </Badge>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{selectedTopic.title}</h1>
              </div>
              {selectedTopic.is_locked && (
                <Lock className="w-6 h-6 text-red-500" />
              )}
            </div>

            <p className="text-gray-700 leading-relaxed text-lg mb-4 whitespace-pre-wrap">{selectedTopic.content}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
              <span className="font-bold">{selectedTopic.author_name}</span>
              <span>{new Date(selectedTopic.created_date).toLocaleDateString('ar')}</span>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {selectedTopic.views_count || 0}
              </div>
            </div>
          </Card>

          {/* الردود */}
          <div className="space-y-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900">الردود ({topicReplies.length})</h2>
            
            {topicReplies.map((reply) => (
              <Card key={reply.id} className="p-6 bg-white">
                <p className="text-gray-800 leading-relaxed mb-3 whitespace-pre-wrap">{reply.content}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="font-bold">{reply.author_name}</span>
                    <span>{new Date(reply.created_date).toLocaleDateString('ar')}</span>
                  </div>
                  <Button
                    onClick={() => handleLikeReply(reply)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Heart className="w-4 h-4 ml-1" />
                    {reply.likes_count || 0}
                  </Button>
                </div>
              </Card>
            ))}

            {topicReplies.length === 0 && (
              <p className="text-center text-gray-500 py-8">لا توجد ردود بعد. كن أول من يرد!</p>
            )}
          </div>

          {/* نموذج الرد */}
          {!selectedTopic.is_locked && (
            <Card className="p-6 bg-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">إضافة رد</h3>
              <div className="space-y-4">
                <Input
                  value={replyAuthor}
                  onChange={(e) => setReplyAuthor(e.target.value)}
                  placeholder="اسمك"
                />
                <Textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  placeholder="اكتب ردك هنا..."
                  className="h-32"
                />
                <Button onClick={handleAddReply} className="w-full bg-indigo-600 hover:bg-indigo-700">
                  <Send className="w-4 h-4 ml-2" />
                  إرسال الرد
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-7xl mb-4">💭</div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">منتديات النقاش</h1>
          <p className="text-xl text-gray-700">شارك في النقاشات الدينية والقرآنية</p>
        </div>

        <div className="mb-8 flex justify-between items-center flex-wrap gap-4">
          <Button
            onClick={() => setShowNewTopic(!showNewTopic)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            size="lg"
          >
            <Plus className="w-5 h-5 ml-2" />
            {showNewTopic ? 'إلغاء' : 'موضوع جديد'}
          </Button>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              <SelectItem value="تفسير">تفسير</SelectItem>
              <SelectItem value="فقه">فقه</SelectItem>
              <SelectItem value="سيرة">سيرة</SelectItem>
              <SelectItem value="أحكام">أحكام</SelectItem>
              <SelectItem value="عام">عام</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showNewTopic && (
          <Card className="p-6 mb-8 bg-white shadow-xl border-2 border-indigo-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">موضوع جديد</h3>
            <div className="space-y-4">
              <Input
                value={newTopic.title}
                onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                placeholder="عنوان الموضوع"
                className="text-lg"
              />
              
              <Textarea
                value={newTopic.content}
                onChange={(e) => setNewTopic({...newTopic, content: e.target.value})}
                placeholder="اكتب موضوعك هنا..."
                className="h-40 text-lg"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={newTopic.author_name}
                  onChange={(e) => setNewTopic({...newTopic, author_name: e.target.value})}
                  placeholder="اسمك"
                />

                <Select 
                  value={newTopic.category} 
                  onValueChange={(v) => setNewTopic({...newTopic, category: v})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="تفسير">تفسير</SelectItem>
                    <SelectItem value="فقه">فقه</SelectItem>
                    <SelectItem value="سيرة">سيرة</SelectItem>
                    <SelectItem value="أحكام">أحكام</SelectItem>
                    <SelectItem value="عام">عام</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleCreateTopic}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                نشر الموضوع
              </Button>
            </div>
          </Card>
        )}

        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <Card
              key={topic.id}
              className="p-6 hover:shadow-xl transition-all cursor-pointer border-2 border-gray-200 hover:border-indigo-400"
              onClick={() => handleOpenTopic(topic)}
            >
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {topic.is_pinned && (
                      <Pin className="w-4 h-4 text-amber-500" />
                    )}
                    {topic.is_locked && (
                      <Lock className="w-4 h-4 text-red-500" />
                    )}
                    <Badge className={getCategoryColor(topic.category)}>
                      {topic.category}
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{topic.title}</h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">{topic.content}</p>

                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="font-bold">{topic.author_name}</span>
                    <span>{new Date(topic.created_date).toLocaleDateString('ar')}</span>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {topic.replies_count || 0}
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {topic.views_count || 0}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}

          {filteredTopics.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 text-xl">لا توجد مواضيع حالياً</p>
              <p className="text-gray-500">كن أول من يبدأ نقاشاً!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}