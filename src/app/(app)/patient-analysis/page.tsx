'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Eye, UploadCloud, FlaskConical, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PatientAnalysisPage() {
  
  return (
    <div>
        <header className="sticky top-0 z-20 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4">
                <svg
                    className="h-8 w-8 text-primary"
                    fill="none"
                    viewBox="0 0 48 48"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                    d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                    fill="currentColor"
                    ></path>
                    <path
                    clipRule="evenodd"
                    d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    ></path>
                </svg>
                <h1 className="text-xl font-bold text-white">Visionary</h1>
                </div>
            </div>
        </header>

        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <header className="mb-12">
                <h2 className="text-4xl font-extrabold tracking-tight text-white mb-2">Patient Info &amp; Analysis</h2>
                <p className="text-lg text-muted-foreground">Comprehensive patient data and analysis.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                <Card className="flex flex-col justify-between">
                    <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <User className="text-primary" />
                        <h3 className="text-lg font-semibold text-muted-foreground">Face Shape Analysis</h3>
                    </div>
                    <p className="text-3xl font-bold text-primary">Oval</p>
                    <p className="text-sm text-muted-foreground mt-2">Based on uploaded image.</p>
                    </CardContent>
                </Card>
                <Card className="flex flex-col justify-between">
                    <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                        <Eye className="text-primary" />
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

            <Card className="p-8">
                <form>
                    <div className="space-y-12">
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
                    </div>

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
  );
}
