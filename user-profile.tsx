"use client"

import { Progress } from "@/components/ui/progress"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Mail, Phone, MapPin, BookOpen, Award, Calendar, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/firebase-auth-context"
import { getUserById, updateUserProfile } from "@/lib/firebase/user-utils"
import { useToast } from "@/components/ui/use-toast"

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("profile")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [formData, setFormData] = useState<any>({})
  const [isSaving, setIsSaving] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      setLoading(true)
      setError(null)

      if (!user || !user.id) {
        throw new Error("User not authenticated")
      }

      // Get user data
      const userDoc = await getUserById(user.id)

      if (!userDoc) {
        throw new Error("User data not found")
      }

      // Set default user data
      const defaultUserData = {
        name: userDoc.name || "User",
        email: userDoc.email || "",
        phone: userDoc.phone || "",
        location: userDoc.location || "",
        bio: userDoc.bio || "No bio provided",
        profileImage: userDoc.profileImage || "/placeholder.svg",
        joinDate: new Date(userDoc.createdAt || Date.now()).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        learningLevel: userDoc.preferences?.learningLevel || "Beginner",
        interests: userDoc.preferences?.interests || [],
        certificates: userDoc.certificates || [],
        preferences: {
          emailNotifications: userDoc.preferences?.notificationSettings?.email || true,
          pushNotifications: userDoc.preferences?.notificationSettings?.inApp || false,
          weeklyDigest: userDoc.preferences?.notificationSettings?.weeklyDigest || true,
          contentLevel: userDoc.preferences?.learningStyle || "intermediate",
          studyReminders: userDoc.preferences?.notificationSettings?.studyReminders || true,
          darkMode: userDoc.preferences?.darkMode || false,
          language: userDoc.preferences?.language || "english",
        },
      }

      setUserData(defaultUserData)
      setFormData(defaultUserData)
    } catch (err) {
      console.error("Error fetching user data:", err)
      setError("Failed to load user data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSwitchChange = (id: string, checked: boolean) => {
    if (id.startsWith("interest-")) {
      const interest = id.replace("interest-", "")
      const interests = [...(formData.interests || [])]

      if (checked) {
        if (!interests.includes(interest)) {
          interests.push(interest)
        }
      } else {
        const index = interests.indexOf(interest)
        if (index !== -1) {
          interests.splice(index, 1)
        }
      }

      setFormData((prev) => ({ ...prev, interests }))
    } else if (id.startsWith("pref-")) {
      const prefName = id.replace("pref-", "")
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefName]: checked,
        },
      }))
    }
  }

  const handleSelectChange = (id: string, value: string) => {
    if (id === "learning-level") {
      setFormData((prev) => ({ ...prev, learningLevel: value }))
    } else if (id.startsWith("pref-")) {
      const prefName = id.replace("pref-", "")
      setFormData((prev) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefName]: value,
        },
      }))
    }
  }

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true)

      if (!user || !user.id) {
        throw new Error("User not authenticated")
      }

      // Prepare data for update
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        bio: formData.bio,
        preferences: {
          learningLevel: formData.learningLevel,
          interests: formData.interests,
          notificationSettings: {
            email: formData.preferences.emailNotifications,
            inApp: formData.preferences.pushNotifications,
            weeklyDigest: formData.preferences.weeklyDigest,
            studyReminders: formData.preferences.studyReminders,
          },
          learningStyle: formData.preferences.contentLevel,
          darkMode: formData.preferences.darkMode,
          language: formData.preferences.language,
        },
        updatedAt: new Date().toISOString(),
      }

      // Update user profile
      await updateUserProfile(user.id, updateData)

      // Update local state
      setUserData(formData)

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
        variant: "default",
      })
    } catch (err) {
      console.error("Error updating profile:", err)
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[600px] w-full rounded-lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">Error Loading Profile</h2>
              <p className="text-text-light mb-6">{error}</p>
              <Button onClick={fetchUserData} className="bg-primary hover:bg-primary/90">
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="space-y-6">
        <Card className="border border-gray">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <User className="h-12 w-12 text-text-light mx-auto mb-4" />
              <h2 className="text-xl font-bold text-secondary mb-2">Profile Not Available</h2>
              <p className="text-text-light mb-6">Please log in to view your profile</p>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <a href="/login">Log In</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="border border-gray">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-secondary">User Profile</CardTitle>
          <CardDescription className="text-text-light">
            Manage your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6 mt-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3 flex flex-col items-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarImage src={userData.profileImage || "/placeholder.svg"} alt={userData.name} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {userData.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm" className="mb-4">
                    Change Photo
                  </Button>
                  <div className="w-full p-4 bg-light-gray rounded-lg">
                    <h3 className="text-md font-semibold text-secondary mb-3">Account Info</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-text-light mr-2" />
                        <span className="text-sm text-text-light">Joined: {userData.joinDate}</span>
                      </div>
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-text-light mr-2" />
                        <span className="text-sm text-text-light">Level: {userData.learningLevel}</span>
                      </div>
                    </div>
                    <h3 className="text-md font-semibold text-secondary mt-4 mb-2">Interests</h3>
                    <div className="flex flex-wrap gap-2">
                      {userData.interests.map((interest: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                          {interest}
                        </Badge>
                      ))}
                      {userData.interests.length === 0 && (
                        <span className="text-sm text-text-light">No interests selected</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="w-full md:w-2/3">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 h-4 w-4 text-text-light" />
                          <Input
                            id="name"
                            placeholder="Your full name"
                            className="pl-9"
                            value={formData.name}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-text-light" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="Your email address"
                            className="pl-9"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-text-light" />
                          <Input
                            id="phone"
                            placeholder="Your phone number"
                            className="pl-9"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-text-light" />
                          <Input
                            id="location"
                            placeholder="Your location"
                            className="pl-9"
                            value={formData.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Tell us about yourself"
                        className="min-h-[120px]"
                        value={formData.bio}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="learning-level">Learning Level</Label>
                      <Select
                        value={formData.learningLevel}
                        onValueChange={(value) => handleSelectChange("learning-level", value)}
                      >
                        <SelectTrigger id="learning-level">
                          <SelectValue placeholder="Select your learning level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Interests</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="interest-web-development"
                            checked={formData.interests?.includes("Web Development")}
                            onCheckedChange={(checked) => handleSwitchChange("interest-web-development", checked)}
                          />
                          <Label htmlFor="interest-web-development">Web Development</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="interest-ui-ux-design"
                            checked={formData.interests?.includes("UI/UX Design")}
                            onCheckedChange={(checked) => handleSwitchChange("interest-ui-ux-design", checked)}
                          />
                          <Label htmlFor="interest-ui-ux-design">UI/UX Design</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="interest-mobile-development"
                            checked={formData.interests?.includes("Mobile Development")}
                            onCheckedChange={(checked) => handleSwitchChange("interest-mobile-development", checked)}
                          />
                          <Label htmlFor="interest-mobile-development">Mobile Development</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="interest-data-science"
                            checked={formData.interests?.includes("Data Science")}
                            onCheckedChange={(checked) => handleSwitchChange("interest-data-science", checked)}
                          />
                          <Label htmlFor="interest-data-science">Data Science</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="interest-ai-ml"
                            checked={formData.interests?.includes("AI/ML")}
                            onCheckedChange={(checked) => handleSwitchChange("interest-ai-ml", checked)}
                          />
                          <Label htmlFor="interest-ai-ml">AI/ML</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="interest-cloud-computing"
                            checked={formData.interests?.includes("Cloud Computing")}
                            onCheckedChange={(checked) => handleSwitchChange("interest-cloud-computing", checked)}
                          />
                          <Label htmlFor="interest-cloud-computing">Cloud Computing</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6 mt-6">
              <Card className="border border-gray">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-secondary">Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pref-emailNotifications">Email Notifications</Label>
                        <p className="text-sm text-text-light">Receive course updates and announcements via email</p>
                      </div>
                      <Switch
                        id="pref-emailNotifications"
                        checked={formData.preferences?.emailNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("pref-emailNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pref-pushNotifications">Push Notifications</Label>
                        <p className="text-sm text-text-light">Receive notifications on your device</p>
                      </div>
                      <Switch
                        id="pref-pushNotifications"
                        checked={formData.preferences?.pushNotifications}
                        onCheckedChange={(checked) => handleSwitchChange("pref-pushNotifications", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pref-weeklyDigest">Weekly Digest</Label>
                        <p className="text-sm text-text-light">Receive a weekly summary of your progress</p>
                      </div>
                      <Switch
                        id="pref-weeklyDigest"
                        checked={formData.preferences?.weeklyDigest}
                        onCheckedChange={(checked) => handleSwitchChange("pref-weeklyDigest", checked)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pref-studyReminders">Study Reminders</Label>
                        <p className="text-sm text-text-light">Get reminders to maintain your study schedule</p>
                      </div>
                      <Switch
                        id="pref-studyReminders"
                        checked={formData.preferences?.studyReminders}
                        onCheckedChange={(checked) => handleSwitchChange("pref-studyReminders", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-secondary">Learning Preferences</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pref-contentLevel">Content Detail Level</Label>
                      <Select
                        value={formData.preferences?.contentLevel}
                        onValueChange={(value) => handleSelectChange("pref-contentLevel", value)}
                      >
                        <SelectTrigger id="pref-contentLevel">
                          <SelectValue placeholder="Select content detail level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic - Simplified explanations</SelectItem>
                          <SelectItem value="intermediate">Intermediate - Balanced detail</SelectItem>
                          <SelectItem value="advanced">Advanced - In-depth content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pref-language">Language</Label>
                      <Select
                        value={formData.preferences?.language}
                        onValueChange={(value) => handleSelectChange("pref-language", value)}
                      >
                        <SelectTrigger id="pref-language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="spanish">Spanish</SelectItem>
                          <SelectItem value="french">French</SelectItem>
                          <SelectItem value="german">German</SelectItem>
                          <SelectItem value="chinese">Chinese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pref-studyTime">Preferred Study Time</Label>
                      <Select
                        defaultValue="evening"
                        onValueChange={(value) => handleSelectChange("pref-studyTime", value)}
                      >
                        <SelectTrigger id="pref-studyTime">
                          <SelectValue placeholder="Select preferred study time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="morning">Morning (6 AM - 12 PM)</SelectItem>
                          <SelectItem value="afternoon">Afternoon (12 PM - 6 PM)</SelectItem>
                          <SelectItem value="evening">Evening (6 PM - 10 PM)</SelectItem>
                          <SelectItem value="night">Night (10 PM - 6 AM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pref-sessionDuration">Preferred Session Duration</Label>
                      <Select
                        defaultValue="medium"
                        onValueChange={(value) => handleSelectChange("pref-sessionDuration", value)}
                      >
                        <SelectTrigger id="pref-sessionDuration">
                          <SelectValue placeholder="Select preferred session duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short (15-30 minutes)</SelectItem>
                          <SelectItem value="medium">Medium (30-60 minutes)</SelectItem>
                          <SelectItem value="long">Long (60-90 minutes)</SelectItem>
                          <SelectItem value="extended">Extended (90+ minutes)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-secondary">Display Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pref-darkMode">Dark Mode</Label>
                        <p className="text-sm text-text-light">Switch between light and dark theme</p>
                      </div>
                      <Switch
                        id="pref-darkMode"
                        checked={formData.preferences?.darkMode}
                        onCheckedChange={(checked) => handleSwitchChange("pref-darkMode", checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pref-textSize">Text Size</Label>
                      <Select defaultValue="medium">
                        <SelectTrigger id="pref-textSize">
                          <SelectValue placeholder="Select text size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-6 mt-6">
              <Card className="border border-gray">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-secondary">Your Certificates</CardTitle>
                  <CardDescription className="text-text-light">
                    Certificates and credentials you've earned
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userData.certificates && userData.certificates.length > 0 ? (
                    <div className="space-y-4">
                      {userData.certificates.map((cert: any) => (
                        <div key={cert.id} className="border border-gray rounded-lg p-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex items-center">
                              <Award className="h-10 w-10 text-primary mr-4" />
                              <div>
                                <h3 className="font-medium text-secondary">{cert.name}</h3>
                                <p className="text-sm text-text-light">Issued: {cert.issueDate}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                View
                              </Button>
                              <Button size="sm" variant="outline">
                                Download
                              </Button>
                              <Button size="sm" variant="outline">
                                Share
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-6">
                      <Award className="h-12 w-12 text-text-light mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-secondary mb-2">No Certificates Yet</h3>
                      <p className="text-sm text-text-light mb-4">
                        Complete courses to earn certificates and showcase your achievements.
                      </p>
                      <Button asChild>
                        <a href="/courses">Browse Courses</a>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border border-gray">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-secondary">Certification Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-light">Full Stack Web Developer</span>
                        <span className="text-sm font-medium text-secondary">33%</span>
                      </div>
                      <Progress value={33} className="h-2" />
                      <p className="text-xs text-text-light mt-1">Complete 4 more courses to earn this certification</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-light">Frontend Specialist</span>
                        <span className="text-sm font-medium text-secondary">67%</span>
                      </div>
                      <Progress value={67} className="h-2" />
                      <p className="text-xs text-text-light mt-1">Complete 1 more course to earn this certification</p>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-text-light">JavaScript Developer</span>
                        <span className="text-sm font-medium text-secondary">50%</span>
                      </div>
                      <Progress value={50} className="h-2" />
                      <p className="text-xs text-text-light mt-1">Complete 2 more courses to earn this certification</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setFormData(userData)}>
            Cancel
          </Button>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
