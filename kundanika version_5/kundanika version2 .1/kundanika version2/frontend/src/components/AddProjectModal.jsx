import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import axios from 'axios';
import { API, getAuthHeaders } from '../pages/api';

export default function AddProjectModal({ isOpen, onClose, onProjectAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    github_url: '',
    live_url: '',
    tech_stack: []
  });
  const [techInput, setTechInput] = useState('');

  const addTech = (e) => {
    e.preventDefault();
    if (techInput.trim() && !formData.tech_stack.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...formData.tech_stack, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTech = (techToRemove) => {
    setFormData({
      ...formData,
      tech_stack: formData.tech_stack.filter(s => s !== techToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }
    
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.github_url) payload.github_url = null;
      if (!payload.live_url) payload.live_url = null;
      
      await axios.post(`${API}/projects`, payload, getAuthHeaders());
      toast.success('Project added successfully!');
      onProjectAdded();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        github_url: '',
        live_url: '',
        tech_stack: []
      });
      onClose();
    } catch (error) {
      console.error("Add project error:", error.response?.data || error.message);
      const errorDetail = error.response?.data?.detail;
      const errorMessage = Array.isArray(errorDetail) 
        ? errorDetail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        : (typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : (errorDetail || error.message));
      toast.error(`Failed to add project: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Showcase your work to potential employers by adding details of your personal or academic projects.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label>Project Title *</Label>
            <Input 
              placeholder="E-commerce Platform" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label>Description *</Label>
            <Textarea 
              placeholder="Describe what the project is about and your role in it..." 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>GitHub URL</Label>
              <Input 
                type="url"
                placeholder="https://github.com/..." 
                value={formData.github_url}
                onChange={e => setFormData({...formData, github_url: e.target.value})}
              />
            </div>
            <div>
              <Label>Live Project URL</Label>
              <Input 
                type="url"
                placeholder="https://..." 
                value={formData.live_url}
                onChange={e => setFormData({...formData, live_url: e.target.value})}
              />
            </div>
          </div>

          <div>
            <Label>Tech Stack</Label>
            <div className="flex space-x-2 mt-1 mb-3">
              <Input 
                placeholder="E.g. React, Node.js" 
                value={techInput}
                onChange={e => setTechInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addTech(e); }}
              />
              <Button type="button" variant="secondary" onClick={addTech}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 min-h-[40px] border rounded-md p-2">
              {formData.tech_stack.map((tech, index) => (
                <Badge key={index} variant="secondary" className="px-2 py-1 bg-gray-100">
                  {tech}
                  <button type="button" onClick={() => removeTech(tech)} className="ml-2 hover:text-red-500 font-bold">&times;</button>
                </Badge>
              ))}
              {formData.tech_stack.length === 0 && <span className="text-gray-400 text-sm py-1">No tech stack added</span>}
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Project"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
