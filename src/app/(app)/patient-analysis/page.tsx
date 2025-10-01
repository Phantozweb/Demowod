'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Eye, UploadCloud, PersonStanding, FlaskConical, ArrowRight } from 'lucide-react';

export default function PatientAnalysisPage() {
  const [activeTab, setActiveTab] = useState('info');

  return (
    <div className="p-4 md:p-8">
      <header className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight text-white mb-6">Real-Time Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="text-primary-light" />
                <h3 className="text-lg font-semibold text-muted-foreground">Face Shape Analysis</h3>
              </div>
              <p className="text-3xl font-bold text-primary">Oval</p>
              <p className="text-sm text-muted-foreground mt-2">Based on uploaded image.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="text-primary-lighter" />
                <h3 className="text-lg font-semibold text-muted-foreground">Recommended Frames</h3>
              </div>
              <p className="text-3xl font-bold text-primary">N/A</p>
              <p className="text-sm text-muted-foreground mt-2">Analysis pending.</p>
            </CardContent>
          </Card>
          <Card className="flex flex-col justify-between">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <FlaskConical className="text-primary" />
                <h3 className="text-lg font-semibold text-muted-foreground">Lens Power &amp; Type</h3>
              </div>
              <div className="text-2xl font-bold text-primary">
                <span>OD: <span className="text-muted-foreground">N/A</span></span> / <span>OS: <span className="text-muted-foreground">N/A</span></span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Not Available</p>
            </CardContent>
          </Card>
        </div>
      </header>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
        <div className="md:w-1/4">
          <div className="sticky top-28">
            <div className="text-center md:text-left mb-8">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Patient Info &amp; Analysis</h1>
              <p className="mt-3 text-lg text-muted-foreground">Navigate through the patient's data and image uploads.</p>
            </div>
            <nav className="space-y-2">
              <Button
                variant={activeTab === 'info' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('info')}
                className="w-full justify-start gap-3 px-4 py-6 text-base"
              >
                <PersonStanding />
                <span>Patient Information</span>
              </Button>
              <Button
                variant={activeTab === 'specs' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('specs')}
                className="w-full justify-start gap-3 px-4 py-6 text-base"
              >
                <Eye />
                <span>Spectacle Parameters</span>
              </Button>
              <Button
                variant={activeTab === 'upload' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('upload')}
                className="w-full justify-start gap-3 px-4 py-6 text-base"
              >
                <UploadCloud />
                <span>Image Upload</span>
              </Button>
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <Card className="p-8 min-h-[600px]">
            <form>
              {activeTab === 'info' && (
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <Label htmlFor="patient-name" className="mb-2 block">Full Name</Label>
                      <Input id="patient-name" name="patient-name" placeholder="John Doe" type="text" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="age" className="mb-2 block">Age</Label>
                        <Input id="age" name="age" placeholder="e.g., 42" type="number" />
                      </div>
                      <div>
                        <Label htmlFor="gender" className="mb-2 block">Gender</Label>
                        <Select name="gender">
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="contact-info" className="mb-2 block">Contact Information</Label>
                      <Input id="contact-info" name="contact-info" placeholder="Phone or Email" type="text" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Spectacle Parameters</h3>
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-lg font-medium text-white mb-4">Distance Vision</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div><Label htmlFor="dist-sph-od" className="mb-2 block">SPH (OD)</Label><Input id="dist-sph-od" name="dist-sph-od" placeholder="-1.25" type="text" /></div>
                        <div><Label htmlFor="dist-sph-os" className="mb-2 block">SPH (OS)</Label><Input id="dist-sph-os" name="dist-sph-os" placeholder="-1.50" type="text" /></div>
                        <div><Label htmlFor="dist-cyl" className="mb-2 block">CYL</Label><Input id="dist-cyl" name="dist-cyl" placeholder="-0.50" type="text" /></div>
                        <div><Label htmlFor="dist-axis" className="mb-2 block">Axis</Label><Input id="dist-axis" name="dist-axis" placeholder="180" type="text" /></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-4">Near Vision (ADD)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div><Label htmlFor="near-add-od" className="mb-2 block">ADD (OD)</Label><Input id="near-add-od" name="near-add-od" placeholder="+2.00" type="text" /></div>
                        <div><Label htmlFor="near-add-os" className="mb-2 block">ADD (OS)</Label><Input id="near-add-os" name="near-add-os" placeholder="+2.00" type="text" /></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-medium text-white mb-4">Pupillary Distance (PD)</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div><Label htmlFor="pd-dist" className="mb-2 block">Distance PD</Label><Input id="pd-dist" name="pd-dist" placeholder="63" type="text" /></div>
                        <div><Label htmlFor="pd-near" className="mb-2 block">Near PD</Label><Input id="pd-near" name="pd-near" placeholder="60" type="text" /></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'upload' && (
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-8 border-b pb-4">Image Upload</h3>
                  <div className="flex justify-center items-center w-full mt-8">
                    <Label htmlFor="image-upload" className="flex flex-col justify-center items-center w-full h-80 bg-background rounded-lg border-2 border-dashed border-input hover:border-primary transition-all duration-300 cursor-pointer">
                      <div className="flex flex-col justify-center items-center pt-5 pb-6">
                        <UploadCloud className="w-16 h-16 text-muted-foreground mb-4" />
                        <p className="mb-2 text-lg text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                        <p className="text-sm text-muted-foreground">PNG, JPG, or JPEG (MAX. 5MB)</p>
                      </div>
                      <Input id="image-upload" type="file" className="hidden" />
                    </Label>
                  </div>
                </div>
              )}

              <div className="pt-10 mt-8 border-t">
                <Button className="w-full" size="lg" type="submit">
                  <span>Analyze and Recommend</span>
                  <ArrowRight />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
