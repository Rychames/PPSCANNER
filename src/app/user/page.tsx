"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, Label, TextInput, FileInput, Card } from "flowbite-react";
import { useAuth } from "../context/AuthContext";

interface SendFormUserModel {
  profile_image: File | null;
  first_name: string;
  last_name: string;
}

interface UserModel {
  id?: number;
  profile_image: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

const ProfileSettings = () => {
    const { user } = useAuth();
    if (user === null){
        return
    }

  const [formData, setFormData] = useState<SendFormUserModel>({
    profile_image: null,
    first_name: user.first_name,
    last_name: user.last_name,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        profile_image: e.target.files[0],
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated User Data: ", formData);
    // Aqui você pode enviar os dados para uma API
  };

  return(
    <></>
  )
};

export default ProfileSettings;
