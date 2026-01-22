import React, { useState, useEffect, useRef } from "react";
import { User } from "@/entities/User";
import { UploadFile } from "@/integrations/Core";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User as UserIcon,
  Shield,
  Star,
  Phone,
  Mail,
  MapPin,
  Edit2,
  Camera,
  FileText,
  Image as ImageIcon,
  MoreVertical,
  LogOut,
  RefreshCw,
  Loader2,
  MessageCircle,
  Bookmark,
  ChevronRight
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HexAvatar, HexPortfolioGrid } from "@/components/ui/hexagon";
import ProfileForm from "../components/profile/ProfileForm";
import DocumentsList from "../components/profile/DocumentsList";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const avatarInputRef = useRef(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      if (!userData.user_type) setIsEditing(true);
    } catch (error) {
      console.log("User not authenticated");
    }
    setLoading(false);
  };

  const handleSave = async (profileData) => {
    try {
      await User.updateMyUserData(profileData);
      await loadUser();
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      await User.updateMyUserData({ avatar_url: file_url });
      await loadUser();
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      window.location.href = createPageUrl("SetupProfile");
    } catch (error) {
      window.location.href = createPageUrl("SetupProfile");
    }
  };

  const handleChangeProfile = async () => {
    try {
      await User.updateMyUserData({ user_type: null });
      navigate(createPageUrl("SetupProfile"));
    } catch (error) {
      console.error("Error changing profile:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mb-4" />
        <p className="text-[var(--text-secondary)]">A carregar perfil...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <HexAvatar size="lg" fallback="?" />
        <p className="text-[var(--text-secondary)] mt-4 mb-4">Não autenticado</p>
        <Button onClick={() => User.loginWithRedirect(window.location.href)} className="btn-primary">
          Fazer Login
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="min-h-screen bg-[var(--background)] p-4">
        <ProfileForm user={user} onSave={handleSave} onCancel={() => setIsEditing(false)} isFirstTime={!user.user_type} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />

      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold text-[var(--text-primary)]">Perfil Profissional</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <MoreVertical className="w-5 h-5 text-[var(--text-secondary)]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[var(--surface)] border-[var(--border)]">
              <DropdownMenuItem onClick={() => setIsEditing(true)} className="text-[var(--text-primary)]">
                <Edit2 className="w-4 h-4 mr-2" />Editar Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleChangeProfile} className="text-[var(--text-primary)]">
                <RefreshCw className="w-4 h-4 mr-2" />Trocar Perfil
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut className="w-4 h-4 mr-2" />Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 py-6">
        <div className="bg-[var(--surface)] rounded-2xl border border-[var(--border)] p-6 shadow-lg">
          <div className="flex flex-col items-center">
            {/* Hexagonal Avatar with Border */}
            <div className="relative mb-4">
              <HexAvatar
                src={user.avatar_url}
                fallback={isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : user.full_name?.charAt(0) || <UserIcon className="w-12 h-12" />}
                size="xl"
                borderColor="primary"
              />
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg z-10"
              >
                <Camera className="w-5 h-5" />
              </button>
            </div>

            {/* Name & Badge */}
            <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.full_name || "Nome não definido"}</h2>
            <div className="flex items-center gap-2 mt-2">
              {user.verified && <Shield className="w-4 h-4 text-[var(--primary)]" />}
              <span className="text-[var(--primary)] text-sm font-semibold uppercase tracking-wider">
                {user.user_type === 'worker' ? 'Empreiteiro Certificado' : 'Empregador'}
              </span>
            </div>

            {/* Stats Row */}
            <div className="flex items-center justify-center gap-8 mt-6 w-full">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <span className="font-bold text-lg text-[var(--text-primary)]">{user.rating || '0.0'}</span>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <span className="text-xs text-[var(--text-muted)]">Avaliação</span>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div className="text-center">
                <div className="font-bold text-lg text-[var(--text-primary)]">98%</div>
                <span className="text-xs text-[var(--text-muted)]">Taxa Sucesso</span>
              </div>
              <div className="w-px h-8 bg-[var(--border)]" />
              <div className="text-center">
                <div className="font-bold text-lg text-[var(--text-primary)]">7+</div>
                <span className="text-xs text-[var(--text-muted)]">Anos Exp.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 w-full">
              <Button className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-xl h-12">
                <MessageCircle className="w-5 h-5 mr-2" />Mensagem
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[var(--border)]">
                <Bookmark className="w-5 h-5 text-[var(--text-secondary)]" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills / Specialties */}
      {user.skills && user.skills.length > 0 && (
        <div className="px-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-[var(--text-primary)]">Especialidades</h3>
            <button className="text-[var(--primary)] text-sm font-medium">Ver todas</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface)] border border-[var(--border)] text-sm text-[var(--text-primary)]">
                <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Portfolio - Honeycomb Mosaic */}
      <div className="px-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-[var(--text-primary)]">Portfólio Recente</h3>
          <span className="text-[var(--primary)] text-sm font-medium">{user.portfolio_images?.length || 0} Projetos</span>
        </div>
        <HexPortfolioGrid images={user.portfolio_images || []} />
      </div>

      {/* Contact Info */}
      <div className="px-4">
        <h3 className="font-bold text-[var(--text-primary)] mb-3">Contacto</h3>
        <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
          {user.city && (
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 hexagon bg-[var(--primary)]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-[var(--text-primary)]">{user.city}</span>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />
            </div>
          )}
          {user.phone && (
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 hexagon bg-[var(--primary)]/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-[var(--text-primary)]">{user.phone}</span>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />
            </div>
          )}
          {user.email && (
            <div className="flex items-center gap-3 p-4">
              <div className="w-10 h-10 hexagon bg-[var(--primary)]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[var(--primary)]" />
              </div>
              <span className="text-[var(--text-primary)] truncate">{user.email}</span>
              <ChevronRight className="w-4 h-4 text-[var(--text-muted)] ml-auto" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}