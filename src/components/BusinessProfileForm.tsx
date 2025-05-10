
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { BusinessProfile } from "@/types";

interface BusinessProfileFormProps {
  initialProfile?: BusinessProfile;
  onSave?: (profile: BusinessProfile) => void;
}

export function BusinessProfileForm({ initialProfile, onSave }: BusinessProfileFormProps) {
  const { toast } = useToast();
  const [profile, setProfile] = useState<BusinessProfile>(
    initialProfile || {
      companyName: "",
      organizationNumber: "",
      address: "",
      postalCode: "",
      city: "",
      phoneNumber: "",
      email: "",
      website: "",
      logo: "",
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally save to backend or state management
    if (onSave) {
      onSave(profile);
    }
    
    // For now, just show a success message
    toast({
      title: "Profilen sparad",
      description: "Dina företagsuppgifter har sparats.",
    });

    // We would normally store this in localStorage for demo purposes
    localStorage.setItem("businessProfile", JSON.stringify(profile));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Företagsinformation</CardTitle>
        <CardDescription>
          Fyll i uppgifterna om ditt företag. Denna information kommer att visas på dina offerter.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Företagsnamn *</Label>
              <Input
                id="companyName"
                name="companyName"
                value={profile.companyName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="organizationNumber">Organisationsnummer *</Label>
              <Input
                id="organizationNumber"
                name="organizationNumber"
                value={profile.organizationNumber}
                onChange={handleChange}
                required
              />
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Adress *</Label>
                <Input
                  id="address"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="postalCode">Postnummer *</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={profile.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="city">Ort *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={profile.city}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">E-post *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Telefon *</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="website">Webbplats</Label>
              <Input
                id="website"
                name="website"
                value={profile.website || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Button type="submit">Spara</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
