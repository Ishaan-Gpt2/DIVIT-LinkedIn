import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import { useAppStore } from '@/store/appStore';
import GeminiService from '@/services/geminiService';
import { toast } from 'sonner';
import {
  Users,
  Plus,
  Bot,
  Star,
  Trash2,
  Edit,
  Loader2
} from 'lucide-react';

export default function CloneBuilder() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingClone, setEditingClone] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    samplePosts: ''
  });

  const { user } = useAuthStore();
  const { clones, addClone, setActiveClone, activeClone } = useAppStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.samplePosts.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('User not found');
      return;
    }

    setIsCreating(true);
    
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Analyze sample posts (mock analysis)
      const posts = formData.samplePosts.split('\n\n').filter(p => p.trim());
      
      // Use Gemini AI to analyze tone and personality
      const analysisPrompt = `Analyze these sample posts and determine the writing tone and personality traits:

${formData.samplePosts}

Return only: TONE: [tone description] | PERSONALITY: [trait1, trait2, trait3]`;
      
      let tone = 'Professional yet approachable';
      let personality = ['Professional', 'Engaging', 'Thoughtful'];
      
      try {
        const analysis = await GeminiService.chatResponse(analysisPrompt);
        const parts = analysis.split('|');
        if (parts.length >= 2) {
          tone = parts[0].replace('TONE:', '').trim();
          const personalityStr = parts[1].replace('PERSONALITY:', '').trim();
          personality = personalityStr.split(',').map(p => p.trim());
        }
      } catch (error) {
        console.warn('Using fallback analysis:', error);
        tone = analyzePostsTone(formData.samplePosts);
        personality = analyzePersonality(formData.samplePosts);
      }
      
      const newClone = await addClone({
        user_id: user.id,
        name: formData.name,
        description: formData.description || `AI clone trained on ${posts.length} sample posts`,
        tone,
        personality,
        sample_posts: posts,
        is_active: false
      });

      if (newClone) {
        // Reset form
        setFormData({ name: '', description: '', samplePosts: '' });
        setEditingClone(null);
        
        toast.success('Clone created successfully!');
      } else {
        toast.error('Failed to create clone');
      }
    } catch (error) {
      toast.error('Failed to create clone. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const analyzePostsTone = (posts: string): string => {
    const lowercasePosts = posts.toLowerCase();
    if (lowercasePosts.includes('excited') || lowercasePosts.includes('amazing')) {
      return 'Enthusiastic and energetic';
    } else if (lowercasePosts.includes('insight') || lowercasePosts.includes('strategy')) {
      return 'Professional and analytical';
    } else if (lowercasePosts.includes('?') && lowercasePosts.includes('think')) {
      return 'Thought-provoking and engaging';
    }
    return 'Professional yet approachable';
  };

  const analyzePersonality = (posts: string): string[] => {
    const traits = [];
    const lowercasePosts = posts.toLowerCase();
    
    if (lowercasePosts.includes('team') || lowercasePosts.includes('collaborate')) {
      traits.push('Collaborative');
    }
    if (lowercasePosts.includes('learn') || lowercasePosts.includes('grow')) {
      traits.push('Growth-minded');
    }
    if (lowercasePosts.includes('share') || lowercasePosts.includes('insight')) {
      traits.push('Knowledge-sharing');
    }
    if (lowercasePosts.includes('innovate') || lowercasePosts.includes('future')) {
      traits.push('Innovative');
    }
    
    return traits.length > 0 ? traits : ['Professional', 'Engaging', 'Thoughtful'];
  };

  const handleSetActive = (clone: any) => {
    setActiveClone(clone);
    toast.success(`Switched to ${clone.name} clone`);
  };

  const handleEdit = (clone: any) => {
    setEditingClone(clone.id);
    setFormData({
      name: clone.name,
      description: clone.description || '',
      samplePosts: clone.sample_posts?.join('\n\n') || ''
    });
  };

  return (
    <DashboardLayout>
      <div className="p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Clone Builder</h1>
          <p className="text-gray-400">
            Create AI clones that replicate your unique writing style and personality.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Create Clone Form */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                {editingClone ? 'Edit Clone' : 'Create New Clone'}
              </CardTitle>
              <CardDescription className="text-gray-400">
                Upload your best posts to train your AI clone
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-300">
                    Clone Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g., Professional Sarah, Marketing Mike"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description
                  </Label>
                  <Input
                    id="description"
                    placeholder="Brief description of this clone's purpose"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="samplePosts" className="text-gray-300">
                    Sample Posts *
                  </Label>
                  <Textarea
                    id="samplePosts"
                    placeholder="Paste 3-5 of your best LinkedIn posts here. Separate each post with a blank line."
                    value={formData.samplePosts}
                    onChange={(e) => setFormData({...formData, samplePosts: e.target.value})}
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 resize-none"
                    rows={10}
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Tip: Include posts that represent your typical style and tone
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Style...
                    </>
                  ) : (
                    <>
                      <Bot className="mr-2 h-4 w-4" />
                      {editingClone ? 'Update Clone' : 'Create Clone'}
                    </>
                  )}
                </Button>

                {editingClone && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingClone(null);
                      setFormData({ name: '', description: '', samplePosts: '' });
                    }}
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    Cancel
                  </Button>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Existing Clones */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Your Clones</h2>
              <Badge className="bg-gray-700 text-gray-300">
                {clones.length} clone{clones.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="space-y-4">
              {clones.map((clone) => (
                <Card key={clone.id} className={`bg-gray-900/50 border-gray-800 ${activeClone?.id === clone.id ? 'ring-2 ring-purple-500' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white flex items-center">
                            {clone.name}
                            {activeClone?.id === clone.id && (
                              <Star className="w-4 h-4 ml-2 text-yellow-400 fill-current" />
                            )}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {clone.description}
                          </CardDescription>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(clone)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {clone.name !== 'Default Professional' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-700 text-red-400 hover:bg-red-800/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-white font-medium mb-2">Writing Style</h4>
                      <Badge className="bg-purple-600/20 text-purple-400 border-purple-500/50">
                        {clone.tone}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Personality Traits</h4>
                      <div className="flex flex-wrap gap-2">
                        {(clone.personality || []).map((trait, index) => (
                          <Badge key={index} className="bg-blue-600/20 text-blue-400 border-blue-500/50">
                            {trait}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-white font-medium mb-2">Training Data</h4>
                      <p className="text-gray-400 text-sm">
                        {(clone.sample_posts || []).length} sample posts analyzed
                      </p>
                    </div>

                    {activeClone?.id !== clone.id && (
                      <Button
                        onClick={() => handleSetActive(clone)}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      >
                        Set as Active Clone
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}

              {clones.length === 0 && (
                <Card className="bg-gray-900/50 border-gray-800 border-dashed">
                  <CardContent className="p-8 text-center">
                    <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-white text-lg font-medium mb-2">
                      Create Your First Custom Clone
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Build a personalized AI clone by uploading your best LinkedIn posts
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}