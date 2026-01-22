import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Job } from "@/entities/Job";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Star,
  Calendar,
  MessageCircle,
  ShoppingBag,
  BarChart3,
  Briefcase,
  Users,
  MapPin,
  Clock,
  Loader2,
  ChevronRight
} from "lucide-react";
import { HexButton, HexGrid, HexAvatar } from "@/components/ui/hexagon";

// Explore Hub Categories
const hubCategories = [
  { id: "featured", icon: <Star className="w-6 h-6" />, label: "Featured\nProjects", color: "featured" },
  { id: "pros", icon: <Users className="w-6 h-6" />, label: "Top Rated\nPros", color: "pros" },
  { id: "schedules", icon: <Calendar className="w-6 h-6" />, label: "Active\nSchedules", color: "schedules" },
  { id: "messages", icon: <MessageCircle className="w-6 h-6" />, label: "Direct\nMessages", color: "messages" },
  { id: "market", icon: <ShoppingBag className="w-6 h-6" />, label: "Tools\nMarket", color: "market" },
  { id: "analytics", icon: <BarChart3 className="w-6 h-6" />, label: "Job\nAnalytics", color: "analytics" },
];

// Recent Update Item
function UpdateItem({ image, title, subtitle, time }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-[var(--surface)] rounded-xl border border-[var(--border)]">
      {/* Hex Image */}
      <div className="w-16 h-18 flex-shrink-0">
        <div className="hexagon-pointy w-full h-full bg-[var(--surface-secondary)] overflow-hidden">
          {image && <img src={image} alt="" className="w-full h-full object-cover" />}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{subtitle}</p>
        <p className="text-xs text-[var(--primary)] mt-2">{time}</p>
      </div>
      
      <ChevronRight className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ activeProjects: 0, pendingBids: 0 });
  const [recentJobs, setRecentJobs] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);

      if (!userData.user_type) {
        navigate(createPageUrl("SetupProfile"));
        return;
      }

      // Load jobs based on user type
      let jobs = [];
      if (userData.user_type === 'employer') {
        jobs = await Job.filter({ employer_id: userData.id }, "-created_date", 5);
      } else if (userData.user_type === 'worker') {
        jobs = await Job.filter({ worker_id: userData.id }, "-created_date", 5);
      } else {
        jobs = await Job.list("-created_date", 5);
      }

      setRecentJobs(jobs);
      setStats({
        activeProjects: jobs.filter(j => j.status === 'in_progress').length,
        pendingBids: jobs.filter(j => j.status === 'open').length
      });

    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCategoryClick = (categoryId) => {
    switch (categoryId) {
      case "featured":
      case "market":
        navigate(createPageUrl("Dashboard"));
        break;
      case "pros":
        navigate(createPageUrl("Dashboard"));
        break;
      case "schedules":
        navigate(createPageUrl("Calendar"));
        break;
      case "messages":
        navigate(createPageUrl("Chat"));
        break;
      case "analytics":
        navigate(createPageUrl("Applications"));
        break;
      default:
        navigate(createPageUrl("Dashboard"));
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-[var(--background)]">
        <Loader2 className="w-12 h-12 text-[var(--primary)] animate-spin mb-4" />
        <p className="text-[var(--text-secondary)]">A carregar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] pb-24">
      {/* Header */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-muted)]">Welcome back,</p>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              {user?.full_name?.split(' ')[0] || 'User'}
            </h1>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            className="relative"
            onClick={() => navigate(createPageUrl("Notifications"))}
          >
            <Bell className="w-5 h-5 text-[var(--text-secondary)]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--error)] rounded-full" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)]" />
          <Input
            placeholder="Find professionals or services..."
            className="pl-10 bg-[var(--surface-secondary)] border-[var(--border)] rounded-xl h-12"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 hexagon bg-[var(--category-schedules)]/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[var(--category-schedules)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Active Projects</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{stats.activeProjects}</p>
            </div>
          </div>
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border)] p-4 flex items-center gap-3">
            <div className="w-10 h-10 hexagon bg-[var(--primary)]/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Pending Bids</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">{stats.pendingBids}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Hub - Honeycomb Grid */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Explore Hub</h2>
        
        <HexGrid columns={2} className="gap-y-6">
          {hubCategories.map((category) => (
            <HexButton
              key={category.id}
              icon={category.icon}
              label={category.label}
              borderColor={category.color}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))}
        </HexGrid>
      </div>

      {/* Recent Updates */}
      <div className="px-4 mt-8">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Recent Updates</h2>
        
        <div className="space-y-3">
          {recentJobs.length > 0 ? (
            recentJobs.slice(0, 3).map((job) => (
              <UpdateItem
                key={job.id}
                image={job.image_urls?.[0]}
                title={job.title}
                subtitle={job.description?.substring(0, 60) + '...' || 'No description'}
                time={new Date(job.created_date).toLocaleDateString()}
              />
            ))
          ) : (
            <>
              <UpdateItem
                title="Downtown Reno Project"
                subtitle="New blueprint uploaded by Architect."
                time="2 hours ago"
              />
              <UpdateItem
                title="New Review"
                subtitle="John D. gave you 5 stars on the plumbing job."
                time="5 hours ago"
              />
            </>
          )}
        </div>
      </div>

      {/* Tap to Navigate Hint */}
      <div className="text-center mt-8 mb-4">
        <p className="text-sm text-[var(--text-muted)]">Tap a hexagon to navigate</p>
      </div>
    </div>
  );
}