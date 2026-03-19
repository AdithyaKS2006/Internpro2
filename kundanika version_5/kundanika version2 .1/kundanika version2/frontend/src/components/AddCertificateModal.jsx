import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import { API, getAuthHeaders } from '../pages/api';

export default function AddCertificateModal({ isOpen, onClose, onCertificateAdded }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    issuing_organization: '',
    issue_date: '',
    certificate_url: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.issuing_organization || !formData.issue_date) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    try {
      const payload = { ...formData };
      if (!payload.certificate_url) payload.certificate_url = null;
      
      await axios.post(`${API}/certificates/manual`, payload, getAuthHeaders());
      toast.success('Certificate added successfully!');
      onCertificateAdded();
      
      // Reset form
      setFormData({
        title: '',
        issuing_organization: '',
        issue_date: '',
        certificate_url: ''
      });
      onClose();
    } catch (error) {
      console.error("Add certificate error:", error.response?.data || error.message);
      const errorDetail = error.response?.data?.detail;
      const errorMessage = Array.isArray(errorDetail) 
        ? errorDetail.map(err => `${err.loc.join('.')}: ${err.msg}`).join(', ')
        : (typeof errorDetail === 'object' ? JSON.stringify(errorDetail) : (errorDetail || error.message));
      toast.error(`Failed to add certificate: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Certificate</DialogTitle>
          <DialogDescription>
            Showcase your continuous learning by adding certificates from external platforms.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label>Certificate Title *</Label>
            <Input 
              placeholder="e.g. AWS Certified Solutions Architect" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label>Issuing Organization *</Label>
            <Input 
              placeholder="e.g. Amazon Web Services, Coursera" 
              value={formData.issuing_organization}
              onChange={e => setFormData({...formData, issuing_organization: e.target.value})}
              required
            />
          </div>

          <div>
            <Label>Issue Date *</Label>
            <Input 
              type="date"
              value={formData.issue_date}
              onChange={e => setFormData({...formData, issue_date: e.target.value})}
              required
            />
          </div>

          <div>
            <Label>Credential URL</Label>
            <Input 
              type="url"
              placeholder="https://..." 
              value={formData.certificate_url}
              onChange={e => setFormData({...formData, certificate_url: e.target.value})}
            />
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Certificate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
