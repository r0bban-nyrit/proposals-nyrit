
import { useEffect, useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Header } from "@/components/Header";
import { BusinessProfileForm } from "@/components/BusinessProfileForm";
import { BusinessProfile } from "@/types";

export default function Profil() {
  const [profile, setProfile] = useState<BusinessProfile | undefined>(undefined);

  useEffect(() => {
    // Load business profile from localStorage
    const profileData = localStorage.getItem("businessProfile");
    if (profileData) {
      setProfile(JSON.parse(profileData));
    }
  }, []);

  const handleSave = (updatedProfile: BusinessProfile) => {
    // Update the local state
    setProfile(updatedProfile);
    
    // Save to localStorage
    localStorage.setItem("businessProfile", JSON.stringify(updatedProfile));
  };

  return (
    <AppLayout>
      <Header 
        title="Företagsprofil" 
        description="Hantera dina företagsuppgifter" 
      />
      
      <BusinessProfileForm initialProfile={profile} onSave={handleSave} />
    </AppLayout>
  );
}
