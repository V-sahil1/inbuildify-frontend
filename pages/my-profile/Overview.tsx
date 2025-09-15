import { useState } from "react";
import { Avatar, Button, Card, message } from "antd";
// import type { UploadProps } from 'antd';
import { useAppSelector } from "@hooks/redux";
import { CreateFormModal } from "@/components/common/Models/CreateFormModel";
import { IconBuildingBroadcastTower, IconEdit, IconMail, IconPhone, IconTag, IconUser } from "@tabler/icons-react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  firmName: string;
  slogan: string;
  logo?: string;
}

export default function Overview() {
  const { user } = useAppSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    firmName: '',
    slogan: ''
  });

  const handleEditSubmit = (values: UserProfile) => {
    // Here you would typically make an API call to update the profile
    setProfileData(values);
    setIsEditing(false);
    message.success('Profile updated successfully');
  };

  const profileFields = [
    {
      label: "Name",
      name: "name",
      type: "text" as const,
      placeholder: "Enter your full name",
      rules: [{ required: true, message: "Please enter your name" }],
    },
    {
      label: "Email",
      name: "email",
      type: "email" as const,
      placeholder: "Enter your email",
      rules: [
        { required: true, message: "Please enter your email" },
        { type: "email", message: "Please enter a valid email" },
      ],
    },
    {
      label: "Phone",
      name: "phone",
      type: "phone" as const,
      placeholder: "Enter your phone number",
      rules: [{ required: true, message: "Please enter your phone number" }],
    },
    {
      label: "Firm Name",
      name: "firmName",
      type: "text" as const,
      placeholder: "Enter your firm name",
      rules: [{ required: true, message: "Please enter your firm name" }],
    },
    {
      label: "Slogan",
      name: "slogan",
      type: "text" as const,
      placeholder: "Enter your firm slogan",
    },
    {
      label: "Logo",
      name: "logo",
      type: "image" as const,
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h5 className="text-2xl font-semibold">Profile Overview</h5>
        <Button 
          type="primary" 
          icon={<IconEdit />}
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      </div>

      <Card className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex flex-col items-center">
            <Avatar 
              size={120} 
              icon={<IconUser />} 
              src={profileData?.logo}
              className="mb-4"
            />
            <h2 className="text-xl font-semibold">{profileData?.name}</h2>
            {profileData?.firmName && (
              <p className="text-gray-600">{profileData?.firmName}</p>
            )}
          </div>

          <div className="flex-1">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-1">
                  <IconMail />
                  <span className="font-medium">Email</span>
                </div>
                <p>{profileData?.email}</p>
              </div>

              {profileData?.phone && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <IconPhone />
                    <span className="font-medium">Phone</span>
                  </div>
                  <p>{profileData?.phone}</p>
                </div>
              )}

              {profileData?.firmName && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <IconBuildingBroadcastTower />
                    <span className="font-medium">Firm</span>
                  </div>
                  <p>{profileData?.firmName}</p>
                </div>
              )}

              {profileData?.slogan && (
                <div>
                  <div className="flex items-center gap-2 text-gray-500 mb-1">
                    <IconTag />
                    <span className="font-medium">Slogan</span>
                  </div>
                  <p className="italic text-gray-600">"{profileData?.slogan}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <CreateFormModal
        title="Profile"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        onSubmit={handleEditSubmit}
        initialValues={profileData}
        fields={profileFields}
      />
    </div>
  );
}
