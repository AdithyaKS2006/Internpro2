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

export default function OnboardingWizard({ isOpen, onComplete, initialProfile = {} }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    university: initialProfile.university || '',
    major: initialProfile.major || '',
    graduation_year: initialProfile.graduation_year || '',
    cgpa: initialProfile.cgpa || '',
    skills: initialProfile.skills || [],
    linkedin: initialProfile.linkedin || '',
    bio: initialProfile.bio || '',
    resume_url: initialProfile.resume_url || ''
  });
  const [skillInput, setSkillInput] = useState('');

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const addSkill = (e) => {
    e.preventDefault();
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // First clean up the empty strings for numbers if applicable
      const payload = {
        ...formData,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        cgpa: formData.cgpa ? parseFloat(formData.cgpa) : null
      };
      
      await axios.put(`${API}/students/profile`, payload, getAuthHeaders());
      
      // Update local storage user profile_completed flag
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.profile_completed = true;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      toast.success('Profile created successfully!');
      onComplete(payload);
    } catch (error) {
      console.error("Onboarding error:", error.response?.data);
      const errorDetail = error.response?.data?.detail;
      const errorMessage = Array.isArray(errorDetail) 
        ? errorDetail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        : (typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : errorDetail);
      
      toast.error(errorMessage || 'Failed to save profile details');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" hideClose>
        <DialogHeader>
          <DialogTitle>Welcome to InternPro!</DialogTitle>
          <DialogDescription>
            Let's set up your profile to match you with the best opportunities. (Step {step} of 3)
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>University</Label>
                <Input 
                  placeholder="e.g. Stanford University" 
                  value={formData.university}
                  onChange={e => setFormData({...formData, university: e.target.value})}
                />
              </div>
              <div>
                <Label>Major / Department</Label>
                <Input 
                  placeholder="e.g. Computer Science" 
                  value={formData.major}
                  onChange={e => setFormData({...formData, major: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Graduation Year</Label>
                  <Input 
                    type="number" 
                    placeholder="2025" 
                    value={formData.graduation_year}
                    onChange={e => setFormData({...formData, graduation_year: e.target.value})}
                  />
                </div>
                <div>
                  <Label>CGPA</Label>
                  <Input 
                    type="number" step="0.01" 
                    placeholder="3.8" 
                    value={formData.cgpa}
                    onChange={e => setFormData({...formData, cgpa: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <Label>Skills</Label>
                <form onSubmit={addSkill} className="flex space-x-2 mt-1 mb-3">
                  <Input 
                    placeholder="E.g. React, Python, UI/UX" 
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                  />
                  <Button type="submit" variant="secondary">Add</Button>
                </form>
                <div className="flex flex-wrap gap-2 min-h-[100px] border rounded-md p-3">
                  {formData.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1 text-sm bg-blue-100 text-blue-800">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="ml-2 hover:text-red-500 font-bold">&times;</button>
                    </Badge>
                  ))}
                  {formData.skills.length === 0 && <span className="text-gray-400 text-sm">No skills added yet</span>}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <Label>LinkedIn URL</Label>
                <Input 
                  placeholder="https://linkedin.com/in/username" 
                  value={formData.linkedin}
                  onChange={e => setFormData({...formData, linkedin: e.target.value})}
                />
              </div>
              <div>
                <Label>Resume Link (Google Drive, Dropbox, etc)</Label>
                <Input 
                  placeholder="https://..." 
                  value={formData.resume_url}
                  onChange={e => setFormData({...formData, resume_url: e.target.value})}
                />
              </div>
              <div>
                <Label>Short Bio</Label>
                <Textarea 
                  placeholder="I am a passionate engineering student..." 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <Button variant="ghost" onClick={step === 3 ? handleSubmit : handleNext}>
            Skip for now
          </Button>
          
          <div className="space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>Back</Button>
            )}
            
            {step < 3 ? (
              <Button onClick={handleNext}>Next</Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : "Finish Onboarding"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
