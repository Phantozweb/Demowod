import { PrescriptionForm } from "@/components/prescription-form";

export default function PrescriptionPage() {
    return (
        <div className="p-4 md:p-8">
            <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-headline font-bold">My Prescription</h1>
                <p className="text-muted-foreground mt-2">Manage your eyeglass prescription details here.</p>
            </header>
            <PrescriptionForm />
        </div>
    );
}
